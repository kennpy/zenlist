/*
Functionality for all specific tasks lists
Important
TODO : Change task creation so it relies on GRID

Less important
TODO : find alternate shift-f + shift-d that shows nothing
TODO : Add check-off BOX that relies on TYPING to ADD X to BOX --> Satisfy
TODO : Add 'importance' support (font as italics)
    
*/

// DOM ELEMENTS

//const textInput = document.querySelector("#text");
const form = document.querySelector("form");
const importanceInput = document.querySelector("#importance");
const container = document.getElementById("container");
const list = document.querySelector(".list");

// CONSTANTS

const MIN_TASK_DEPTH = 0;
const MAX_TASK_DEPTH = 4;
const NUM_GRID_COLS = 4 * MAX_TASK_DEPTH; // We double to offset. We only use half of the screen so we need double the columns to compensate / make sure things align
const NUM_COL_OFFSET = NUM_GRID_COLS / 2;
const MARGIN_LENGTH = 80;
const DEFAULT_MARGIN_LEFT_SCALER = 7;
const DEFAULT_MARGIN_LEFT = 20;
const INPUT_FIELD_IDENTIFIER = ".current-input-field";

// TASK DATA

let currentColumn = 0;
let currentRow = 1;

// STARTUP

function handleStartup() {
  // fetch all tasks then append input to the bottom
  getAllTasks().then((taskList) => {
    console.log("after parsing ", taskList);
    const inputToAppend = makeInputElement();
    configureGrid();
    addTasksToDom(taskList);
    addInputToDom(inputToAppend, currentColumn, currentRow);
  });
}
handleStartup();

// GUI

// make grid based on specified depth
function configureGrid() {
  // Make table based on depth of tasks we can nest
  function makeRows(rows, cols) {
    container.style.setProperty("--grid-rows", rows);
    container.style.setProperty("--grid-cols", cols);
    for (c = 0; c < rows * cols; c++) {
      let cell = document.createElement("tr");
      cell.innerText = c + 1;
      container.appendChild(cell).className = "grid-item";
    }
  }

  makeRows(1, NUM_GRID_COLS);
}

// GUI -> HELPERS

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

function addTaskToDom(text, isImportant, taskId, taskDepth, isCompleted) {
  currentRow++;

  // Add new row to table
  let newTodo = makeTodoElement(
    text,
    isImportant,
    taskId,
    taskDepth,
    isCompleted
  );

  // TODO : CHANGER HERE to append based on GRID
  newTodo.style.setProperty("grid-column-start", NUM_COL_OFFSET + taskDepth);
  newTodo.style.setProperty("grid-row-start", currentRow);
  container.appendChild(newTodo);
}

function addInputToDom(input, colStart, rowStart) {
  input.style.setProperty("grid-column-start", NUM_COL_OFFSET + colStart);
  input.style.setProperty("grid-row-start", rowStart + 1); // add one to always add below recent task
  container.appendChild(input);
  currentRow++;
  input.focus();
}

function makeTodoElement(text, isImportant, taskId, taskDepth) {
  // make new element and append it to list with delete button
  let deleteButton = makeDeleteButton();
  let newTodo = document.createElement("div");

  newTodo.classList += "child";
  newTodo.textContent = isImportant ? "\u2729 " + text : text;
  newTodo.dataset.checked = false;
  newTodo.dataset.id = taskId;
  //newTodo.style.marginLeft = `${MARGIN_LENGTH * taskDepth}px`;

  newTodo.appendChild(deleteButton);
  attachDeleteBtnEventListener(deleteButton);
  attachToggleCheckEventListener(newTodo);
  return newTodo;
}

function makeDeleteButton() {
  let deleteButton = document.createElement("button");
  deleteButton.classList += "delete";
  deleteButton.textContent = "Delete";
  deleteButton.style.marginLeft = "10%";
  return deleteButton;
}

function makeInputElement() {
  let newInput = document.createElement("input");
  newInput = setInputAttributes(newInput);
  newInput.addEventListener("keyup", textInputChangeEventListener);

  return newInput;
}

function setInputAttributes(newInput) {
  newInput.setAttribute("onblur", "this.focus()");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("class", "rq-form-element");
  newInput.setAttribute("class", "current-input-field cursor ");
  newInput.setAttribute("name", "todoInput");
  newInput.setAttribute("id", "text");
  newInput.setAttribute("minlength", "3");
  newInput.setAttribute("maxlength", "100");
  newInput.setAttribute("require", "true");
  newInput.setAttribute("autofocus", "true");

  newInput.style.marginLeft = `${50}%`;

  const cursor = document.createElement("i");
  newInput.appendChild(cursor);

  return newInput;
}

function extractInputValues(currentInput) {
  const text = currentInput.value;
  const isImportant = importanceInput.checked;

  currentInput.value = "";
  importanceInput.checked = false;

  return {
    text,
    parentList: "test",
    isImportant: false,
    taskDepth: currentColumn,
    completed: false,
  };
}

function getElementToAppendTo(identifier) {
  const allTasks = Array.from(document.querySelectorAll(identifier));
  console.log(allTasks);
  if (allTasks.length > 0) {
    return allTasks[allTasks.length - 1];
  } else {
    return list;
  }
}

async function handleEnter(e) {
  // swap the current input field with a p tag of with the corresponding input value (p.class = "child")
  e.preventDefault();
  console.log(e);
  // get input values so we can make a task from it
  const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER);
  const { text, parentList, isImportant, taskDepth, completed } =
    extractInputValues(currentInput);

  const { _id } = await saveToServer(
    text,
    parentList,
    currentColumn,
    isImportant,
    completed
  );

  const newTodo = makeTodoElement(text, isImportant, _id, taskDepth);
  console.log("newTodo ", newTodo);

  // add task to dom and make sure input is below it
  addTaskToDom(text, isImportant, _id, currentColumn, completed);
  addInputToDom(currentInput, currentColumn, currentRow);
  currentInput.focus();
}

// EVENT LISTENERS

// Add return value for event listeners to allow listener chaining (MAY NOT NEED)
EventTarget.prototype.addEventListener = (() => {
  const addEventListener = EventTarget.prototype.addEventListener;
  return function () {
    addEventListener.apply(this, arguments);
    return this;
  };
})();

function textInputChangeEventListener(evt) {
  if ((evt.shiftKey && evt.key === "D") || (evt.shiftKey && evt.key === "F")) {
    handleShift(evt);
  }
  window.scrollTo(0, 0);
}

function handleShift(evt) {
  const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER);
  const previousTextValue = currentInput.value;
  console.log(previousTextValue);
  currentInput.value = previousTextValue.slice(0, -1);
  const pixelOffsetToMiddle = currentInput.clientWidth / 2;
  console.log("pixels to middle ", pixelOffsetToMiddle);
  if (evt.shiftKey && evt.key === "D") {
    // check current depth and decrement if in range
    if (currentColumn > MIN_TASK_DEPTH) {
      currentColumn--;
      const newWidth = `${
        //DEFAULT_MARGIN_LEFT + DEFAULT_MARGIN_LEFT_SCALER * currentDepth + 50
        pixelOffsetToMiddle + MARGIN_LENGTH * currentColumn
      }%`;
      // NOTE : THIS IS SPAGHETTI AND SHOULD BE FIXED
      // ^^ Check if we are at starting depth and hard code it in (prevent wrong margin on left)
      if (currentColumn != 0) {
        //norm in pixels - MARGIN_LENGTH * taskDepth
        // add ^^ + 50%
        console.log("width : ", currentInput.style.width);
        currentInput.style.marginLeft = newWidth;
      } else {
        console.log("setting margin to default");
        //currentInput.style.marginLeft = `${DEFAULT_MARGIN_LEFT}`;
        currentInput.style.marginLeft = `${pixelOffsetToMiddle}px`;
      }
    } else {
    }
  } else if (evt.shiftKey && evt.key === "F") {
    // check current depth and decrement if in range
    if (currentColumn < MAX_TASK_DEPTH) {
      currentColumn++;
      //currentInput.style.marginLeft = `${MARGIN_LENGTH * currentDepth}px`;
      const newWidth = `${
        //DEFAULT_MARGIN_LEFT + DEFAULT_MARGIN_LEFT_SCALER * currentDepth + 50
        pixelOffsetToMiddle + MARGIN_LENGTH * currentColumn
      }%`;
      currentInput.style.marginLeft = newWidth;
      console.log("Current depth : ", currentColumn);
    } else {
      console.log("Out of range. Depth is ", currentColumn);
    }
  }
  window.scrollTo(0, 0);
}

function attachToggleCheckEventListener(element) {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    let taskStatus = element.dataset.checked == "true";
    console.log("staus becoming ", !taskStatus);
    let taskIsCompleted = !taskStatus;
    handleTaskStatus(element, taskIsCompleted);
  });
}

function handleTaskStatus(element, taskIsCompleted) {
  const checkedStyles = {
    complete: {
      checkedValue: true,
      textDecoration: "line-through",
    },
    incomplete: {
      checkedValue: false,
      textDecoration: "none",
    },
  };
  const { checkedValue, textDecoration } = taskIsCompleted
    ? checkedStyles.complete
    : checkedStyles.incomplete;

  element.dataset.checked = checkedValue;
  element.style.textDecoration = textDecoration;
}

function attachDeleteBtnEventListener(btn) {
  btn.addEventListener("click", (e) => {
    console.log("DELETE BUTTON CLICKED ", e);
    currentRow--;
    // \e.preventDefault(); // DISABLING THIS MAKES IT WORK AND IDK WHY !!
    e.stopImmediatePropagation();
    e.preventDefault(); // ENABLING THIS MAKES IT WORK NOW AND IDK WHY (something to do w/ parent vs sibling relationship or something)
    let pointerId = e.pointerId;
    //if (form.childElementCount > 0 && e.pointerId == -1) pointerId = 1; // reset pointer id if there is already a task since it changes to -1 for somet reason
    if (form.childElementCount > 0 && e.pointerId == -1) {
      handleEnter(e);
    }
    if (pointerId === 1) {
      console.log("legitimate delete call");
      let wordId = btn.parentElement.dataset.id;
      // btn.parentElement.classList += " hidden"; // hide the todo now that its been deleted
      // if (btn.parentElement.nextElementSibling) {
      //   btn.parentElement.nextElementSibling.remove(); // remove the br so no extra width is maintained
      // }

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
          ).filter((elem) => elem.dataset.id == deletedEntry.id)[0];
          btn.parentElement.parentElement.removeChild(taskToDelete);
        });
      currentRow = currentRow - 1;
    } else {
      console.log("illegitimate delete call");
    }
  });
}

form.addEventListener("submit", handleEnter);

// AJAX

// NOTE : taskId will be deprecated since id will be generated on backend. That way id stored in db matches what's
// on frontend so we dont need to convert between the two
async function saveToServer(text, parentList, depth, isImportant, isCompleted) {
  const ret = await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: text,
      parentList: parentList,
      depth: depth,
      isImportant: isImportant,
      completed: isCompleted,
    }),
  }).then((data) => data.json());
  return ret;
}

function getAllTasks() {
  return fetch("/tasks").then((data) => data.json());
}
