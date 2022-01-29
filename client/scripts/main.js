//DEFINES
// const host = "https://ievent-shenkar.herokuapp.com"; //Noam
// const host = "https://ievent-server.herokuapp.com"; //MISHA
const host = "http://127.0.0.1:8080"; //LOCAL
//GET PARAMS
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const id = params.id;
const crud = params.crud;
const token = sessionStorage.getItem("jwt");
const nameData = sessionStorage.getItem('name');
const userType = sessionStorage.getItem('userType');
const creatorId = sessionStorage.getItem('id');
console.log(`session storage: nameData-${nameData}, userType-${userType}, creatorId-${creatorId}`);
//GLOBAL VARIABLE
var stateOfPage = "Events";
//map function
function setMap(location) {
    document.getElementById("map").src = `https://maps.google.com/maps?q=${location}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
    sessionStorage.setItem("mapLocation", location);
}
//PAGE LOADER SELECTOR
$(document).ready(function () {
    if (token === null) {
        console.log("try to enter without token")
        window.location.href = 'index.html';
    }
    setMap(sessionStorage.getItem("mapLocation"));
    const userDataHTMLObj = document.getElementById('operatorname');
    userDataHTMLObj.innerHTML = nameData;   //put name of user
    const pageName = document.getElementById('pageName');
    const navEventList = document.getElementById('navEventList');
    const navMyEvents = document.getElementById('navMyEvents');
    const navAddEvent = document.getElementById('navAddEvent');
    if (userType == "GOVERNMENT"){
        navMyEvents.innerHTML = "Waiting Events";
    }    
    if (crud) {
        console.log(`crud is: ${crud}`);
        if (id) {
            console.log(`id is: ${id}`);
            if (crud=="join"){
                stateOfPage = "JOIN/LEAVE";
                navEventList.classList.remove("current");
                navMyEvents.classList.remove("current");
                navAddEvent.classList.remove("current");
                pageName.innerHTML = "Join/leave event";
                showEventForm(id);
            }
            else{
                stateOfPage = "DELETE/EDIT";
                navEventList.classList.remove("current");
                navAddEvent.classList.remove("current");
                pageName.innerHTML = "Delete/edit event";
                showEventForm(id);
            }
        }
        else {
            stateOfPage = "ADD";
            navEventList.classList.remove("current");
            navAddEvent.classList.add("current");
            pageName.innerHTML = "Add event";
            showEventForm(-1);
        }
    }
    else {
        stateOfPage = "Events";
        navEventList.classList.add("current");
        navMyEvents.classList.remove("current");
        navAddEvent.classList.remove("current");
        pageName.innerHTML = "Events list";
        showAllEvents();
    }
});
//~~~~~~~EVENT LIST~~~~~~~~~~~~~~~~~
function showAllEvents() {
    $.ajax({
        url: `${host}/api/event`,
        type: "GET",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            "Access-Control-Allow-Methods": "*",
            "Authorization": `Bearer ${token}`
        },
        statusCode: {
            403: function() {
                alert ("Session time passed out please re-login");
                window.location.href = 'index.html';
            }
        },
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
        '<th scope="col">Participants</th>' +
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
        var date = new Date(s.time).toLocaleDateString();
        var time = new Date(s.time).toLocaleTimeString();
        var buttons;
        if (s.creator == creatorId || userType == "GOVERNMENT")
            buttons='<a href="home.html?crud=edit&id=' + s.id + '"><span  class="btn btn-info editbtnclass" id="editbtnid-' + s.id + '" h>Edit</span></a>'
        else
            buttons='<a href="home.html?crud=join&id=' + s.id + '"><span  class="btn btn-info editbtnclass" id="editbtnid-' + s.id + '" h>Join/Leave</span></a>'
        $("table tbody").append(
            '<tr>' +
            //'<th scope="row">' + s.id + '</th>' +
            '<td>' + s.name + '</td>' +
            '<td><p class="clickAbleP" onclick="setMap(\'' + s.location + '\')">' + s.location + '</p></td>' +
            '<td>' + date + ' ' + time + '</td>' +
            '<td>' + s.numberofparticipants + '</td>' +
            '<td>' + s.status + '</td>' +
            '<td>' + buttons + '</td>' +
            '</tr>'
        );
    });
}
//~~~~~~~event form~~~~~~~~~~~~~~~~~
async function showEventForm(eventId) {
    await createEventForm();
    if (eventId == -1) {
        stateOfPage = "ADD";
        await setFormForAdd();
    }
    else {
        await fillForm(eventId);
        await lockForm();
        if (stateOfPage == "JOIN/LEAVE"){
            setFormForJoinLeave(eventId);
        }
        else {
            setFormForEditDelete(eventId);
        }
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
                '<label class="form-label" for="form6Example4">Number of participants:</label>' +
                '<input type="text" id="participants" name="participants" class="form-control" required/>' +
            '</div>' +
            '<div class="form-outline mb-4">' +
                '<label class="form-label" for="form6Example5">Time:</label>' +
                '<input type="datetime-local" id="time" name="time" class="form-control" required/>' +
            '</div>' +
            '<div class="col-12">' +
                '<label class="visually-hidden" for="inlineFormSelectPref">Description:</label>' +
                '<textarea id="description" name="description" style="min-width:300px;min-height:100px"></textarea>' +
            '</div>' +
            '<div class="col-12">' +
                '<label class="visually-hidden" for="inlineFormSelectPref">Police instructions:</label>' +
                '<textarea id="government" name="government" style="min-width:300px;min-height:100px" readonly>can be edit only by police</textarea>' +
            '</div>' +
            '<div class="form-outline mb-4">' +
                '<label class="form-label" for="form6Example4">Status:</label>' +
                '<input type="text" id="status" name="status" class="form-control" readonly/>' +
            '</div>' +
            '<div id="buttonPlace">' +
            '</div>' +
        '</form>';
    $('#mainsectionflex').empty().append(formStructure);
}
async function fillForm(eventId) {      //fill form with event information
    const res_Check_If_Event_Exists = await fetch(`${host}/api/event/${eventId}`, {
        method: "GET",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            "Access-Control-Allow-Methods": "*",
            "Authorization": `Bearer ${token}`,
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
        if (stateOfPage=="DELETE/EDIT"){
            if (event_Resjson.creator!=creatorId){
                alert("access denied you are not the creator of this event");
                window.location.href = 'home.html';
            }
        }
        const time = new Date(event_Resjson.time);
        var month = time.getMonth()+1;
        if (month < 10) {
            month = "0" + month;
        }
        var date = time.getDate();
        if (date < 10) {
            date = "0" + date;
        }
        var hours = time.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }
        var minutes = time.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        const timeString = "" + time.getFullYear() + "-" + month + "-" + date + "T" + hours + ":" + minutes;
        document.getElementById("name").value = event_Resjson.name;
        document.getElementById("location").value = event_Resjson.location;
        document.getElementById("time").value = timeString;
        document.getElementById("participants").value = event_Resjson.numberofparticipants;
        document.getElementById("description").value = event_Resjson.description;
        document.getElementById("government").value = event_Resjson.government;
        document.getElementById("status").value = event_Resjson.status;
        document.getElementById("buttonPlace").innerHTML = '';
        setMap(event_Resjson.location);
    }
}
async function lockForm(){   //lock form information
    if (userType=="GOVERNMENT"){
        document.getElementById("name").readonly = true;
        document.getElementById("location").readonly = true;
        document.getElementById("time").readonly = true;
        document.getElementById("participants").readonly = true;
        document.getElementById("description").readonly = true;
        document.getElementById("government").readonly = false;
    }
    else if (stateOfPage=="JOIN/LEAVE"){
        document.getElementById("name").readonly = true;
        document.getElementById("location").readonly = true;
        document.getElementById("time").readonly = true;
        document.getElementById("participants").readonly = true;
        document.getElementById("description").readonly = true;
        document.getElementById("government").readonly = true;
    }
    else{
        document.getElementById("name").readonly = false;
        document.getElementById("location").readonly = false;
        document.getElementById("time").readonly = false;
        document.getElementById("participants").readonly = false;
        document.getElementById("description").readonly = false;
        document.getElementById("government").readonly = true;
    }
}
// event add buttons
async function setFormForAdd() {
    document.getElementById("buttonPlace").innerHTML = '';
    var submitButton = document.createElement('button');
    submitButton.type = "submit";
    submitButton.className = "btn btn-primary btn-block mb-4";
    submitButton.id = "submitButton";
    submitButton.innerHTML = "Add";
    document.getElementById("buttonPlace").append(submitButton);
    submitForm();
}
// event join/leave buttons
async function setFormForJoinLeave(eventId) {
    const bodyvalue = {
        eventId: eventId,
        userId: creatorId,
    }
    const stringBody = JSON.stringify(bodyvalue);
    const res = await fetch(`${host}/api/connection/find/`, {
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            "Access-Control-Allow-Methods": "*",
            "Authorization": `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: stringBody
    })
    const resjson = await res.json();
    if (res.status != 200) {
        alert("server error")
        window.location.href = `home.html`;
        return false;
    }
    var Button = document.createElement('button');
    Button.className = "btn btn-primary btn-block mb-4";
    var method_Of_Operation = '';
    if (resjson.answer==1){
        Button.id = "leaveButton";
        Button.innerHTML = "Leave";
        method_Of_Operation= "DELETE";
    } else {
        Button.id = "joinButton";
        Button.innerHTML = "Join";
        method_Of_Operation= "POST";
    }
    document.getElementById("buttonPlace").append(Button);
    Button.addEventListener("click", async function () {
        const res = await fetch(`${host}/api/connection/`, {
            method: method_Of_Operation,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                "Access-Control-Allow-Methods": "*",
                "Authorization": `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringBody
        });
        console.log (`status is: ${res.status}`);
        alert("hello");
        if (res.status == 200) {
            if (method_Of_Operation=="DELETE"){
                alert ("leave event");
                window.location.href = "home.html";
                return;
            }
            else{
                alert ("join event");
                window.location.href = "home.html";
                return;
            }
        }
        alert ("server error");
        window.location.href = "home.html";
    });
    return;
}
// event edit/delete buttons
async function setFormForEditDelete(eventId) {
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
    document.getElementById("buttonPlace").append(submitButton);
    document.getElementById("buttonPlace").append(deleteButton);
    submitForm(eventId);
    deleteItem(eventId);
}
//if press on delete event
async function deleteItem(eventId) {
    var deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", async function () {
        const res = await fetch(`${host}/api/event/${eventId}`, {
            method: "DELETE",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                "Access-Control-Allow-Methods": "*",
                "Authorization": `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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
            location: formObj.elements["location"].value,
            time: formObj.elements["time"].value,
            description: formObj.elements["description"].value,
            government: formObj.elements["government"].value,
            numberofparticipants: formObj.elements["participants"].value,
            status: "waiting for approval",
            creator: creatorId
        }
        const stringBody = JSON.stringify(formvalue);
        const host_To_Send = (stateOfPage == "ADD") ? `${host}/api/event` : `${host}/api/event/${eventId}`;
        const method_Of_Operation = (stateOfPage == "ADD") ? "POST" : "PUT";
        const res = await fetch(host_To_Send, {
            method: method_Of_Operation,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                "Access-Control-Allow-Methods": "*",
                "Authorization": `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringBody
        })
        const resjson = await res.json();
        if (res.status == 200) {
            window.location.href = `home.html`;
            return true;
        }
        alert(resjson.msg);
        return false;
    });
}


