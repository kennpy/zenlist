const form = document.querySelector("form");
const textInput = document.querySelector("#text");
const importanceInput = document.querySelector("#importance");
const list = document.querySelector(".list");
const everyDeleteButton = document.querySelectorAll("button.delete")
const todoHeader = document.querySelector(".storage > h3")
const entryReminder = document.createElement("b")
entryReminder.textContent = "Only 5 elements please"
todoHeader.appendChild(entryReminder)
entryReminder.style.visibility = "hidden"

let totalEntries = 0;
const MAX_NUM_ENTRIES = 5;
const MIN_ENTRY_DEPTH = 0;
const MAX_ENTRY_DEPTH = 4;

// task store to store our tasks locally
// KEY : taskId generated upon task form submit
// VALUE : array containing [ (STRING) text , (INT) depth]
let taskStore = {}

// letting margin using depth    (idea)
/*
const marginLeftStep = 20; 
for (let i = 1; i <= depth; i++)
{ 
    style.innerHTML += `.depth-${i} { margin-left: ${(i - 1) * marginLeftStep}px; }\n`; 
}
*/

fetch("/api")
    .then(data => data.text())
    .then(data => data.split("}"))
    .then(data => console.log(data))    
    .then(data => {
        data.forEach(elem => {
            
        })
    })
//.then((data) => data.json())
    //.then(jsonData => console.log(jsonData))


let currentDepth = 0;
const taskMargin = 20; // how many px to offset tasks by --> offset = currentDepth * taskMargin

form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent the page from reloading when form is submitted
    if(totalEntries < MAX_NUM_ENTRIES){
        removeEntryReminder();
        const text = textInput.value;
        const isImportant = importanceInput.checked;
        const isValidText = validateText(text);
        if(isValidText){
            const taskId = crypto.randomUUID();
            console.log(taskId);
            addTaskToDom(text, isImportant, taskId);
            saveToServer(text, isImportant, taskId);

        }
    }else{
        showEntryReminder();
    }
    // clear text and bold color
    textInput.value = "";
    importanceInput.checked = false;
})

// rejects/accepts input text 
function validateText(text, isImportant, taskId){
    // add some stuff 
    return true;
}

function updateTaskStore(text, isImportant, taskId){

}

// builds dom using taskStore --> includes id, text, isImportant, depth
//  used server returns all tasks
function buildDom(taskStore){

}

document.onkeydown = keydownListener; 
console.log("starting depth : ", currentDepth);

function keydownListener (evt) { 

    if (!evt) evt = event; 

    if (evt.shiftKey && evt.key === 'D') {
        // check current depth and decrement if in range
        if(currentDepth > MIN_ENTRY_DEPTH){
            currentDepth--;
            console.log("Current depth : ", currentDepth); 
        }
        else{
            console.log("Out of range. Depth is ", currentDepth)
        }

    } else if (evt.shiftKey && evt.key === 'F') {
        // check current depth and decrement if in range
        if(currentDepth < MAX_ENTRY_DEPTH){
            currentDepth++;
            console.log("Current depth : ", currentDepth); 
        }
        else{
            console.log("Out of range. Depth is ", currentDepth)
        }
    }

}

function saveToServer(text, isImportant, taskId){
    fetch("/api/task", {
        method:"POST",
        body:JSON.stringify({[text] : [isImportant, taskId, currentDepth]})
    }).then(res => console.log(res.json()))
}

function showEntryReminder(){
    entryReminder.style.visibility = "visible"
}

function removeEntryReminder(){
    entryReminder.style.visibility = "hidden"
}

function addTaskToDom(text, isImportant, taskId){
    // check if we have hit max number of todos
    totalEntries++;
    console.log("adding todo", totalEntries)
    
    let newTodo = generateTodoElement(text, isImportant);
    list.append(document.createElement("br")) // append a br so there is a line break between each new todo
    
    // add more here to specify the depth (another function probably)
    list.appendChild(newTodo);

}

function generateTodoElement(text, isImportant) {
    // make new element and append it to list with delete button
    let deleteButton = makeDeleteButton();
    let newTodo = document.createElement("div");
    newTodo.classList += "child";
    // if its important make text bold and add start
    newTodo.textContent = (isImportant) ? "\u2729 " + text : text;
   
    newTodo.appendChild(deleteButton);
    attachDeleteBtnEventListener(deleteButton);
    return newTodo;
}

function makeDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.classList += "delete";
    deleteButton.textContent = "Delete";
    deleteButton.style.marginLeft = "1%";
    return deleteButton;
}

function attachDeleteBtnEventListener(btn) {
    btn.addEventListener("click", (e) => {
        e.preventDefault(); // dont reload page
        console.log(btn.parentElement);
        btn.parentElement.classList += " hidden"; // hide the todo now that its been deleted
        btn.parentElement.nextElementSibling.remove(); // remove the br so no extra width is maintained
        totalEntries = totalEntries - 1;
    })
}