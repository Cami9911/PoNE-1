document.getElementById("submit-button").addEventListener("click", loginFunction);

const form = document.getElementById("form");
form.addEventListener('submit', loginFunction);

function loginFunction(event) {
    event.preventDefault();
    let name = document.getElementById("username");
    let password = document.getElementById("password");
    if (validateUsername(name) && validatePassword(password)) {
        fetch("./login.js", {
                method: 'post',
                body: `name=${name.value}&password=${password.value}`,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            }).then(function(resp) {
                return resp.json();
            }).then(function(jsonResp) {
                if (jsonResp.status === "Succes") {
                    sessionStorage.setItem("loggedUserUsername", name.value);
                    location.assign("main");
                } else {
                    if (jsonResp.message === "SQL server error") {
                        location.assign("404.html");
                    } else if (jsonResp.message === "Password Incorrect") {
                        removeChildrenError();
                        modify('*Incorrect Password');
                    } else {
                        removeChildrenError();
                        modify('*There is no user registered with this email.');
                    }
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

function validateUsername(username) {
    if (username.value == "") {
        changeHTML("*You didn't enter an username.\n");
        return false;
    }
    return true;
}

function validatePassword(pw) {
    if (pw.value == "") {
        changeHTML("*You didn't enter a password.\n");
        return false;
    }
    return true;
}