document.getElementById("submit-button").addEventListener("click", loginFunction);

function loginFunction() {

    var email = document.getElementById("email");
    var password = document.getElementById("password");

    if (validateMail(email) && validatePassword(password)) {
        var displayed = 0;
        const requestData = `name=${name.value}&email=${email.value}&password=${password.value}`;
        var xhttp;

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.variabilaNefolositaDeNimeni = email.value;
        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);

                if (response.status === "Succes") {
                    sessionStorage.setItem("loggedUserEmail", xhttp.variabilaNefolositaDeNimeni);
                    location.assign("main");
                } else {
                    if (response.message === "SQL server error") {
                        location.assign("404.html");
                    } else if (response.message === "Password Incorrect") {
                        console.log('Incorrect Password');
                        removeChildrenError();
                        modify('*Incorrect Password');
                    } else {
                        console.log('There is no user registered with this email.');
                        removeChildrenError();
                        modify('*There is no user registered with this email.');
                    }
                }
            }
        };

        xhttp.open("POST", "./login.js", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(requestData);
    }
}

function modify(message) {
    var span = document.createElement('span')
    var span_text = document.createTextNode(message)
    span.appendChild(span_text);
    var original = document.getElementById('error')
    original.append(span)
}

function removeChildrenError() {
    const myNode = document.getElementById('error')
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}

function changeHTML(message) {
    removeChildrenError();
    modify(message);
}

function validateMail(email) {
    if (email.value == "") {
        changeHTML("*You didn't enter an email\n");
        return false;
    }

    var myRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var emailValid = myRegex.test(email.value);
    if (emailValid == false) {
        changeHTML("*You have entered an invalid email address");
        return false;
    }
    return true;
}

function validatePassword(pw) {
    if (pw.value == "") {
        changeHTML("*You didn't enter a password.\n");
        return false;
    }
    console.log
    if (pw.value.length < 8) {
        changeHTML("*The password must have at least 8 characters");
        return false;
    }
    return true;
}