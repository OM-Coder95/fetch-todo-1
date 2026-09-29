const cl = console.log;

const todoForm = document.getElementById("todoForm");
const todoName = document.getElementById("todoName");
const todoContainer = document.getElementById("todoContainer");
const spinner = document.getElementById("spinner");
const addTodoBtn = document.getElementById("addTodoBtn");
const updateTodoBtn = document.getElementById("updateTodoBtn");

const BASE_URL = `https://todo-with-fetch-1-default-rtdb.firebaseio.com`;

const TODO_URL = `${BASE_URL}/todo.json`;

let state = {
  todoArr: [],
  editId: null,
};

// Functions

// arrOfObj

function arrOfObj(obj) {
  for (const key in obj) {
    obj[key].id = key;
    state.todoArr.push(obj[key]);
  }
}
// showSpinner

function showSpinner() {
  spinner.classList.remove("d-none");
}

// hideSpinner

function hideSpinner() {
  spinner.classList.add("d-none");
}

// resetForm

function resetForm() {
  todoForm.reset();
}

// create

function onTodoAdd(event) {
  event.preventDefault();

  let newTodo = {
    todo: todoName.value.trim(),
  };

  showSpinner();

  fetch(TODO_URL, {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT TOKEN",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      cl(res);

      newTodo.id = res.name;
      state.todoArr.push(newTodo);

      createDiv(res, newTodo);
    })
    .catch((err) => {
      cl("Something went wrong");
    })
    .finally((res) => {
      hideSpinner();
    });
}

// createDiv

function createDiv(res, newTodo) {
  let li = document.createElement("li");

  li.id = res.name;

  li.className = `list-group-item d-flex justify-content-between`;
  li.innerHTML = `
            <h3>${newTodo.todo}</h3>
            <div>
                <button class="btn btn-sm"><i onclick="editTodo(this)"
                        class="fa-solid fa-pen-to-square fa-2x text-primary"></i></button>
                <button class="btn btn-sm"><i onclick="removeTodo(this)"
                        class="fa-solid fa-trash-can fa-2x text-danger"></i></button>
            </div>
        `;

  todoContainer.append(li);
  resetForm();
}

// read

function showOnUI() {
  showSpinner();

  fetch(TODO_URL, {
    method: "GET",
    body: null,
    headers: {
      "Content-Type": "application/json",
      authorization: "JWT TOKEN",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      arrOfObj(res);

      rendering(state.todoArr);
    })
    .catch((err) => {
      cl("Something went wrong");
    })
    .finally(() => {
      hideSpinner();
    });
}

showOnUI();

// rendering

function rendering(arr) {
  let result = "";

  arr.forEach((ele) => {
    result += `
    <li class="list-group-item d-flex justify-content-between" id="${ele.id}">
        <h3>${ele.todo}</h3>
        <div>
            <button class="btn btn-sm"><i onclick="editTodo(this)"
                    class="fa-solid fa-pen-to-square fa-2x text-primary"></i></button>
            <button class="btn btn-sm"><i onclick="removeTodo(this)"
                    class="fa-solid fa-trash-can fa-2x text-danger"></i></button>
        </div>
    </li>
    `;
  });
  todoContainer.innerHTML = result;
}

// edit

function editTodo(ele) {
  let editId = ele.closest("li").id;
  state.editId = editId;

  let getObj = state.todoArr.find((ele) => ele.id === editId);
  todoName.value = getObj.todo;

  addTodoBtn.classList.add("d-none");
  updateTodoBtn.classList.remove("d-none");
}

// update

function onTodoUpdate() {
  let updateId = state.editId;

  let updatedObj = {
    todo: todoName.value.trim(),
    id: updateId,
  };

  showSpinner();
  let UPDATE_URL = `${BASE_URL}/todo/${updateId}.json`;
  fetch(UPDATE_URL, {
    method: "PATCH",
    body: JSON.stringify(updatedObj),
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT TOKEN",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new error(`HTTP error: ${res.status}`);
      }
      cl(res);
      return res.json();
    })
    .then((res) => {
      cl(res);

      let getIndex = state.todoArr.findIndex((ele) => ele.id === updateId);
      state.todoArr[getIndex] = updatedObj;

      updateUI(updatedObj);
      state.editId = null;
    })
    .catch((err) => {
      cl("Something went wrong");
    })
    .finally(() => {
      hideSpinner();
    });
}

// updateUI

function updateUI(updatedObj) {
  let li = document.getElementById(updatedObj.id);

  li.querySelector("h3").innerText = updatedObj.todo;

  updateTodoBtn.classList.add("d-none");
  addTodoBtn.classList.remove("d-none");
}

// removeTodo

function removeTodo(ele) {
  let removeId = ele.closest("li").id;

  showSpinner();
  let REMOVE_URL = `${BASE_URL}/todo/${removeId}.json`;
  fetch(REMOVE_URL, {
    method: "DELETE",
    body: null,
    headers: {
      "Content-Type": "application/json",
      authorization: "JWT TOKEN",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ERROR: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => {
      cl(res);

      ele.closest("li").remove();
    })
    .catch((err) => {
      cl("Something went wrong.");
    })
    .finally((err) => {
      hideSpinner();
    });
}

todoForm.addEventListener("submit", onTodoAdd);
updateTodoBtn.addEventListener("click", onTodoUpdate);
