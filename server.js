const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Database Connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
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
