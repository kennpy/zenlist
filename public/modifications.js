/*
Functionality for all specific tasks lists
Important
TODO : Add comment support (font as italics + bold with 'NOTE : ' appended to beginning )
TODO : Register deletes with SHIFT - CLICK (instead of DELETE BTN)

Less important
TODO : Make ctrl-a + Delete remove all text in box (NOW : Deletes last character)
TODO : Make create task fade in to hide the flicker
TODO : (attempted) Experiment with different delete button design (SMALLER & LESS APPARENT)

*/

// DOM ELEMENTS

//const textInput = document.querySelector("#text");
const form = document.querySelector("form");
const importanceInput = document.querySelector("#importance");
const container = document.getElementById("container");
const list = document.querySelector(".list");

// CONSTANTS

const MIN_TASK_DEPTH = 0;
const MAX_TASK_DEPTH = 5;
// TASK_DEPTH_CORRECTOR needed MAX_TASK_DEPTH and NUM_GRID_COLS are linked --> If we want to change styles we must change MAX_TASK_DEPTH
// Adding a correction fixes this, since we can offset MAX_TASK_DEPTH to seperate the task-logic with view
const TASK_DEPTH_CORRECTOR = 2;
const NUM_GRID_COLS = 4 * MAX_TASK_DEPTH; // We double to offset. We only use half of the screen so we need double the columns to compensate / make sure things align
const NUM_COL_OFFSET = NUM_GRID_COLS / 2; // Divide it by 2 so we offset to the middle
const INPUT_FIELD_IDENTIFIER = ".current-input-field";
const MIN_TASK_LENGTH = 3; // Minimum characters per task

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
  console.log(taskId, isCompleted, "<- isCompleted");
  // Add new row to table
  let newTodo = makeTodoElement(text, isImportant, taskId, isCompleted);

  // TODO : CHANGER HERE to append based on GRID
  newTodo.style.setProperty("grid-column-start", NUM_COL_OFFSET + taskDepth);
  newTodo.style.setProperty("grid-row-start", currentRow);
  renderStatus(isCompleted, newTodo);
  container.appendChild(newTodo);
}

function addInputToDom(input, colStart, rowStart) {
  // OVERALL TRACKING --> rowStart used since sometimes we want to change rowStart from what current row is (ex: General key VS Enter key handling)
  // General key requires input be made on same row but enter requires next row. So if we're on same row
  if (addInputToDom.caller == focusInput) currentRow++;

  input.style.setProperty("grid-column-start", NUM_COL_OFFSET + colStart);
  input.style.setProperty("grid-row-start", rowStart + 1); // add one to always add below recent task
  container.appendChild(input);
  input.focus();
}

// NEW (EXPERIMENT)
var addRule = (function (style) {
  var sheet = document.head.appendChild(style).sheet;
  return function (selector, css) {
    var propText =
      typeof css === "string"
        ? css
        : Object.keys(css)
            .map(function (p) {
              return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
            })
            .join(";");
    sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
  };
})(document.createElement("style"));

function makeTodoElement(text, isImportant, taskId, isCompleted) {
  // make new element and append it to list with delete button

  // ORIGINAL (1)
  const newTodo = document.createElement("div");
  const todoBox = "[  ] ";
  let deleteButton = makeDeleteButton();

  text = todoBox + text;
  newTodo.textContent = isImportant ? "\u2729 " + text : text;
  newTodo.dataset.checked = isCompleted;
  newTodo.dataset.id = taskId;
  newTodo.classList.add("childgrid-item");

  // NEW (EXPERIMENT) --> WORKING (dont want to deal with this right now)
  addRule("div.childgrid-item:before", {
    position: "absolute",
    content: "attr(data-content)",
    color: "$lightgray",
    "clip-path": "polygon(0 0, 0 0, 0% 100%, 0 100%)",
    "text-decoration": "line-through",
    "text-decoration-thickness": "3px",
    "text-decoration-color": "$black",
    transition: "clip-path 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  });

  // ORIGINAL (2)
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

function makeInputElement(startingText = "") {
  let newInput = document.createElement("input");
  newInput = setInputAttributes(newInput, startingText);
  newInput.addEventListener("keydown", keyPressEventListener);

  return newInput;
}

function setInputAttributes(newInput, startingText) {
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
  newInput.value = startingText;

  //newInput.style.marginLeft = `${50}%`;

  const cursor = document.createElement("i");
  newInput.appendChild(cursor);

  return newInput;
}

function extractInputValues(currentInput) {
  const text = currentInput.value;
  const isImportant = importanceInput.checked;

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

  if (text.length >= MIN_TASK_LENGTH) {
    currentInput.value = "";
    importanceInput.checked = false;

    const { _id } = await saveTaskToServer(
      text,
      parentList,
      currentColumn,
      isImportant,
      completed
    );

    const newTodo = makeTodoElement(text, isImportant, _id, taskDepth);
    console.log("newTodo ", newTodo);

    // add task to dom and make sure input is below it. We add task first so input is added to correct location
    addTaskToDom(text, isImportant, _id, currentColumn, completed);
    addInputToDom(currentInput, currentColumn, currentRow);
    currentInput.focus();
  }
}

function getTextFromNode(node, addSpaces) {
  var i, result, text, child;
  result = "";
  for (i = 0; i < node.childNodes.length; i++) {
    child = node.childNodes[i];
    text = null;
    if (child.nodeType === 1) {
      text = getTextFromNode(child, addSpaces);
    } else if (child.nodeType === 3) {
      text = child.nodeValue;
    }
    if (text) {
      if (addSpaces && /\S$/.test(result) && /^\S/.test(text))
        text = " " + text;
      result += text;
    }
  }
  return result;
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

function keyPressEventListener(evt) {
  focusInput();
  if ((evt.shiftKey && evt.key === "D") || (evt.shiftKey && evt.key === "F")) {
    handleShift(evt);
  }
}

// NOTE : focusInput is needed since input.focus() is not working --> IDK WHY
function focusInput() {
  const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER);
  const currentText = currentInput.value;
  currentInput.parentElement.removeChild(currentInput);
  const inputCopy = makeInputElement(currentText);
  // NOTE : Decrement currentRow since we are placing an input in the same place. addInput assumes new row so we must correct this
  currentRow--;
  addInputToDom(inputCopy, currentColumn, currentRow + 1);
}

function handleShift(evt) {
  // prevent the character from being registered and shift input to correct grid slot
  evt.preventDefault();
  const currentInput = document.querySelector(INPUT_FIELD_IDENTIFIER);
  const currentText = currentInput.value;
  if (evt.shiftKey && evt.key === "D") {
    // shift input to previous grid slot if in range
    if (currentColumn > MIN_TASK_DEPTH) {
      currentColumn--;
      currentInput.parentElement.removeChild(currentInput);
      const shiftedInput = makeInputElement(currentText);
      addInputToDom(shiftedInput, currentColumn, currentRow);
    }
  } else if (evt.shiftKey && evt.key === "F") {
    // shift input to next grid slot if in range
    if (currentColumn < MAX_TASK_DEPTH - TASK_DEPTH_CORRECTOR) {
      currentColumn++;
      currentInput.parentElement.removeChild(currentInput);
      const shiftedInput = makeInputElement(currentText);
      addInputToDom(shiftedInput, currentColumn, currentRow);
      console.log("Current depth : ", currentColumn);
    } else {
      console.log("Out of range. Depth is ", currentColumn);
    }
  }
}

function attachToggleCheckEventListener(element) {
  element.addEventListener("click", (e) => {
    // update view and tell server what happened
    e.preventDefault();
    let taskStatus = element.dataset.checked == "true";
    console.log("staus becoming ", !taskStatus);
    let taskIsCompleted = !taskStatus;
    handleTaskStatus(element, taskIsCompleted);
  });
}

function handleTaskStatus(element, taskIsCompleted) {
  renderStatus(taskIsCompleted, element);
  updateTaskCompletionInDB(element, taskIsCompleted);
}

function renderStatus(taskIsCompleted, element) {
  const checkOffLocation = 2;
  const originalText = extractTextFromElement(element);

  const checkedStyles = {
    complete: {
      checkedValue: true,
      textDecoration: "none",
      fillValue: "X",
    },
    incomplete: {
      checkedValue: false,
      textDecoration: "none",
      fillValue: "",
    },
  };
  const checkStyles = taskIsCompleted
    ? checkedStyles.complete
    : checkedStyles.incomplete;

  const { checkedValue, textDecoration, fillValue } = checkStyles;

  element.dataset.checked = checkedValue;
  element.style.textDecoration = textDecoration;
  // REMOVE X
  if (checkStyles == checkedStyles.complete) {
    element.textContent =
      originalText.slice(0, checkOffLocation) +
      fillValue +
      originalText.slice(checkOffLocation);
  }
  // ADD X
  else {
    element.textContent =
      originalText.slice(0, checkOffLocation) +
      fillValue +
      originalText.slice(checkOffLocation + 1);
  }
}

function attachDeleteBtnEventListener(btn) {
  btn.addEventListener("click", (e) => {
    console.log("DELETE BUTTON CLICKED ", e);
    //currentRow--;
    // \e.preventDefault(); // DISABLING THIS MAKES IT WORK AND IDK WHY !!
    e.stopImmediatePropagation();
    e.preventDefault(); // ENABLING THIS MAKES IT WORK NOW AND IDK WHY (something to do w/ parent vs sibling relationship or something)
    // reset pointer id if there is already a task since it changes to -1 for somet reason
    if (form.childElementCount > 0 && e.pointerId == -1) {
      handleEnter(e);
    }
    if (e.pointerId === 1) {
      console.log("legitimate delete call");
      let wordId = btn.parentElement.dataset.id;

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
      //currentRow--;
    } else {
      console.log("illegitimate delete call");
    }
  });
}

form.addEventListener("submit", handleEnter);

// AJAX

// NOTE : taskId will be deprecated since id will be generated on backend. That way id stored in db matches what's
// on frontend so we dont need to convert between the two
async function saveTaskToServer(
  text,
  parentList,
  depth,
  isImportant,
  isCompleted
) {
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

async function updateTaskCompletionInDB(element, taskIsCompleted) {
  const computedStyle = window.getComputedStyle(element);
  const depth = computedStyle.getPropertyValue("grid-column-start");
  console.log("telling server task is completed for task ", element.dataset.id);
  //var parentElement = element.parentElement;
  // Returns the text content as a string

  const text = extractTextFromElement(element);

  console.log("textContent", text);
  await fetch("/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: element.dataset.id,
      description: text,
      parentList: "test",
      depth: depth - NUM_COL_OFFSET,
      isImportant: "false",
      completed: taskIsCompleted,
    }),
  });
}

function extractTextFromElement(element) {
  let elChildNode = element.childNodes;
  let text = "";

  elChildNode.forEach(function (value) {
    if (value.nodeType === Node.TEXT_NODE) {
      console.log("Current textNode value is : ", value.nodeValue.trim());
      text += value.nodeValue;
    }
  });
  return text;
}

function getAllTasks() {
  return fetch("/tasks").then((data) => data.json());
}
