// click link -> change tabs
function showTab(e) {
    if (e.target.tagName == "SPAN") return; // ignore "close" button

    for (let tab of document.getElementsByClassName("tab")) {   // hide all tabs
        tab.style.display = "none";
    }
    for (let link of document.getElementsByClassName("link")) { // remove current active link
        link.classList.remove("active");
    }
    
    let linkId = e.target.id;
    let tabId = linkId.substring(0, linkId.length - 4) + "tab";
    document.getElementById(tabId).style.display = "block";  // show selected tab
    e.target.className += " active";
    activeLink = e.target;  // update activeLink and activeTab
    activeTab = document.getElementById(tabId);
}

// change listName -> change link
function updateLink(e) {
    let currLinkId = activeLink.id; // old link id
    let newLinkId = e.target.textContent + "link";  // new link and tab id's
    let newTabId = e.target.textContent + "tab";

    activeLink.textContent = newLinkId.substring(0, newLinkId.length - 4);  // update link name
    createClose(activeLink);    // re-add "close" button to link
    activeLink.id = newLinkId;
    activeTab.id = newTabId;

    listNames[listNames.indexOf(currLinkId)] = newLinkId;   // update list of link id's
    save();
}

// enforce unique list names
function uniqueName(e) {
    if (!(e instanceof Event)) {    // rename new list before creating another one
        if (activeLink.id.substring(0, activeLink.id.length - 6) == "New List") {
            alert("Please choose a unique list name.");
            return;
        }
    }

    if (listNames.indexOf(activeLink.id) != listNames.lastIndexOf(activeLink.id)) { // name already exists
        alert("Please choose a unique list name.");
        return;
    }
    if (e instanceof Event) {   // change tabs
        showTab(e);
    }
    else {  // create new tab
        newLink(e);
    }
    save();
}

// create "close" button
function createClose(link) {
    let span = document.createElement("span");
    span.className = "close";
    let text = document.createTextNode("\u00D7");   // multiply sign
    span.append(text);
    span.addEventListener("click", closeTab);
    link.append(span);
}

// "closeTab" -> delete link + tab
function closeTab(e) {
    let linkBar = document.getElementById("linkBar");
    let links = linkBar.children;

    let link = e.target.parentElement;
    if (link == links[0]) return;   // can't close first tab

    let tab = document.getElementById(link.id.substring(0, link.id.length - 4) + "tab");
    let index = listNames.indexOf(link.id);
    if (index > -1) listNames.splice(listNames.indexOf(link.id), 1);    // remove from listNames

    link.remove();
    tab.remove();

    activeLink = links[0];  // switch to first tab
    activeLink.click();
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
    if (text == "") return;     // blank input -> do nothing
    let item = document.createElement("li");
    item.textContent = text;
    item.addEventListener("click", checked);
    createDelete(item);
    activeTab.querySelector("ul").append(item);
    activeTab.querySelector("input").value = "";     // clear input bar
    save();
}

// item clicked -> checked
function checked(e) {
    if (e.target.tagName = "li") {
        e.target.classList.toggle("checked");   // toggle "checked" class
    }
    save();
}

// create "delete" button
function createDelete(item) {
    let span = document.createElement("span");
    span.className = "delete";
    let text = document.createTextNode("\u00D7");   // multiply sign
    span.append(text);
    span.addEventListener("click", function(e) {    // click -> delete item
        e.target.parentElement.remove();
        save();
    });
    item.append(span);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create new blank link
function newLink(id) {
    let linkBar = document.getElementById("linkBar");
    if (id == "New List") { // "New List #"
        let idNum = linkBar.childElementCount - 1;
        id += " " + idNum;
    }
    
    let link = document.createElement("button");    // create link
    link.className = "link";
    link.id = id + "link";
    listNames.push(link.id);    // add to listNames
    link.textContent = id;
    link.addEventListener("click", uniqueName);
    createClose(link);

    let newTabButton = document.getElementById("newTab");   // insert link before "new tab" button
    newTabButton.before(link);
    newTab(id);
    if (linkBar.childElementCount > 2) link.click();    // switch to the new tab
    save();
    return link;
}

// create new blank tab
function newTab(id) {
    let tab = document.createElement("div") // tab div
    tab.id = id + "tab";
    tab.className = "tab";

    let listName = document.createElement("h1"); // listName / h1
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

    activeLink = newLink("To-Do List"); // first link
    activeLink.classList.add("active");
    activeLink.id = "To-Do List" + "link";
    activeLink.textContent = "To-Do List";
    createClose(activeLink);
    
    activeTab = document.getElementById("To-Do List" + "tab");  // first tab
    let firstItem = document.createElement("li");   // first item
    firstItem.textContent = "Click to check me off";
    firstItem.addEventListener("click", checked);
    createDelete(firstItem);
    activeTab.querySelector("ul").append(firstItem);
}

// save current html to localStorage
function save() {
    localStorage.setItem("html", document.body.innerHTML);
}

// load existing html from localStorage
function load() {
    let content = localStorage.getItem("html");
    if (content) {  // found existing html
        document.body.innerHTML = content;

        let linkBar = document.getElementById("linkBar");
        listNames = [];
        for (let link of linkBar.children) {    // fill listNames
            listNames.push(link.id);
        }
        activeLink = linkBar.children[0];   // show first tab
        let activeLinkId = activeLink.id.substring(0, activeLink.id.length - 4);
        activeTab = document.getElementById(activeLinkId + "tab");
        
        addListeners(); // re-add eventListeners
        activeLink.click();
    } else {    // no existing html -> start new
        start();
    }
}

// apparently eventListeners aren't saved in localStorage? we have to re-add everytime we load   :(
function addListeners() {
    let links = document.getElementsByClassName("link");
    for (let link of links) {
        link.addEventListener("click", uniqueName);
        let close = link.children[0];
        close.addEventListener("click", closeTab);
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
// start();