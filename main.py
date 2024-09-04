from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from bson import ObjectId
from typing import Optional
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch MongoDB URI from environment variables
mongodb_uri = os.getenv("MONGODB_URI")
if not mongodb_uri:
    raise ValueError("MONGODB_URI environment variable is not set")

client = AsyncIOMotorClient(mongodb_uri)
db = client.DREAM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    email: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class NoteIn(BaseModel):
    title: str
    description: str

class NoteOut(NoteIn):
    id: str
    date: str

@app.post("/register")
async def register_user(user: User):
    existing_user = await db.KHubRegistersData.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user.password = pwd_context.hash(user.password)
    result = await db.KHubRegistersData.insert_one(user.dict())
    if result.inserted_id:
        return {"message": "User registered successfully"}
    raise HTTPException(status_code=400, detail="Registration failed")

@app.post("/login")
async def login_user(login: Login):
    user = await db.KHubRegistersData.find_one({"username": login.username})
    if user and pwd_context.verify(login.password, user["password"]):
        return {"message": "Login successful", "username": login.username}
    raise HTTPException(status_code=400, detail="Invalid username or password")

@app.post("/notes")
async def create_note(note: NoteIn, username: str):
    user = await db.KHubRegistersData.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    currentDate = datetime.now()
    note_data = {
        "title": note.title,
        "description": note.description,
        "date": f"{currentDate.strftime('%B %d, %Y')}",
        "username": username
    }

    result = await db.Notes.insert_one(note_data)
    if result.inserted_id:
        return {"message": "Note created successfully"}
    raise HTTPException(status_code=400, detail="Note creation failed")

@app.get("/notes/{username}")
async def get_notes(username: str):
    notes = await db.Notes.find({"username": username}).to_list(length=100)
    return [NoteOut(id=str(note["_id"]), title=note["title"], description=note["description"], date=note["date"]) for note in notes]

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str, username: str):
    result = await db.Notes.delete_one({"_id": ObjectId(note_id), "username": username})
    if result.deleted_count:
        return {"message": "Note deleted successfully"}
    raise HTTPException(status_code=404, detail="Note not found or not owned by the user")

@app.put("/notes/{note_id}")
async def update_note(note_id: str, note: NoteIn, username: str):
    result = await db.Notes.update_one({"_id": ObjectId(note_id), "username": username}, {"$set": {"title": note.title, "description": note.description}})
    if result.modified_count:
        return {"message": "Note updated successfully"}
    raise HTTPException(status_code=404, detail="Note not found or not owned by the user")

# Serve the static files
app.mount("/static", StaticFiles(directory="."), name="static")
# Serve images from the IMAGES directory
app.mount("/images", StaticFiles(directory="IMAGES"), name="images")

@app.get("/", response_class=HTMLResponse)
async def root():
    with open("index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



'''

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from bson import ObjectId
from typing import Optional
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch MongoDB URI from environment variables
mongodb_uri = os.getenv("MONGODB_URI")
if not mongodb_uri:
    raise ValueError("MONGODB_URI environment variable is not set")

client = AsyncIOMotorClient(mongodb_uri)
db = client.DREAM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    email: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class NoteIn(BaseModel):
    title: str
    description: str

class NoteOut(NoteIn):
    id: str
    date: str

@app.post("/register")
async def register_user(user: User):
    existing_user = await db.KHubRegistersData.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user.password = pwd_context.hash(user.password)
    result = await db.KHubRegistersData.insert_one(user.dict())
    if result.inserted_id:
        return {"message": "User registered successfully"}
    raise HTTPException(status_code=400, detail="Registration failed")

@app.post("/login")
async def login_user(login: Login):
    user = await db.KHubRegistersData.find_one({"username": login.username})
    if user and pwd_context.verify(login.password, user["password"]):
        return {"message": "Login successful", "username": login.username}
    raise HTTPException(status_code=400, detail="Invalid username or password")

@app.post("/notes")
async def create_note(note: NoteIn, username: str):
    user = await db.KHubRegistersData.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    currentDate = datetime.now()
    note_data = {
        "title": note.title,
        "description": note.description,
        "date": f"{currentDate.strftime('%B %d, %Y')}",
        "username": username
    }

    result = await db.Notes.insert_one(note_data)
    if result.inserted_id:
        return {"message": "Note created successfully"}
    raise HTTPException(status_code=400, detail="Note creation failed")

@app.get("/notes/{username}")
async def get_notes(username: str):
    notes = await db.Notes.find({"username": username}).to_list(length=100)
    return [NoteOut(id=str(note["_id"]), title=note["title"], description=note["description"], date=note["date"]) for note in notes]

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str, username: str):
    result = await db.Notes.delete_one({"_id": ObjectId(note_id), "username": username})
    if result.deleted_count:
        return {"message": "Note deleted successfully"}
    raise HTTPException(status_code=404, detail="Note not found or not owned by the user")

@app.put("/notes/{note_id}")
async def update_note(note_id: str, note: NoteIn, username: str):
    result = await db.Notes.update_one({"_id": ObjectId(note_id), "username": username}, {"$set": {"title": note.title, "description": note.description}})
    if result.modified_count:
        return {"message": "Note updated successfully"}
    raise HTTPException(status_code=404, detail="Note not found or not owned by the user")

@app.get("/")
async def root():
    return {"message": "Welcome to the Note Taking App API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)





































FINAL CODE
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from bson import ObjectId
from typing import Optional
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch MongoDB URI from environment variables
mongodb_uri = os.getenv("MONGODB_URI")
if not mongodb_uri:
    raise ValueError("MONGODB_URI environment variable is not set")

client = AsyncIOMotorClient(mongodb_uri)
db = client.DREAM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    email: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class NoteIn(BaseModel):
    title: str
    description: str

class NoteOut(NoteIn):
    id: str
    date: str

@app.post("/register")
async def register_user(user: User):
    existing_user = await db.KHubRegistersData.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user.password = pwd_context.hash(user.password)
    result = await db.KHubRegistersData.insert_one(user.dict())
    if result.inserted_id:
        return {"message": "User registered successfully"}
    raise HTTPException(status_code=400, detail="Registration failed")

@app.post("/login")
async def login_user(login: Login):
    user = await db.KHubRegistersData.find_one({"username": login.username})
    if user and pwd_context.verify(login.password, user["password"]):
        return {"message": "Login successful", "username": login.username}
    raise HTTPException(status_code=400, detail="Invalid username or password")

@app.post("/notes")
async def create_note(note: NoteIn, username: str):
    user = await db.KHubRegistersData.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    currentDate = datetime.now()
    note_data = {
        "title": note.title,
        "description": note.description,
        "date": f"{currentDate.strftime('%B %d, %Y')}",
        "username": username
    }

    result = await db.Notes.insert_one(note_data)
    if result.inserted_id:
        return {"message": "Note created successfully"}
    raise HTTPException(status_code=400, detail="Note creation failed")

@app.get("/notes/{username}")
async def get_notes(username: str):
    notes = await db.Notes.find({"username": username}).to_list(length=100)
    return [NoteOut(id=str(note["_id"]), title=note["title"], description=note["description"], date=note["date"]) for note in notes]

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str, username: str):
    result = await db.Notes.delete_one({"_id": ObjectId(note_id), "username": username})
    if result.deleted_count:
        return {"message": "Note deleted successfully"}
    raise HTTPException(status_code=404, detail="Note not found or not owned by the user")

@app.put("/notes/{note_id}")
async def update_note(note_id: str, note: NoteIn, username: str):
    result = await db.Notes.update_one({"_id": ObjectId(note_id), "username": username}, {"$set": {"title": note.title, "description": note.description}})
    if result.modified_count:
        return {"message": "Note updated successfully"}
    raise HTTPException(status_code=404, detail="Note not found or not owned by the user")

@app.get("/")
async def root():
    return {"message": "Welcome to the Note Taking App API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)










'''