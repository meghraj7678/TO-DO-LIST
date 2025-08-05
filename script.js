// Get DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAll");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
  }
}

// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
  });

  filteredTasks.forEach((task, filteredIndex) => {
    // Get original index from tasks[]
    const originalIndex = tasks.indexOf(filteredTasks[filteredIndex]);

    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = task.text;
    li.appendChild(span);

    if (!task.completed) {
      const tick = document.createElement("button");
      tick.innerHTML = "✅";
      tick.title = "Mark as completed";
      tick.addEventListener("click", () => toggleTask(originalIndex));
      li.appendChild(tick);

      const cross = document.createElement("button");
      cross.innerHTML = "❌";
      cross.title = "Delete task";
      cross.addEventListener("click", () => deleteTask(originalIndex));
      li.appendChild(cross);
    }

    taskList.appendChild(li);
  });
}

// Clear all tasks
function clearAllTasks() {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "🌙";
});

// Filter buttons
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Button Events
addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);

// Initial render
renderTasks();