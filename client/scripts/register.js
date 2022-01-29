//DEFINES
// const host = "https://ievent-shenkar.herokuapp.com"; //Noam
// const host = "https://ievent-server.herokuapp.com"; //MISHA
const host = "http://127.0.0.1:8080"; //LOCAL

//PAGE LOADER SELECTOR
$(document).ready(function () {
    const button = document.getElementById('submitButton');
    const notes = document.getElementById('notes');
    prepareSubmit();
});
//PREPARE SUBMIT BUTTON
async function prepareSubmit(){
    const formObj = document.getElementById("userForm");
    formObj.addEventListener("submit", async function (user) {
        // stop form submission
        user.preventDefault();
        // validate the form
        const emailValid = formObj.elements["email"].value;
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!(mailformat.test(emailValid))) {
            alert("You have entered an invalid email!");
            return false;
        }
        const nameValid = formObj.elements["userName"].value;
        if (!(/^[A-Za-z\s]+$/.test(nameValid))) {
            alert("You have entered an invalid name! you can use only chars");
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
        const phoneValid = formObj.elements["phone"].value;
        if (!(/^05\d([-]{0,1})\d{7}$/.test(phoneValid))) {
            alert("You have entered an invalid phone number");
            return false;
        }
        if (phoneValid.length!=10) {
            alert("Phone has to be 10 numbers");
            return false;
        }
        var typeValid="USER";
        if (formObj.elements["type"].checked == true)
            typeValid="GOVERNMENT";
        const formvalue = {
            email: emailValid,
            name: nameValid,
            password: passValid,
            phone:phoneValid,
            type:typeValid
        }
        const stringBody = JSON.stringify(formvalue);
        const host_To_Send = `${host}/api/user/register`;
        const res = await fetch(host_To_Send, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringBody
        })
        if (res.status == 200) {
            alert(`user as been created back to LOGIN`);
            window.location.href = "index.html";
            return true;
        }
        const resjson = await res.json();
        alert(resjson.msg);
        return false;
    });
}