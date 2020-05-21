document.getElementById("btnComment").addEventListener("click", postCommentFunction);

const form = document.getElementById("form");
form.addEventListener('submit', postCommentFunction);

function postCommentFunction() {
    event.preventDefault();
    const username = sessionStorage.getItem("loggedUserUsername");
    const id_exercise = sessionStorage.getItem("exerciseId");
    const comment = document.getElementById("comment");
    const form = document.getElementById("form");
    if (validateComment(comment)) {
        fetch("./comment.js", {
                method: 'post',
                body: `username=${username}&id_exercise=${id_exercise}&comment=${comment.value}`,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            }).then(function(resp) {
                form.reset();
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