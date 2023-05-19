/*
Functionality for all specific tasks lists

TODO : 
    [  ]  hide shift-f + shift-d from text entry
        [  ]  prevent default then 

    [ ] Add check-off button for each task
        [  ]  send delete query to backend
        [  ]  query all the values
    
    [  ] add importance support (font as italics)
        ^^ currently hard coded
    
    
*/

console.log("MODIFICATIONS IS BEING LOADED IN");

const form = document.querySelector("form");
const textInput = document.querySelector("#text");
const importanceInput = document.querySelector("#importance");
const list = document.querySelector(".list");
const everyDeleteButton = document.querySelectorAll("button.delete");
const todoHeader = document.querySelector(".storage > h3");

let totalEntries = 0;
//const MAX_NUM_ENTRIES = 5;
const MIN_ENTRY_DEPTH = 0;
const MAX_ENTRY_DEPTH = 4;
const MARGIN_LENGTH = 80;

let currentDepth = 0;
const taskMargin = 5; // how many px to offset tasks by --> offset = currentDepth * taskMargin
let validKeyPair = false;
const INPUT_FIELD_IDENTIFIER = ".current-input-field";

// Set starting margin (so we knoew where to offset from)
const compStyles = window.getComputedStyle(textInput);
//const DEFAULT_MARGIN_LEFT = compStyles.getPropertyValue("margin-left");
const DEFAULT_MARGIN_LEFT = 20;
console.log("DEFAULT_MARGIN_LEFT", DEFAULT_MARGIN_LEFT, "%");

function handleStartup() {
  // fetch all tasks then append input to the bottom
  getAllTasks().then((taskList) => {
    console.log("after parsing ", taskList);
    addTasksToDom(taskList);
    appendInputElement();
  });
}

form.addEventListener("submit", handleEnter);

// rejects/accepts input text
function validateText(text, isImportant, taskId) {
  // add some stuff
  return true;
}

function addTasksToDom(taskList) {
  for (let task of taskList) {
    // NOTE : We are assuming parenList is the view we are on, so we don't check for parent list
    addTaskToDom(
      task.description,
      task.isImportant,
      task._id,
      task.depth,
      task.completed
    );
  }
}

/* MAKING THIS
  <input
                onblur="this.focus()"
                type="text"
                class="rq-form-element" AND "current-input-field"
                name="todoInput"
                id="text"
                minlength="3"
                maxlength="100"
                required
                autofocus
              />
              <i></i>
  */

function makeInput() {
  let newInput = document.createElement("input");
  newInput = setInputAttributes(newInput);

  return newInput;
}

function setInputAttributes(newInput) {
  newInput.setAttribute("onblur", "this.focus()");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("class", "rq-form-element");
  newInput.setAttribute("class", "current-input-field");
  newInput.setAttribute("name", "todoInput");
  newInput.setAttribute("id", "text");
  newInput.setAttribute("minlength", "3");
  newInput.setAttribute("maxlength", "100");
  newInput.setAttribute("require", "true");
  newInput.setAttribute("autofocus", "true");

  const cursor = document.createElement("i");
  newInput.appendChild(cursor);

  return newInput;
}

// replace input without swapping
function replaceInput(inputToReplace, taskElementToInsert) {
  // if the input does not exist simply add element to top of list
  if (inputToReplace == undefined) {
    list.appendChild(taskElementToInsert);
  }
  // else replace input with the new task we want there
  else {
    // append task above input then delete input
    const parent = inputToReplace.parentNode;
    console.log("parent ", parent);
  }
}

function extractInputValues(currentInput) {
  const text = currentInput.value;
  // const importanceInput = document.get
  const isImportant = importanceInput.checked;
  const isValidText = validateText(text);
  let taskId;
  if (isValidText) {
    taskId = crypto.randomUUID();
    console.log(taskId);
  }
  // clear text and bold color
  textInput.value = "";
  importanceInput.checked = false;

  return { text, isImportant: false, taskId, taskDepth: currentDepth };
}

// get the last element
// append text input to child (or sibling)F
function appendInputElement() {
  const lastTask = getLastTask();
  // append input to last task that was added
  lastTask.appendChild(makeInput());
}

function getLastTask(identifier) {
  const allTasks = Array.from(document.querySelectorAll(identifier));
  console.log(allTasks);
  if (allTasks.length > 0) {
    return allTasks[allTasks.length - 1];
  } else {
    return list;
  }
}

function handleEnter(e) {
  // swap the current input field with a p tag of with the corresponding input value (p.class = "child")
  e.preventDefault();
  const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER);
  const { text, isImportant, taskId, taskDepth } =
    extractInputValues(currentInput);
  saveToServer(text, isImportant, taskId);

  /*
          addTaskToDom(todo.description, todo.isImportant, todo._id, todo.depth);
  */

  const newTodo = makeNewTodo(text, isImportant, taskId, taskDepth);
  replaceInput(currentInput, newTodo);
  const mostRecentlyMadeTask = getLastTask(".child");
  console.log("most recent before adding", mostRecentlyMadeTask);
  mostRecentlyMadeTask.appendChild(makeInput());
}

EventTarget.prototype.addEventListener = (() => {
  const addEventListener = EventTarget.prototype.addEventListener;
  return function () {
    addEventListener.apply(this, arguments);
    return this;
  };
})();

// update depth and shift input left / right
textInput
  .addEventListener("keydown", textInputChangeEventListener)
  .addEventListener("input", () => {
    if (validKeyPair) {
      const previousTextValue = textInput.value;
      console.log(previousTextValue);
      //textInput.value = previousTextValue.slice(0, -1);
      validKeyPair = false;
    }
  });

//textInput.addEventListener("keydown", textInputChangeEventListener);

console.log("starting depth : ", currentDepth);

function textInputChangeEventListener(evt) {
  if ((evt.shiftKey && evt.key === "D") || (evt.shiftKey && evt.key === "F")) {
    const previousTextValue = textInput.value;
    console.log(previousTextValue);
    textInput.value = previousTextValue.slice(0, -1);
    const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER);

    if (evt.shiftKey && evt.key === "D") {
      // check current depth and decrement if in range
      if (currentDepth > MIN_ENTRY_DEPTH) {
        currentDepth--;
        // NOTE : THIS IS SPAGHETTI AND SHOULD BE FIXED
        // ^^ Check if we are at starting depth and hard code it in (prevent wrong margin on left)
        if (currentDepth != 0) {
          console.log(
            "Adding ",
            DEFAULT_MARGIN_LEFT,
            " with ",
            5 * currentDepth,
            "%"
          );
          currentInput.style.marginLeft = `${
            DEFAULT_MARGIN_LEFT + 10 * currentDepth
          }%`;
        } else {
          console.log("setting margin to default");
          currentInput.style.marginLeft = `${DEFAULT_MARGIN_LEFT}`;
        }
        console.log("Current depth : ", currentDepth);
      } else {
        console.log("Out of range. Depth is ", currentDepth);
      }
    } else if (evt.shiftKey && evt.key === "F") {
      // check current depth and decrement if in range
      if (currentDepth < MAX_ENTRY_DEPTH) {
        currentDepth++;
        //currentInput.style.marginLeft = `${MARGIN_LENGTH * currentDepth}px`;
        console.log(
          "Adding ",
          DEFAULT_MARGIN_LEFT,
          " with ",
          10 * currentDepth,
          "%"
        );
        currentInput.style.marginLeft = `${
          DEFAULT_MARGIN_LEFT + 5 * currentDepth
        }%`;
        console.log("Current depth : ", currentDepth);
      } else {
        console.log("Out of range. Depth is ", currentDepth);
      }
    }
  }
}

// NOTE : taskId will be deprecated since id will be generated on backend. That way id stored in db matches what's
// on frontend so we dont need to convert between the two
function saveToServer(text, isImportant, completed) {
  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: text,
      parentList: "test",
      depth: currentDepth,
      isImportant: isImportant,
      completed: false,
    }),
    //body: JSON.stringify({ [text]: [isImportant, taskId, currentDepth] }),
  });
}

function addTaskToDom(text, isImportant, taskId, taskDepth) {
  // check if we have hit max number of todos
  totalEntries++;
  console.log("adding todo", totalEntries);

  let newTodo = makeNewTodo(text, isImportant, taskId, taskDepth);
  list.append(document.createElement("br")); // append a br so there is a line break between each new todo
  console.log("depth ", taskDepth);

  // add more here to specify the depth (another function probably)
  list.appendChild(newTodo);
}

function makeNewTodo(text, isImportant, taskId, taskDepth) {
  // make new element and append it to list with delete button
  let deleteButton = makeDeleteButton();
  let newTodo = document.createElement("div");

  newTodo.classList += "child";
  newTodo.textContent = isImportant ? "\u2729 " + text : text;
  newTodo.dataset.checked = false;
  newTodo.dataset.id = taskId;
  newTodo.style.marginLeft = `${MARGIN_LENGTH * taskDepth}px`;

  newTodo.appendChild(deleteButton);
  attachDeleteBtnEventListener(deleteButton);
  attachToggleCheckEventListener(newTodo);
  return newTodo;
}

function makeDeleteButton() {
  let deleteButton = document.createElement("button");
  deleteButton.classList += "delete";
  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "1%";
  return deleteButton;
}

function attachToggleCheckEventListener(element) {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    let taskStatus = element.dataset.checked == "true";
    console.log("staus becoming ", !taskStatus);
    let taskIsCompleted = !taskStatus;
    if (taskIsCompleted) {
      console.log("task completed");
      element.style.textDecoration = "line-through";
    } else {
      console.log("task not done yet");
      element.style.textDecoration = "none";
    }
  });
}

function attachDeleteBtnEventListener(btn) {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // dont reload page
    let wordId = btn.parentElement.dataset.id;
    btn.parentElement.classList += " hidden"; // hide the todo now that its been deleted
    if (btn.parentElement.nextElementSibling) {
      btn.parentElement.nextElementSibling.remove(); // remove the br so no extra width is maintained
    }

    const deleteOptions = {
      id: wordId,
    };
    fetch("/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteOptions),
    })
      .then((deletedEntry) => deletedEntry.json())
      .then((deletedEntry) => {
        let taskToDelete = Array.from(
          document.querySelectorAll("[data-id]")
        ).filter((elem) => elem.dataset.id == deletedEntry.id);
      });
    totalEntries = totalEntries - 1;
  });
}
function getAllTasks() {
  return fetch("/tasks").then((data) => data.json());
}
