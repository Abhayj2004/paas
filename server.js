// const express = require('express');
// const app = express();

// // Set up a simple route
// app.get('/', (req, res) => {
//     res.send('Hello, World! Welcome to my PaaS Web App.');
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "todo_user",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "todo_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Get all tasks
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new task
app.post("/tasks", (req, res) => {
    const { title } = req.body;
    db.query("INSERT INTO tasks (title) VALUES (?)", [title], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, title, completed: false });
    });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.json({ message: "Task deleted" });
    });
});

// Update task completion
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.query("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], (err) => {
        if (err) throw err;
        res.json({ message: "Task updated" });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
