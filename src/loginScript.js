document.getElementById("submit-button").addEventListener("click", loginFunction);

function loginFunction() {

    var name = document.getElementById("username");
    var password = document.getElementById("password");

    if (validateUsername(username) && validatePassword(password)) {
        var displayed = 0;
        const requestData = `name=${name.value}&password=${password.value}`;
        var xhttp;

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.variabilaNefolositaDeNimeni = name.value;
        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);

                if (response.status === "Succes") {
                    sessionStorage.setItem("loggedUserUsername", xhttp.variabilaNefolositaDeNimeni);
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

function validateUsername(username) {
    if (username.value == "") {
        changeHTML("*You didn't enter an username.\n");
        return false;
    }
    if (username.value.length < 5 || username.value.length > 30) {
        changeHTML("*Username must have between 5 and 30 characters.");
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