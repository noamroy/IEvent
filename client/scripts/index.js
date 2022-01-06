//DEFINES
const host = "https://ievent-shenkar.herokuapp.com";
//const host = "http://localhost:8080";
//GLOBAL VARIABLE
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
var page = params.page;
if (!page){
    page = "LOGIN";
}
//PAGE LOADER SELECTOR
$(document).ready(function () {
    const button = document.getElementById('submitButton');
    const notes = document.getElementById('notes');
    if (page=="REGISTER") {
        document.title="register";
        button.innerHTML="register"
        notes.innerHTML='<a href="index.html">Already have a user?</a>';
        }
    else {
        document.title="login";
        button.innerHTML="login"
        notes.innerHTML='<a href="index.html?page=REGISTER">Sign up</a>';
    }
    prepareSubmit();
});
//PREPARE SUBMIT BUTTON
async function prepareSubmit(){
    const formObj = document.getElementById("userForm");
    formObj.addEventListener("submit", async function (user) {
        // stop form submission
        user.preventDefault();
        // validate the form
        const nameValid = formObj.elements["userName"].value;
        if (!(/^[A-Za-z0-9\s]+$/.test(nameValid))) {
            alert("You have entered an invalid user name! you can use only chars and numbers");
            return false;
        }
        if (nameValid.length<4) {
            alert("name too short use at list 4 chars");
            return false;
        }
        const passValid = formObj.elements["password"].value;
        if (!(/^[A-Za-z0-9\s]+$/.test(passValid))) {
            alert("You have entered an invalid password! you can use only chars and numbers");
            return false;
        }
        if (passValid.length<4) {
            alert("password too short use at list 4 chars");
            return false;
        }
        const formvalue = {
            name: nameValid,
            password: passValid,
        }
        const stringBody = JSON.stringify(formvalue);
        const host_To_Send = (page == "LOGIN") ? `${host}/api/user/login` : `${host}/api/user/register`;
        const res = await fetch(host_To_Send, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringBody
        })
        const resjson = await res.json();
        if (resjson.status == 200 && page == "REGISTER") {
            alert(`user as been created back to LOGIN`);
            window.location.href = "index.html";
            return true;
        }
        if (resjson.status == 200 && page == "LOGIN"){
            sessionStorage.setItem("jwt", resjson.token)
            window.location.href = `home.html`;
            return true;
        }
        alert(resjson.msg);
        return false;
    });
}