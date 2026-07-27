import "./style.css"
import {createIcons,Trash2,Pencil} from "lucide";



interface Todo{
  id:number,
  text:string,
  isCompleted:boolean
}

//#region  assigned html elements
const input = document.querySelector<HTMLInputElement>("#task") || null;
const todoList=document.querySelector<HTMLUListElement>("#todoList") || null; //ul
const form = document.querySelector<HTMLFormElement>("form") || null;
const clearBtn=document.querySelector<HTMLButtonElement>("#clear") || null;
clearBtn!.addEventListener("click", clearAll);
//#endregion


//#region created html elements
let li;
let title;
let edition;
let checkbox;
let span;
let delBtn;
let editBtn;
let message;
//#endregion



let todos:Todo[] = getFromStorage();
form?.addEventListener("submit",addTask);

init();

// #region  functions for adding, editing and deleting tasks;
function addTask(e:SubmitEvent):void{
  e.preventDefault();
const text = input!.value.trim();
  if (!text) return;

  if (todos.find(todo => todo.text === text)) {
    alert("This task already exists in your To-Do list!");
    input!.value = "";
    return;
  }

  const newTodo:Todo={
    id:Date.now(),
    text,
    isCompleted:false,
  }
  todos.push(newTodo);

  setToStorage(todos);
  renderTodos();
  input!.value = "";
  input!.focus();
}

function deleteTask(id:number):any{
  const result = confirm("Are you sure you want to delete this task?");
  if (!result) return;
  todos = todos.filter((todo) => todo.id !== id);
  setToStorage(todos);
  renderTodos();
}

function editTask(id:number):void{
  const todo = todos.find((todo) => todo.id == id);
  const newText = prompt("Edit your task: ", todo!.text);
  if (newText != "" && todos.find((todo) => todo.text != newText)) {
    todo!.text = newText!.trim();
    setToStorage(todos);
    renderTodos();
  }
}
function completeTask(id:number):void{
  const todo = todos.find((todo) => todo.id == id);
  todo!.isCompleted = !todo!.isCompleted;
  setToStorage(todos);
    renderTodos();
}


function clearAll() {
  const result = confirm("Are you sure about clearing the whole list?");
  if (!result) return;
  todos = [];
  setToStorage(todos);
  renderTodos();
}
// #endregion

function renderTodos() {
  todoList!.innerHTML = "";

  clearBtn!.disabled = todos.length === 0 || todos.length ===1;

  if (clearBtn!.disabled) {
    clearBtn!.classList.add("disabled");
  } else {
    clearBtn!.classList.remove("disabled");
  }

  if (todos.length === 0) {
  todoList!.classList.add("empty");
}
else {
  todoList!.classList.remove("empty");
}

  if (todos.length === 0) {
    clearBtn!.disabled = true;
    message = document.createElement("p");
    message.textContent = "There is no task yet...";
    message.className = "message";
    todoList!.appendChild(message);
  }

  todos.forEach((todo) => {
    li = document.createElement("li");
    title = document.createElement("div");
    edition = document.createElement("div");

    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener("change",()=>completeTask(todo!.id));

    span = document.createElement("span");
    span.textContent = todo.text;

    delBtn = document.createElement("button");
    delBtn.innerHTML = `
  <i data-lucide="trash2"></i>
`;
    delBtn.className = "delBtn";
    delBtn.addEventListener("click", () => deleteTask(todo!.id));

    editBtn = document.createElement("button");
    // editBtn.textContent = "Edit";
    editBtn.innerHTML = `
  <i data-lucide="pencil"></i>
`;
    editBtn.className = "editBtn";

    editBtn.addEventListener("click", () => editTask(todo.id));

    title.appendChild(checkbox);
    title.appendChild(span);
    edition.appendChild(delBtn);
    edition.appendChild(editBtn);

    todoList!.appendChild(li);
    li.appendChild(title);
    li.appendChild(edition);
  });
  input!.value = "";
  input!.focus();

  createIcons({
  icons:{
    Pencil,
    Trash2,
  }
})

}
function init(){
todos = getFromStorage();
renderTodos();
}

//#region LocalStorage-related functions
function setToStorage(todos:Todo[]):void{
  localStorage.setItem("todos", JSON.stringify(todos));
}
function getFromStorage():Todo[]{
  const data = localStorage.getItem("todos");
  if(!data){
    return [];
  }
return JSON.parse(data) as Todo[];
}
//#endregion