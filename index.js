const userNameDisplay = document.getElementById("username");
const userPositionDisplay = document.getElementById("userPosition");
const currentDateDisplay = document.getElementById("currentDate");
const currentTimeDisplay = document.getElementById("currentTime");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("submit-btn");
const priorityBtns = document.querySelectorAll(".chip-btn");
const deleteAllBtns = document.querySelectorAll(".delete-all-btn");
const todoListContainer = document.getElementById("todayList");
const completedListContainer = document.getElementById("completedList");

// Retrieve user info from LocalStorage
const storedName = localStorage.getItem("username");
const storedPosition = localStorage.getItem("userPosition");

// Initialize state
let currentPriority = "low";
let taskList = [];

// Updates the clock and date display in real-time.
function updateClock() {
  const now = new Date();

  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  currentDateDisplay.textContent = now.toLocaleDateString("en-US", dateOptions);
  currentTimeDisplay.textContent = now.toLocaleTimeString("en-US", timeOptions);
}

// Saves the current taskList array to LocalStorage.
function saveData() {
  localStorage.setItem("myTaskData", JSON.stringify(taskList));
}

// Handles user greeting logic (load from storage or prompt user).
function initUserGreeting() {
  if (storedName) {
    userNameDisplay.textContent = storedName;
    userPositionDisplay.textContent = storedPosition;
  } else {
    const inputName = prompt("What's your name?");
    const inputPosition = prompt("What's your position?");

    // Simple validation to avoid null if user cancels prompt
    const finalName = inputName || "Guest";
    const finalPosition = inputPosition || "Developer";

    localStorage.setItem("username", finalName);
    localStorage.setItem("userPosition", finalPosition);

    userNameDisplay.textContent = finalName;
    userPositionDisplay.textContent = finalPosition;
  }
}

/**
 * Renders the task list to the DOM based on the taskList array.
 * Clears existing lists and re-builds them.
 */
function renderTasks() {
  todoListContainer.innerHTML = "";
  completedListContainer.innerHTML = "";

  taskList.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("tasks");

    // Determine status classes and attributes
    const checkStatusTask = task.isCompleted ? "checked" : "";
    const statusClass = task.isCompleted ? "completed" : "";

    taskItem.innerHTML = `
    <div class="check-detail">
        <input
            type="checkbox"
            name="checkbox"
            aria-label="Tandai tugas sebagai selesai"
            ${checkStatusTask} />

        <div class="detail-task">
            <h4 class="${task.styleDate} ${statusClass}">${task.text}</h4>

            <div class="additional-info">
                <span class="priority ${task.priority}">${task.priority}</span>
                <div class="deadline ${task.styleDate}">
                    <span class="material-symbols-outlined">
                        calendar_today
                    </span>
                    <span class="due">${task.dateDisplay}</span>
                </div>
            </div>
        </div>
    </div>

    <button class="delete-btn" aria-label="Hapus tugas">
        <span class="material-symbols-outlined"> close </span>
    </button>
    `;

    // Append to appropriate container based on status
    if (task.isCompleted) {
      taskItem.classList.add("completed");
      completedListContainer.appendChild(taskItem);
    } else {
      todoListContainer.appendChild(taskItem);
    }

    // Event Listener: Delete specific task
    const deleteBtn = taskItem.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      taskList = taskList.filter((item) => item.id !== task.id);
      saveData();
      renderTasks();
    });

    // Event Listener: Toggle completion status
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", () => {
      task.isCompleted = !task.isCompleted;
      saveData();
      renderTasks();
    });
  });
}

// Resets priority selection to 'low' (default).
function resetPriorityToLow() {
  currentPriority = "low";

  priorityBtns.forEach((btn) => {
    if (btn.dataset.value === "low") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Handles adding a new task to the list.
function handleAddTask(e) {
  e.preventDefault(); /* Prevent form submission reload */

  const taskText =
    taskInput.value.trim(); /* mtake the value from the input and remove spaces at the beginning and end of the sentence */
  const inputDateVal = dateInput.value;

  // Validation: Task text cannot be empty
  if (taskText.length === 0) {
    alert("The task must be written down");
    return;
  }

  // capture today's data again for the date class if/else logic
  const todayDate = new Date();
  let day = String(todayDate.getDate()).padStart(2, "0");
  let month = String(todayDate.getMonth() + 1).padStart(
    2,
    "0"
  ); /* Since it starts from 0, it must be added to 1, then to ensure it appears with 2 digits. */
  let year = String(todayDate.getFullYear()).padStart(2, "0");
  let todayString = `${year}-${month}-${day}`;

  let dateDisplay =
    ""; /* store the inputDateVal value in a variable first so that if it is empty, it can be processed later so that it is not immediately empty */
  let dateClass = ""; /* new class for additional styling */

  if (inputDateVal === "") {
    dateDisplay = "No date";
    dateClass = "";
  } else {
    if (inputDateVal < todayString) {
      dateClass = "overdue";
      dateDisplay = `${dateClass}: ${inputDateVal}`;
    } else if (inputDateVal === todayString) {
      dateClass = "today";
      dateDisplay = `${dateClass}`;
    } else {
      dateClass = "future";
      dateDisplay = `${inputDateVal}`;
    }
  }

  // store other data used in task render
  const newTaskData = {
    id: Date.now(),
    text: taskText,
    priority: currentPriority,
    dateDisplay: dateDisplay,
    styleDate: dateClass,
    isCompleted: false,
  };

  taskList.push(newTaskData);
  saveData();
  renderTasks();

  // Reset form inputs
  taskInput.value = "";
  dateInput.value = "";
  resetPriorityToLow();
}

// Loads task data from LocalStorage on startup
function loadTasks() {
  const data = localStorage.getItem("myTaskData");
  if (data) {
    taskList = JSON.parse(data);
    renderTasks();
  }
}

addTaskBtn.addEventListener("click", handleAddTask);

// An easy technique to avoid writing event listeners for each button priority one by one
priorityBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all, add to clicked
    priorityBtns.forEach((item) => {
      item.classList.remove("active");
    });

    btn.classList.add("active");

    currentPriority = btn.dataset.value;
  });
});

deleteAllBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const confirmMessage = confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (confirmMessage) {
      taskList = []; /* Clear array */
      saveData();
      renderTasks();
    }
  });
});

/* Run updateClock repeatedly to ensure real-time every second */
setInterval(updateClock, 1000);
updateClock(); // Initial call to avoid delay

// Initialize User Info
initUserGreeting();

// Load Data
loadTasks();
