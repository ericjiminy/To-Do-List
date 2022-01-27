// click link -> show tab
function showTab(e) {
    for (let tab of document.getElementsByClassName("tab")) {   // hide all tabs
        tab.style.display = "none";
    }
    for (let link of document.getElementsByClassName("link")) { // remove current active link
        link.classList.remove("active");
    }
    document.getElementById(e.target.textContent).style.display = "block";  // show selected tab
    e.target.className += " active";    // update activeLink and activeTab
    activeLink = e.target;
    activeTab = document.getElementById(activeLink.textContent);
}

// change listName -> change link
function updateLink(e) {
    let currName = activeTab.id;
    let newName = e.target.textContent;

    activeLink.textContent = newName;
    activeTab.id = newName;

    listNames[listNames.indexOf(currName)] = newName;
    save();
}

// enforce unique list names
function uniqueName(e) {
    let activeName = activeTab.querySelector("h1").textContent;
    if (listNames.indexOf(activeName) != listNames.lastIndexOf(activeName)) {
        alert("Please choose a unique list name.");
        return;
    }
    if (e instanceof Event) {
        showTab(e);
    }
    else {
        newLink(e);
    }
    save();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// "Enter" key -> click "add"
function enterToClick(e) {
    if (e.key == 'Enter') {
        newItem();
    }
}

// "add" button -> add new item
function newItem() {
    let text = activeTab.querySelector("input").value;
    if (text == "") return;     // blank input
    let item = document.createElement("li");
    item.textContent = text;
    item.addEventListener("click", checked);
    createDelete(item);
    activeTab.querySelector("ul").append(item);
    activeTab.querySelector("input").value = "";     // clear input
    save();
}

// item clicked -> checked
function checked(e) {
    if (e.target.tagName = "li") {
        e.target.classList.toggle("checked");   // toggle checked
    }
    save();
}

// create "delete" button
function createDelete(item) {
    let span = document.createElement("span");
    span.className = "delete";
    span.addEventListener("click", function(e) {
        e.target.parentElement.remove();
        save();
    });
    let text = document.createTextNode("\u00D7");   // multiply sign
    span.append(text);
    item.append(span);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create new blank link
function newLink(id) {
    let linkBar = document.getElementById("linkBar");
    if (id == "New List") {
        let idNum = linkBar.childElementCount - 1;
        id += " " + idNum;
    }
    listNames.push(id);

    let link = document.createElement("button");
    link.className = "link";
    link.textContent = id;
    link.addEventListener("click", uniqueName);

    let newTabButton = document.getElementById("newTab");
    newTabButton.before(link);

    newTab(id);
    if (linkBar.childElementCount > 2) link.click();
    save();
    return link;
}

// create new blank tab
function newTab(id) {
    let tab = document.createElement("div") // tab div
    tab.id = id;
    tab.className = "tab";

    let listName = document.createElement("h1"); // listName / header
    listName.id = "listName";
    listName.contentEditable = "true";
    listName.textContent = id;
    listName.addEventListener("input", updateLink);
    tab.append(listName);

    let addBar = document.createElement("div") // addBar div
    addBar.id = "addBar";
    tab.append(addBar);
    let input = document.createElement("input"); // input bar
    input.className = "input";
    input.type = "search";
    input.autocomplete = "off";
    input.placeholder = "New Item...";
    input.addEventListener("keypress", enterToClick);
    addBar.append(input);
    let add = document.createElement("span"); // add button
    add.className = "add";
    add.addEventListener("click", newItem);
    add.textContent = "Add";
    addBar.append(add);

    let ul = document.createElement("ul"); // list
    tab.append(ul);

    document.body.append(tab);
    return tab;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let listNames;
let activeLink;
let activeTab;

// create default link and tab if there's no localStorage
function start() {
    listNames = [];

    activeLink = newLink("To-Do List");
    activeLink.classList.add("active");
    activeLink.id = "defaultLink";
    activeLink.textContent = "To-Do List";

    activeTab = document.getElementById("To-Do List");
    activeTab.id = "To-Do List";
    activeTab.querySelector("listName").textContent = activeTab.id;
    let firstItem = document.createElement("li");
    firstItem.textContent = "Click to check me off";
    firstItem.addEventListener("click", checked);
    createDelete(li);
    activeTab.querySelector("ul").append(li);
}

// save current html to localStorage
function save() {
    localStorage.setItem("html", document.body.innerHTML);
}

// load existing html from localStorage
function load() {
    let content = localStorage.getItem("html");
    if (content) {
        document.body.innerHTML = content;

        let linkBar = document.getElementById("linkBar");
        listNames = [];
        for (let link of linkBar.children) {
            listNames.push(link.textContent);
        }
        activeLink = linkBar.children[0];
        activeTab = document.getElementById(activeLink.textContent);
        
        addListeners();
        activeLink.click();
    } else {
        start();
    }
}

// apparently eventListeners aren't saved in localStorage   >:(
function addListeners() {
    /**
     * links, new tab button    DONE
     * 
     * h1   DONE
     * 
     * input, add button    DONE
     * 
     * li (check, delete)
     */

    let links = document.getElementsByClassName("link");
    for (let link of links) {
        link.addEventListener("click", uniqueName);
    }

    let listNames = document.getElementsByTagName("h1");
    for (let h of listNames) {
        h.addEventListener("input", updateLink);
    }

    let inputs = document.getElementsByClassName("input");
    for (let input of inputs) {
        input.addEventListener("keypress", enterToClick);
    }

    let adds = document.getElementsByClassName("add");
    for (let add of adds) {
        add.addEventListener("click", newItem);
    }

    let items = document.getElementsByTagName("li");
    for (let item of items) {
        item.addEventListener("click", checked);
    }

    let deletes = document.getElementsByClassName("delete");
    for (let del of deletes) {
        del.addEventListener("click", function(e) {
            e.target.parentElement.remove();
            save();
        });
    }
}

load();
