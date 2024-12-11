const taskInput = document.querySelector(".task-input");
console.log(taskInput);
const addButton = document.querySelector(".add-btn");
const activeTasksElement = document.querySelector(".tasks-active");
const completedTaskElement = document.querySelector(".tasks-completed");
// STATS VARIABLE
const numTotalTaskElement = document.querySelector(".total-tasks");
const numTasksCompleted = document.querySelector(".number_tasks-completed");
const numTasksActive = document.querySelector(".number_tasks-active");
console.log(numTotalTaskElement);

// FUNCTIONS
console.log("kkk");
// GLOBAL VARIABLE
let tasks = JSON.parse(localStorage.getItem("localTasks")) || [];
console.log(tasks);

let editMode = false;
let editId = null;
let editElement = null;

const activeTasksNum = tasks.filter((el) => el.status === "active").length;
const completedTasksNum = tasks.filter(
  (el) => el.status === "completed"
).length;

// console.log("active tasks:", activeTasksNum);
// console.log("completed tasks:", completedTasksNum);

numTotalTaskElement.textContent = tasks.length;
numTasksCompleted.textContent = completedTasksNum;
numTasksActive.textContent = activeTasksNum;

// ELEMENT INITIALIZATION
tasks.forEach((el, i) => {
  console.log(el.status);
  if (el.status === "active") {
    activeTasksElement.innerHTML += ` <div class="task ${el.status}" id=${i}>
    <input type="checkbox" class="checkbox" />
    <p class="task-text">${el.task}</p>
    <div class="crud-btn">
      <button class="update-btn">Update</button>
      <button class="delete-btn">Delete</button>
    </div> 
`;
  } else {
    completedTaskElement.innerHTML += ` <div class="task ${el.status}" id=${i}>
    <input type="checkbox"checked class="checkbox" />
    <p class="task-text">${el.task}</p>
    <div class="crud-btn">
      <button class="update-btn">Update</button>
      <button class="delete-btn">Delete</button>
    </div> 
`;
  }
});

// ADD OR UPDATE TASK
addButton.addEventListener("click", function () {
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
    localStorage.setItem("localTasks", JSON.stringify(tasks));
    editElement.textContent = taskInput.value;
    editMode = false;
    editId = null;
    editElement = null;
  }

  taskInput.value = " ";

  const activeTasksNum = tasks.filter((el) => el.status === "active").length;
  const completedTasksNum = tasks.filter(
    (el) => el.status === "completed"
  ).length;

  // console.log("active tasks:", activeTasksNum);
  // console.log("completed tasks:", completedTasksNum);

  numTotalTaskElement.textContent = tasks.length;
  numTasksCompleted.textContent = completedTasksNum;
  numTasksActive.textContent = activeTasksNum;
});

//
// LISTENING FOR EVENTS IN THE TASKS CONTAINERS
document.querySelectorAll(".tasks").forEach((element, i) =>
  element.addEventListener("click", function (e) {
    // DELETING A TASK

    console.log(e.target.className);
    if (e.target.className === "delete-btn") {
      const parentTaskElement = e.target.parentElement.parentElement;
      const id = +parentTaskElement.id;

      tasks = tasks.filter((_, i) => i !== id);
      localStorage.setItem("localTasks", JSON.stringify(tasks));
      console.log(tasks);
      parentTaskElement.remove();

      const activeTasksNum = tasks.filter(
        (el) => el.status === "active"
      ).length;
      const completedTasksNum = tasks.filter(
        (el) => el.status === "completed"
      ).length;

      // console.log("active tasks:", activeTasksNum);
      // console.log("completed tasks:", completedTasksNum);

      numTotalTaskElement.textContent = tasks.length;
      numTasksCompleted.textContent = completedTasksNum;
      numTasksActive.textContent = activeTasksNum;
    }
    // UPDATING A TASK
    if (e.target.className === "update-btn") {
      editMode = true;
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
      if (parentTaskElement.classList.contains("completed")) {
        const taskId = +parentTaskElement.id;
        tasks = tasks.map((element, i) =>
          i === taskId ? { ...element, status: "active" } : element
        );
        localStorage.setItem("localTasks", JSON.stringify(tasks));
        parentTaskElement.remove();
        activeTasksElement.innerHTML += ` <div class="task " id=${taskId}>
              <input type="checkbox" class="checkbox" />
              <p class="task-text">${taskText}</p>
              <div class="crud-btn">
                <button class="update-btn">Update</button>
                <button class="delete-btn">Delete</button>
              </div> 
    `;
      } else {
        console.log(parentTaskElement.classList.contains("completed"));
        const taskId = +parentTaskElement.id;
        tasks = tasks.map((element, i) =>
          i === taskId ? { ...element, status: "completed" } : element
        );
        localStorage.setItem("localTasks", JSON.stringify(tasks));
        parentTaskElement.remove();
        completedTaskElement.innerHTML += ` <div class="task completed" id=${taskId}>
              <input type="checkbox" checked class="checkbox" />
              <p class="task-text">${taskText}</p>
              <div class="crud-btn">
                <button class="update-btn">Update</button>
                <button class="delete-btn">Delete</button>
              </div> 
    `;
      }
      const activeTasksNum = tasks.filter(
        (el) => el.status === "active"
      ).length;
      const completedTasksNum = tasks.filter(
        (el) => el.status === "completed"
      ).length;

      // console.log("active tasks:", activeTasksNum);
      // console.log("completed tasks:", completedTasksNum);

      numTotalTaskElement.textContent = tasks.length;
      numTasksCompleted.textContent = completedTasksNum;
      numTasksActive.textContent = activeTasksNum;
    }
  })
);
