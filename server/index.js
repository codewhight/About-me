import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Database file setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure database directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading database file:', error);
    return [];
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

// REST API Endpoints

// 1. Get all todos
app.get('/api/todos', (req, res) => {
  const todos = readDB();
  res.json(todos);
});

// 2. Get single todo
app.get('/api/todos/:id', (req, res) => {
  const todos = readDB();
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

// 3. Create a new todo
app.post('/api/todos', (req, res) => {
  const { title, content, tags } = req.body;
  
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Title is required and must be a string' });
  }

  const todos = readDB();
  const newTodo = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    content: (content || '').trim(),
    tags: Array.isArray(tags) ? tags.map(t => t.trim()).filter(Boolean) : [],
    done: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  todos.push(newTodo);
  if (writeDB(todos)) {
    res.status(201).json(newTodo);
  } else {
    res.status(500).json({ message: 'Failed to write database' });
  }
});

// 4. Update a todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, tags, done } = req.body;

  const todos = readDB();
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  const existingTodo = todos[todoIndex];
  
  const updatedTodo = {
    ...existingTodo,
    title: title !== undefined ? title.trim() : existingTodo.title,
    content: content !== undefined ? content.trim() : existingTodo.content,
    tags: Array.isArray(tags) ? tags.map(t => t.trim()).filter(Boolean) : existingTodo.tags,
    done: done !== undefined ? Boolean(done) : existingTodo.done,
    updatedAt: Date.now()
  };

  // Validate title is not empty if provided
  if (title !== undefined && !updatedTodo.title) {
    return res.status(400).json({ message: 'Title cannot be empty' });
  }

  todos[todoIndex] = updatedTodo;
  
  if (writeDB(todos)) {
    res.json(updatedTodo);
  } else {
    res.status(500).json({ message: 'Failed to write database' });
  }
});

// 5. Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readDB();
  const initialLength = todos.length;
  
  const filteredTodos = todos.filter(t => t.id !== id);
  
  if (filteredTodos.length === initialLength) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  if (writeDB(filteredTodos)) {
    res.json({ message: 'Todo deleted successfully', id });
  } else {
    res.status(500).json({ message: 'Failed to write database' });
  }
});

// --- Additional Database Features (Leaderboards & Message Board) ---
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const RECORDS_FILE = path.join(DATA_DIR, 'game_records.json');

// Ensure files exist
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(RECORDS_FILE)) {
  fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function readJSON(file) {
  try {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading file:', file, error);
    return [];
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', file, error);
    return false;
  }
}

// 6. Get all messages
app.get('/api/messages', (req, res) => {
  const messages = readJSON(MESSAGES_FILE);
  res.json(messages);
});

// 7. Create a new message
app.post('/api/messages', (req, res) => {
  const { visitor_name, visitor_email, message_text } = req.body;

  if (!visitor_name || !visitor_name.trim() || !message_text || !message_text.trim()) {
    return res.status(400).json({ message: 'Name and message text are required' });
  }

  const messages = readJSON(MESSAGES_FILE);
  const newMsg = {
    id: Date.now(),
    visitor_name: visitor_name.trim(),
    visitor_email: (visitor_email || '').trim(),
    message_text: message_text.trim(),
    reply_text: null,
    is_visible: true, // Auto visible in prototype
    created_at: new Date().toISOString()
  };

  messages.push(newMsg);
  if (writeJSON(MESSAGES_FILE, messages)) {
    res.status(201).json(newMsg);
  } else {
    res.status(500).json({ message: 'Failed to write database' });
  }
});

// 8. Get all leaderboard records
app.get('/api/leaderboard', (req, res) => {
  const records = readJSON(RECORDS_FILE);
  res.json(records);
});

// Start server
app.listen(PORT, () => {
  console.log(`[Todo-Blog Backend] Server is running on http://localhost:${PORT}`);
});
