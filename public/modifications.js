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
const MAX_ENTRIES = 5;

form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent the page from reloading when form is submitted
    if(totalEntries < MAX_ENTRIES){
        removeEntryReminder();
        const text = textInput.value;
        const isImportant = importanceInput.checked;
        const isValidText = validateText(text);
        if(isValidText){
            updateTodoList(text, isImportant);
            saveToServer(text, isImportant);
        }
    }else{
        showEntryReminder();
    }
    // clear text and bold color
    textInput.value = "";
    importanceInput.checked = false;
})

// rejects/accepts input text 
function validateText(text){
    // add some stuff 
    return true;
}
function saveToServer(text, isImportant){
    fetch("/api/task", {
        method:"POST",
        body:JSON.stringify({[text] : isImportant})
    }).then(res => console.log(res.json()))
}

function showEntryReminder(){
    entryReminder.style.visibility = "visible"
}

function removeEntryReminder(){
    entryReminder.style.visibility = "hidden"
}

function updateTodoList(text, isImportant){
    // check if we have hit max number of todos
    totalEntries++;
    console.log("adding todo", totalEntries)
    
    let newTodo = makeTodo(text, isImportant);
    list.append(document.createElement("br")) // append a br so there is a line break between each new todo
    list.appendChild(newTodo) 
}

function makeTodo(text, isImportant) {
    // make new element and append it to list with delete button
    let deleteButton = makeDeleteButton();
    let newTodo = document.createElement("div");
    newTodo.classList += "child";
    // if its important make text bold and add start
    newTodo.textContent = (isImportant) ? "\u2729 " + text : text;
    newTodo.setAttribute("draggable","true" );
    newTodo.style.cursor =  "move";
   
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