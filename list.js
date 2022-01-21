// helper function to load existing html from localStorage
function load() {
    let content = localStorage.getItem("html");
    if (content) {
        document.body.innerHTML = content;
    }
}
load();

// helper function to save current html in localStorage
function save() {
    localStorage.setItem("html", document.body.innerHTML);
}

// li clicked -> checkmark
document.querySelector("ul").addEventListener("click", function(e) {
    if (e.target.tagName = "li") {
        e.target.classList.toggle("checked");   // mark li as checked -> add checkmark
    }
    save();
});

// helper function to create "delete" button
let createDeleteButton = function(item) {
    let span = document.createElement("span");
    let text = document.createTextNode("\u00D7");
    span.className = "delete";
    span.addEventListener("click", function(e) {    // click -> remove li
        let item = e.target.parentElement;
        document.querySelector("ul").removeChild(item);
        save();
    });
    span.appendChild(text);
    item.appendChild(span);
}

// Add "delete" button to each li
let items = document.getElementsByTagName("li");
for (let item of items) {
    createDeleteButton(item);
}

// "Add" button -> add new li
function newItem() {
    let text = document.querySelector("input").value;   // get input
    if (text == "") return;     // blank input -> return
    let item = document.createElement("li");    // create new li
    let textNode = document.createTextNode(text);   // add input text to li
    item.appendChild(textNode);
    createDeleteButton(item);   // add "delete" button to li
    document.querySelector("ul").appendChild(item); // add li to ul
    document.querySelector("input").value = "";     // clear input
    save();     // save current html in localStorage
}

// "Enter" key -> trigger "Add" button
document.querySelector("input").addEventListener("keyup", function(e){
    if (e.key === 'Enter') {
        document.getElementById("add").click();
    }
});