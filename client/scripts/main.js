//DEFINES
const host = "https://ievent-shenkar.herokuapp.com";
//const host = "http://localhost:8080";
//GET PARAMS
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const id = params.id;
const crud = params.crud;
//GLOBAL VARIABLE
var stateOfPage = "VIEW";
//map function
function setMap(location){
    document.getElementById("map").src = `https://maps.google.com/maps?q=${location}&t=&z=17&ie=UTF8&iwloc=&output=embed`
}
//PAGE LOADER SELECTOR
$(document).ready(function () {
    const pageName = document.getElementById('pageName');
    const navEventList = document.getElementById('navEventList');
    const navAddEvent = document.getElementById('navAddEvent');
    if (crud) {
        if (id) {
            stateOfPage = "DELETE/EDIT";
            navEventList.classList.remove("current");
            navAddEvent.classList.remove("current");
            pageName.innerHTML="Delete/edit event";
            showEventForm(id);
        }
        else {
            stateOfPage = "ADD";
            navEventList.classList.remove("current");
            navAddEvent.classList.add("current");
            pageName.innerHTML="Add event";
            showEventForm(-1);
        }
    }
    else {
        stateOfPage = "VIEW";
        navEventList.classList.add("current");
        navAddEvent.classList.remove("current");
        pageName.innerHTML="Events list";
        showAllEvents();
    }
});
//~~~~~~~EVENT LIST~~~~~~~~~~~~~~~~~
function showAllEvents() {
    $.ajax({
        url: `${host}/api/event`,
        type: "GET",
        success: (events) => {
            createEventTable(events);
        }
    });
}
async function getCurrentStatus(eventItem) {
}
async function createEventTable(events) {
    const tableStructue =
        '<table class="table" id="eventsTable">' +
            '<thead class="thead-dark">' +
                '<tr>' +
                    //'<th scope="col">ID</th>' +
                    '<th scope="col">Name</th>' +
                    '<th scope="col">Location</th>' +
                    '<th scope="col">Time</th>' +
                    '<th scope="col">Current Status</th>' +
                    '<th scope="col">Actions</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
        '</table>';
    $('#mainsectionflex').empty().append(tableStructue);
    //$('#eventsTable').append(events);
    events.forEach(async s => {
        const current_status = await getCurrentStatus(s);
        var date = new Date(s.time).toLocaleDateString();
        var time = new Date(s.time).toLocaleTimeString();
        $("table tbody").append(
            '<tr>' +
            //'<th scope="row">' + s.id + '</th>' +
            '<td>' + s.name + '</td>' +
            '<td><p class="clickAbleP" onclick="setMap(\''+s.location+'\')">' + s.location + '</p></td>' +
            '<td>' + date +' '+ time + '</td>' +
            '<td>' + current_status + '</td>' +
            '<td>' + '<a href="home.html?crud=edit&id=' + s.id + '"><span  class="btn btn-info editbtnclass" id="editbtnid-' + s.id + '" h>Edit/Delete</span></a></td>' +
            '</tr>'
        );
    });
}
//~~~~~~~event form~~~~~~~~~~~~~~~~~
function showEventForm(eventId) {
    createEventForm();
    if (eventId == -1) {
        stateOfPage = "ADD";
        setFormForAdd();
    }
    else {
        stateOfPage = "DELETE/EDIT";
        setFormForEditDelete(eventId);
    }
}
async function createEventForm() {
    const formStructure =
        '<form class="formclass" id="eventForm">' +
            '<div class="form-outline mb-4">' +
                '<label class="form-label" for="form6Example3">Name:</label>' +
                '<input type="text" id="name" name="name" class="form-control" required/>' +
            '</div>' +
            '<div class="form-outline mb-4">' +
                '<label class="form-label" for="form6Example4">Location:</label>' +
                '<input type="text" id="location" name="location" class="form-control" required/>' +
            '</div>' +
            '<div class="form-outline mb-4">' +
                '<label class="form-label" for="form6Example5">Time:</label>' +
                '<input type="datetime-local" id="time" name="time" class="form-control" required/>' +
            '</div>' +
            '<div class="col-12">' +
                '<label class="visually-hidden" for="inlineFormSelectPref">Description:</label>' +
                '<textarea id="description" name="description"></textarea>' +
            '</div>' +
            '<div class="col-12">' +
                '<label class="visually-hidden" for="inlineFormSelectPref">Police instructions:</label>' +
                '<textarea id="government" name="government"></textarea>' +
            '</div>' +
            '<div class="form-outline mb-4">' +
                '<label class="form-label" for="form6Example4">Status:</label>' +
                '<input type="text" id="status" name="status" class="form-control" readonly/>' +
            '</div>' +
            '<div id="button place">' +
            '</div>' +
        '</form>';
    $('#mainsectionflex').empty().append(formStructure);
}
// event add buttons
async function setFormForAdd() {
    document.getElementById("button place").innerHTML = '';
    var submitButton = document.createElement('button');
    submitButton.type = "submit";
    submitButton.className = "btn btn-primary btn-block mb-4";
    submitButton.id = "submitButton";
    submitButton.innerHTML = "Add";
    document.getElementById("button place").append(submitButton);
    submitForm();
}
// event edit/delete buttons
async function setFormForEditDelete(eventId) {
    const res_Check_If_Event_Exists = await fetch(`${host}/api/event/${eventId}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const event_Resjson = await res_Check_If_Event_Exists.json();
    if (!(res_Check_If_Event_Exists.status == 200)) {
        alert("Event retriving Error going. Going back to add mode");
        window.location.href = 'home.html';
    }
    else {
        const time=new Date(event_Resjson.time);
        var month = time.getMonth();
        if (month<10){
            month = "0"+month;
        }
        var date = time.getDate();
        if (date<10){
            date = "0"+date;
        }
        var hours = time.getHours();
        if (hours<10){
            hours = "0"+hours;
        }
        var minutes = time.getMinutes();
        if (minutes<10){
            minutes = "0"+minutes;
        }
        const timeString= ""+time.getFullYear()+"-"+month+"-"+date+"T"+hours+":"+minutes;
        document.getElementById("name").value = event_Resjson.name;
        document.getElementById("location").value = event_Resjson.location;
        document.getElementById("time").value = timeString;
        document.getElementById("description").value = event_Resjson.description;
        document.getElementById("government").value = event_Resjson.government;
        document.getElementById("status").value = event_Resjson.status;
        document.getElementById("button place").innerHTML = '';
        var submitButton = document.createElement('button');
        submitButton.type = "submit";
        submitButton.className = "btn btn-primary btn-block mb-4";
        submitButton.id = "submitButton";
        submitButton.innerHTML = "Update";
        var deleteButton = document.createElement('button');
        deleteButton.type = "button";
        deleteButton.className = "btn btn-primary btn-block mb-4";
        deleteButton.id = "deleteButton";
        deleteButton.innerHTML = "Delete";
        document.getElementById("button place").append(submitButton);
        document.getElementById("button place").append(deleteButton);
    }
    submitForm(eventId);
    deleteItem(eventId);
}
//if press on delete event
async function deleteItem(eventId) {
    var deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", async function () {
        const res = await fetch(`${host}/api/event/${eventId}`, {
            method: "DELETE"
        })
        const resjson = await res.json();
        if (resjson.status == 200) {
            window.location.href = "home.html";
        }
        window.location.href = "home.html";
    });
}
//if press on add/update event
async function submitForm(eventId) {
    const formObj = document.getElementById("eventForm");
    formObj.addEventListener("submit", async function (event) {
        // stop form submission
        event.preventDefault();
        // validate the form
        const nameValid = formObj.elements["name"].value;
        if (!(/^[A-Za-z0-9\s]+$/.test(nameValid))) {
            alert("You have entered an invalid event name! you can use only chars and numbers");
            return false;
        }
        const formvalue = {
            name: nameValid,
            location: formObj.elements["name"].value,
            time: formObj.elements["time"].value,
            description: formObj.elements["description"].value,
            government: formObj.elements["government"].value,
            status: "waiting for approval",
        }
        const stringBody = JSON.stringify(formvalue);
        const host_To_Send = (stateOfPage == "ADD") ? `${host}/api/event` : `${host}/api/event/${eventId}`;
        const method_Of_Operation = (stateOfPage == "ADD") ? "POST" : "PUT";
        const res = await fetch(host_To_Send, {
            method: method_Of_Operation,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringBody
        })
        const resjson = await res.json();
        if (res.status == 200) {
            window.location.href = "home.html";
            return true;
        }
        alert(resjson.msg);
        return false;
    });
}


