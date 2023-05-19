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
const INPUT_FIELD_IDENTIFIER = "current-input-field"

function handleStartup(){
  // fetch all tasks then append input to the bottom
  getAllTasks()
    .then((taskList) => {
      console.log("after parsing ", taskList);
      addTasksToDom(taskList);
      appendInputElement();
})


form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the page from reloading when form is submitted
  const text = textInput.value;
  const isImportant = importanceInput.checked;
  const isValidText = validateText(text);
  if (isValidText) {
    const taskId = crypto.randomUUID();
    console.log(taskId);
    //addTaskToDom(text, isImportant, taskId, currentDepth);
    saveToServer(text, isImportant, taskId); //
  }
  // clear text and bold color
  textInput.value = "";
  importanceInput.checked = false;
})
  
// rejects/accepts input text
function validateText(text, isImportant, taskId) {
  // add some stuff
  return true;
}

function addTasksToDom(taskList){
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

function makeInput(){
/*
  <input
                onblur="this.focus()"
                type="text"
                class="rq-form-element" AND "current-input-field"
                name="todoInput"
                id="text"
                type="text"
                minlength="3"
                maxlength="100"
                required
                autofocus
              />
              <i></i>
  */
}

function swapElements(oldElement, newElement){

}

function getLastElement(className){

}

function extractInputValues(currentInput){
  e.preventDefault(); // prevent the page from reloading when form is submitted
  const text = currentInput.value;
  const importanceInput = document.get
  const isImportant = importanceInput.checked;
  const isValidText = validateText(text);
  if (isValidText) {
    const taskId = crypto.randomUUID();
    console.log(taskId);
  }
  // clear text and bold color
  textInput.value = "";
  importanceInput.checked = false;


}

function handleEnter(){
  // swap the current input field with a p tag of with the corresponding input value (p.class = "child")
  const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER)
  const {text, isImportant, taskId, taskDepth} = extractInputValues(currentInput)
  saveToServer(text, isImportant, taskId); //
  const todoToAdd = makeNewTodo(text, isImportant, taskId, taskDepth);
  swapElements(currentInput, newTodo)
  const todoJustAdded = getLastElement(".child")
  document.appendChild(todoJustAdded, makeInput())
}




EventTarget.prototype.addEventListener = (() => {
  const addEventListener = EventTarget.prototype.addEventListener;
  return function () {
    addEventListener.apply(this, arguments);
    return this;
  };
})();
  
textInput
  .addEventListener("keydown", (evt) => {
    if (
      (evt.shiftKey && evt.key === "D") ||
      (evt.shiftKey && evt.key === "F")
    ) {
      validKeyPair = true;
      if (evt.shiftKey && evt.key === "D") {
        // check current depth and decrement if in range
        if (currentDepth > MIN_ENTRY_DEPTH) {
          currentDepth--;
          console.log("Current depth : ", currentDepth);
        } else {
          console.log("Out of range. Depth is ", currentDepth);
        }
      } else if (evt.shiftKey && evt.key === "F") {
        // check current depth and decrement if in range
        if (currentDepth < MAX_ENTRY_DEPTH) {
          currentDepth++;
          console.log("Current depth : ", currentDepth);
        } else {
          console.log("Out of range. Depth is ", currentDepth);
        }
      }
    }
  })
  .addEventListener("input", () => {
    if (validKeyPair) {
      const previousTextValue = textInput.value;
      console.log(previousTextValue);
      //textInput.value = previousTextValue.slice(0, -1);
      validKeyPair = false;
    }
  });
  

textInput.addEventListener("keydown", textInputChangeEventListener);

console.log("starting depth : ", currentDepth);

function textInputChangeEventListener(evt) {
  if ((evt.shiftKey && evt.key === "D") || (evt.shiftKey && evt.key === "F")) {
    const previousTextValue = textInput.value;
    console.log(previousTextValue);
    textInput.value = previousTextValue.slice(0, -1);

    if (evt.shiftKey && evt.key === "D") {
      // check current depth and decrement if in range
      if (currentDepth > MIN_ENTRY_DEPTH) {
        currentDepth--;
        console.log("Current depth : ", currentDepth);
      } else {
        console.log("Out of range. Depth is ", currentDepth);
      }
    } else if (evt.shiftKey && evt.key === "F") {
      // check current depth and decrement if in range
      if (currentDepth < MAX_ENTRY_DEPTH) {
        currentDepth++;
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
  })
    .then((newTodo) => newTodo.json())
    .then((todo) => {
      if (todo != {}) {
        addTaskToDom(todo.description, todo.isImportant, todo._id, todo.depth);
      }
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
    return fetch("/tasks")
      .then((data) => data.json());
  }

  // get the last element
      // append text input to child (or sibling)
  function appendInputElement() {
    
    const allTasks = Array.from(
      document.querySelectorAll("[data-id]")
    );
    const lastTask = allTasks[allTasks.length];
    // append input to last task that was added
    lastTask.appendChild();
  }

