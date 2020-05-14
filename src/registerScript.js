document.getElementById("submit-button").addEventListener("click", registerFunction);

const form = document.getElementById("form");
form.addEventListener('submit', registerFunction);

function registerFunction(event) {
    event.preventDefault();
    var name = document.getElementById("username");
    var password = document.getElementById("password");

    if (validateUsername(name) && validatePassword(password)) {
        var displayed = 0;
        const requestData = `name=${name.value}&password=${password.value}`;
        console.log(requestData);
        var xhttp;

        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
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
                    console.log('Failure');
                    changeHTML('*There is already an account registered with this username');
                }
            }
        };

        xhttp.open("POST", "./register.js", true);
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

function validatePassword(password) {
    if (password.value == "") {
        changeHTML("*You didn't enter a password.\n");
        return false;
    }
    console.log
    if (password.value.length < 8) {
        changeHTML("*The password must have at least 8 characters.");
        return false;
    }
    return true;
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