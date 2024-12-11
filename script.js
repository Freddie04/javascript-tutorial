const taskInput = document.querySelector(".task-input");
console.log(taskInput);
const addButton = document.querySelector(".add-btn");
const activeTasksElement = document.querySelector(".tasks-active");
const completedTasksElement = document.querySelector(".tasks-completed");
// STATS VARIABLE
const numTotalTaskElement = document.querySelector(".total-tasks");
const numTasksCompleted = document.querySelector(".number_tasks-completed");
const numTasksActive = document.querySelector(".number_tasks-active");
console.log(numTotalTaskElement);

// FUNCTIONS
function addTaskElement(container, taskText, status, id) {
  container.innerHTML += ` <div class="task ${status}" id=${id}>
<input type="checkbox" ${
    status === "completed" ? "checked" : ""
  } class="checkbox" />
<p class="task-text">${taskText}</p>
<div class="crud-btn">
  <button class="update-btn">Update</button>
  <button class="delete-btn">Delete</button>
</div> 
`;
}

// GLOBAL VARIABLE
let tasks = JSON.parse(localStorage.getItem("localTasks")) || [];
console.log(tasks);

let editMode = false;
let editId = null;
let editElement = null;

// UPDATING THE NUMBER OF ACTIVE, COMPLETED AND TOTAL TASKS STORED
function updateTasksText() {
  const activeTasksNum = tasks.filter((el) => el.status === "active").length;
  const completedTasksNum = tasks.filter(
    (el) => el.status === "completed"
  ).length;

  numTotalTaskElement.textContent = tasks.length;
  numTasksCompleted.textContent = completedTasksNum;
  numTasksActive.textContent = activeTasksNum;
}

updateTasksText();

function updateDatabase(tasks) {
  localStorage.setItem("localTasks", JSON.stringify(tasks));
}

function updateTasksStatus(tasks, taskId, status, parentTaskElement, taskText) {
  tasks = tasks.map((element, i) =>
    i === taskId ? { ...element, status: status } : element
  );
  updateDatabase(tasks);
  parentTaskElement.remove();
  addTaskElement(
    status === "completed" ? completedTasksElement : activeTasksElement,
    taskText,
    status,
    taskId
  );
}

// ELEMENT INITIALIZATION
tasks.forEach((el, i) => {
  console.log(el.status);
  if (el.status === "active") {
    addTaskElement(activeTasksElement, el.task, el.status, i);
  } else {
    addTaskElement(completedTasksElement, el.task, el.status, i);
  }
});

// ADD OR UPDATE TASK
addButton.addEventListener("click", function (e) {
  // console.log(taskInput.value);
  if (!editMode) {
    if (!taskInput.value) return;
    const newTask = taskInput.value;
    tasks.push({ task: newTask, status: "active" });
    localStorage.setItem("localTasks", JSON.stringify(tasks));
    const taskId = tasks.length - 1;

    activeTasksElement.innerHTML += `
      <div class="task active" id=${taskId}>
                <input type="checkbox" class="checkbox" />
                <p class="task-text">${taskInput.value}</p>
                <div class="crud-btn">
                  <button class="update-btn">Update</button>
                  <button class="delete-btn">Delete</button>
                </div> 
    `;
  } else {
    tasks = tasks.map((el, i) =>
      i === editId ? { ...el, task: taskInput.value } : el
    );
    updateDatabase(tasks);
    editElement.textContent = taskInput.value;
    editMode = false;
    editId = null;
    editElement = null;
    e.target.textContent = "+";
  }

  taskInput.value = " ";

  updateTasksText();
});

//
// LISTENING FOR EVENTS IN THE TASKS CONTAINERS
document.querySelectorAll(".tasks").forEach((element, _i) =>
  element.addEventListener("click", function (e) {
    // DELETING A TASK

    console.log(e.target.className);
    if (e.target.className === "delete-btn") {
      const parentTaskElement = e.target.parentElement.parentElement;
      const id = +parentTaskElement.id;

      tasks = tasks.filter((_, i) => i !== id);
      updateDatabase(tasks);
      console.log(tasks);
      parentTaskElement.remove();

      updateTasksText();
    }
    // UPDATING A TASK
    if (e.target.className === "update-btn") {
      editMode = true;
      addButton.textContent = "🖊";
      const parentTaskElement = e.target.parentElement.parentElement;

      // EXTRACTING THE P TAG THAT WOULD BE EDITED
      editElement = parentTaskElement.children.item(1);
      editId = +parentTaskElement.id;
      taskInput.value = editElement.textContent;
    }
    // SWITCHING STATUS
    if (e.target.className === "checkbox") {
      // console.log(e.target.classList)
      const parentTaskElement = e.target.parentElement;
      const taskText = parentTaskElement.children.item(1).textContent;
      const taskId = +parentTaskElement.id;

      if (parentTaskElement.classList.contains("completed")) {
        updateTasksStatus(tasks, taskId, "active", parentTaskElement, taskText);
      } else {
        console.log(parentTaskElement.classList.contains("completed"));
        updateTasksStatus(
          tasks,
          taskId,
          "completed",
          parentTaskElement,
          taskText
        );
      }
      updateTasksText();
    }
  })
);
