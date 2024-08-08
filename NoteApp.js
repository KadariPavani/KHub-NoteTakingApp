const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
let isUpdate = false, updateId;
let username = localStorage.getItem('username'); // Retrieve the username from local storage

if (!username) {
  alert("You must be logged in to access this page.");
  window.location.href = '/index.html'; // Redirect to login page if no username
}

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

async function showNotes() {
  const response = await fetch(`http://localhost:8000/notes/${username}`);
  if (response.ok) {
    const notes = await response.json();
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note) => {
      let filterDesc = note.description.replaceAll("\n", '<br/>');
      let liTag = `<li class="note">
                      <div class="details">
                        <p>${note.title}</p>
                        <span>${filterDesc}</span>
                      </div>
                      <div class="bottom-content">
                        <span>${note.date}</span>
                        <div class="settings">
                          <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                          <ul class="menu">
                            <li onclick="updateNote('${note.id}', '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                            <li onclick="deleteNote('${note.id}')"><i class="uil uil-trash"></i>Delete</li>
                          </ul>
                        </div>
                      </div>
                    </li>`;
      addBox.insertAdjacentHTML("afterend", liTag);
    });
  } else {
    alert("Failed to fetch notes");
  }
}
showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

async function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  const response = await fetch(`http://localhost:8000/notes/${noteId}?username=${username}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    showNotes();
  } else {
    alert("Failed to delete note");
  }
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", async e => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}`, username };
    let url = 'http://localhost:8000/notes';
    let method = isUpdate ? 'PUT' : 'POST';
    if (isUpdate) {
      url += `/${updateId}?username=${username}`;
    } else {
      url += `?username=${username}`;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteInfo)
      });
      if (response.ok) {
        showNotes();
        closeIcon.click();
      } else {
        alert(isUpdate ? "Failed to update note" : "Failed to create note");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Check console for details.");
    }
  }
});




/*
const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
let isUpdate = false, updateId;
let username = localStorage.getItem('username'); // Retrieve the username from local storage

if (!username) {
    alert("You must be logged in to access this page.");
    window.location.href = '/index.html'; // Redirect to login page if no username
}

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

async function showNotes() {
    const response = await fetch(`http://localhost:8000/notes/${username}`);
    if (response.ok) {
        const notes = await response.json();
        document.querySelectorAll(".note").forEach(li => li.remove());
        notes.forEach((note) => {
            let filterDesc = note.description.replaceAll("\n", '<br/>');
            let liTag = `<li class="note">
                            <div class="details">
                                <p>${note.title}</p>
                                <span>${filterDesc}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${note.date}</span>
                                <div class="settings">
                                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                    <ul class="menu">
                                        <li onclick="updateNote('${note.id}', '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                        <li onclick="deleteNote('${note.id}')"><i class="uil uil-trash"></i>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
            addBox.insertAdjacentHTML("afterend", liTag);
        });
    } else {
        alert("Failed to fetch notes");
    }
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

async function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    const response = await fetch(`http://localhost:8000/notes/${noteId}?username=${username}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        showNotes();
    } else {
        alert("Failed to delete note");
    }
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", async e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if (title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = { title, description, date: `${month} ${day}, ${year}`, username };
        let url = 'http://localhost:8000/notes';
        let method = isUpdate ? 'PUT' : 'POST';
        if (isUpdate) {
            url += `/${updateId}?username=${username}`;
        } else {
            url += `?username=${username}`;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteInfo)
            });
            if (response.ok) {
                showNotes();
                closeIcon.click();
            } else {
                alert(isUpdate ? "Failed to update note" : "Failed to create note");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Check console for details.");
        }
    }
});
























======================
FINAL CODE
======================

const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
let isUpdate = false, updateId;
let username = localStorage.getItem('username'); // Retrieve the username from local storage

if (!username) {
    alert("You must be logged in to access this page.");
    window.location.href = '/index.html'; // Redirect to login page if no username
}

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

async function showNotes() {
    const response = await fetch(`http://localhost:8000/notes/${username}`);
    if (response.ok) {
        const notes = await response.json();
        document.querySelectorAll(".note").forEach(li => li.remove());
        notes.forEach((note) => {
            let filterDesc = note.description.replaceAll("\n", '<br/>');
            let liTag = `<li class="note">
                            <div class="details">
                                <p>${note.title}</p>
                                <span>${filterDesc}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${note.date}</span>
                                <div class="settings">
                                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                    <ul class="menu">
                                        <li onclick="updateNote('${note.id}', '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                        <li onclick="deleteNote('${note.id}')"><i class="uil uil-trash"></i>Delete</li>
                                    </ul>
                                </div>
                            </div>
                        </li>`;
            addBox.insertAdjacentHTML("afterend", liTag);
        });
    } else {
        alert("Failed to fetch notes");
    }
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

async function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    const response = await fetch(`http://localhost:8000/notes/${noteId}?username=${username}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        showNotes();
    } else {
        alert("Failed to delete note");
    }
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", async e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if (title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = { title, description, date: `${month} ${day}, ${year}`, username };
        let url = 'http://localhost:8000/notes';
        let method = isUpdate ? 'PUT' : 'POST';
        if (isUpdate) {
            url += `/${updateId}?username=${username}`;
        } else {
            url += `?username=${username}`;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteInfo)
            });
            if (response.ok) {
                showNotes();
                closeIcon.click();
            } else {
                alert(isUpdate ? "Failed to update note" : "Failed to create note");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Check console for details.");
        }
    }
});




*/