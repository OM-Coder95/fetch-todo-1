const cl = console.log;

const todoForm = document.getElementById("todoForm");
const todoName = document.getElementById("todoName");
const todoContainer = document.getElementById("todoContainer");
const spinner = document.getElementById("spinner");

const BASE_URL = `https://todo-with-fetch-1-default-rtdb.firebaseio.com`;

const TODO_URL = `${BASE_URL}/todo.json`;

// Functions

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
      "Cotent-Type": "application/json",
      Authorizatio: "JWT TOKEN",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      cl(res);

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
                <button class="btn btn-sm"><i
                        class="fa-solid fa-pen-to-square fa-2x text-primary"></i></button>
                <button class="btn btn-sm"><i
                        class="fa-solid fa-trash-can fa-2x text-danger"></i></button>
            </div>
        `;

  todoContainer.append(li);
  resetForm();
}

todoForm.addEventListener("submit", onTodoAdd);
