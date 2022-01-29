//DEFINES
// const host = "https://ievent-shenkar.herokuapp.com"; //Noam
// const host = "https://ievent-server.herokuapp.com"; //MISHA
const host = "http://127.0.0.1:8080"; //LOCAL
//GLOBAL VARIABLE
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
//PAGE LOADER SELECTOR
$(document).ready(function () {
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
    const button = document.getElementById('submitButton');
    const notes = document.getElementById('notes');
    button.innerHTML = "login"
    notes.innerHTML = '<a href="register.html">Sign up</a>';
    prepareSubmit();
});
//PREPARE SUBMIT BUTTON
async function prepareSubmit() {
    const formObj = document.getElementById("userForm");
    formObj.addEventListener("submit", async function (user) {
        // stop form submission
        user.preventDefault();
        // validate the form
        const emailValid = formObj.elements["email"].value;
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!(mailformat.test(emailValid))) {
            alert("You have entered an invalid email! you can use only chars and numbers");
            return false;
        }
        const passValid = formObj.elements["password"].value;
        if (!(/^[A-Za-z0-9\s]+$/.test(passValid))) {
            alert("You have entered an invalid password! you can use only chars and numbers");
            return false;
        }
        if (passValid.length < 4) {
            alert("password too short use at list 4 chars");
            return false;
        }
        const formvalue = {
            email: emailValid,
            password: passValid,
        }
        const stringBody = JSON.stringify(formvalue);
        const host_To_Send = `${host}/api/user/login`;
        const res = await fetch(host_To_Send, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringBody
        })
        const resjson = await res.json();
        if (resjson.status == 200) {
            console.log(resjson.name);
            sessionStorage.setItem("jwt", resjson.token);
            sessionStorage.setItem("name", resjson.name);
            sessionStorage.setItem("userType", resjson.type);
            sessionStorage.setItem("id", resjson.id);
            sessionStorage.setItem("mapLocation", "shenkar%20college");
            window.location.href = `home.html`;
            return true;
        }
        alert(resjson.msg);
        return false;
    });
}