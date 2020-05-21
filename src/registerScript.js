document.getElementById("submit-button").addEventListener("click", registerFunction);

const form = document.getElementById("form");
form.addEventListener('submit', registerFunction);

function registerFunction(event) {
    event.preventDefault();
    let name = document.getElementById("username");
    let password = document.getElementById("password");
    console.log(name.value + " " + password.value);
    const form = document.getElementById("form");
    if (validateUsername(name) && validatePassword(password)) {
        fetch("./register.js", {
                method: 'post',
                body: `name=${name.value}&password=${password.value}`,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            }).then(function(resp) {
                return resp.json();
            }).then(function(jsonResp) {
                if (jsonResp.status === 'Success') {
                    sessionStorage.setItem("loggedUserUsername", jsonResp.username);
                    form.reset();
                    location.assign("main");
                } else {
                    console.log('Failure');
                    changeHTML('*There is already an account registered with this username');
                }
            })
            .catch(function() {
                console.log(err);
            })
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