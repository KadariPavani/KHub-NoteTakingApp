
function showLoginForm() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
}

function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

async function register(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const response = await fetch('http://localhost:8000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });

  const result = await response.json();
  if (response.ok) {
    alert('Registration successful!');
    showLoginForm();
  } else {
    alert(result.detail);
  }
}

async function login(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  if (response.ok) {
    alert('Login successful!');
    localStorage.setItem('username', username); // Store the username in local storage
    document.querySelector('.login-form').style.display = 'none';
    document.getElementById('notes').style.display = 'block';
    showNotes(); // Fetch and display notes after successful login
  } else {
    alert(result.detail);
  }
}

  /*
function showLoginForm() {
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('register-form').style.display = 'none';
    }

    function showRegisterForm() {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('register-form').style.display = 'block';
    }

    async function register(event) {
      event.preventDefault();
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        showLoginForm();
      } else {
        alert(result.detail);
      }
    }

    async function login(event) {
      event.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Login successful!');
        document.querySelector('.login-form').style.display = 'none';
        document.getElementById('notes').style.display = 'block';
      } else {
        alert(result.detail);
      }
    }




  
    =================================
    FINAL CODE
    =================================

    function showLoginForm() {
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('register-form').style.display = 'none';
    }

    function showRegisterForm() {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('register-form').style.display = 'block';
    }

    async function register(event) {
      event.preventDefault();
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        showLoginForm();
      } else {
        alert(result.detail);
      }
    }

    async function login(event) {
      event.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Login successful!');
        document.querySelector('.login-form').style.display = 'none';
        document.getElementById('notes').style.display = 'block';
      } else {
        alert(result.detail);
      }
    }



    
    */