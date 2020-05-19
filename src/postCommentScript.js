document.getElementById("btnComment").addEventListener("click", postCommentFunction);

const form = document.getElementById("form");
form.addEventListener('submit', postCommentFunction);

function postCommentFunction(event) {

    event.preventDefault();

    var username = sessionStorage.getItem("loggedUserUsername");
    var id_exercise = sessionStorage.getItem("exerciseId");
    var comment = document.getElementById("comment");

    if (validateComment(comment)) {
        removeChildrenError1();

        var displayed = 0;
        const requestData = `username=${username}&id_exercise=${id_exercise}&comment=${comment.value}`;
        var xhttp;
        console.log(requestData);

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.variabilaNefolositaDeNimeni = comment.value;
        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);

                console.log(response);

            } else {
                console.log(response);
                console.log('Eroare [Post Comment]');
            }
        };

        xhttp.open("POST", "./comment.js", true);
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

function removeChildrenError1() {
    const myNode = document.getElementById('error')
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}

function changeHTML(message) {
    removeChildrenError1();
    modify(message);
}

function validateComment(comment) {
    if (comment.value == "") {
        changeHTML("*You didn't enter a comment.\n");
        return false;
    }
    return true;
}

