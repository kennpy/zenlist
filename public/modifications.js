const form = document.querySelector("form");
const textInput = document.querySelector("#text");
const importanceInput = document.querySelector("#importance");
const list = document.querySelector(".list");
const everyDeleteButton = document.querySelectorAll("button.delete")

form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent the page from reloading when form is submitted
    const text = textInput.value;
    const important = importanceInput.checked;
    makeATodo(text, important);
})

// makes a todo and adds it to the list
function makeATodo(text, isImportant){
    // make new element and append it to list with delete button
    let deleteButton = document.createElement("button");
    deleteButton.classList += "delete"
    deleteButton.textContent = "Delete"
    deleteButton.style.marginLeft = "1%"

    let newTodo = document.createElement("div"); 
    newTodo.classList += "child"
    newTodo.textContent = text;
    newTodo.appendChild(deleteButton)
    addDeleteBtnEventListener(deleteButton);
    // if its important make text bold
    if(isImportant) newTodo.style.fontWeight = "bold"
    list.append(document.createElement("br")) // append a br so there is a line break between each new todo
    list.appendChild(newTodo) 
}

function addDeleteBtnEventListener(btn) {
    btn.addEventListener("click", (e) => {
        e.preventDefault(); // dont reload page
        console.log(btn.parentElement);
        btn.parentElement.classList += " hidden"; // hide the todo now that its been deleted
        btn.parentElement.nextElementSibling.remove(); // remove the br so no extra width is maintained
    })
}