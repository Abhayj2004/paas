document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const todoForm = document.getElementById("todo-form");
    const taskInput = document.getElementById("task-input");

    // Fetch tasks from the server
    function fetchTasks() {
        fetch("/tasks")
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>
                            ${task.title}
                        </span>
                        <button onclick="toggleTask(${task.id}, ${!task.completed})">
                            ${task.completed ? "Undo" : "Complete"}
                        </button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    `;
                    taskList.appendChild(li);
                });
            });
    }

    // Add a task
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch("/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: taskInput.value })
        }).then(() => {
            taskInput.value = "";
            fetchTasks();
        });
    });

    // Delete a task
    window.deleteTask = (id) => {
        fetch(`/tasks/${id}`, { method: "DELETE" }).then(fetchTasks);
    };

    // Toggle task completion
    window.toggleTask = (id, completed) => {
        fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed })
        }).then(fetchTasks);
    };

    fetchTasks();
});
