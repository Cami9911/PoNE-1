window.onload = getProgress();

function getProgress() {
    fetch('./getProgress.js', {
            method: 'post',
            body: `username=${sessionStorage.getItem("loggedUserUsername")}`,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(function(resp) {
            return resp.json();
        }).then(function(jsonResp) {
            const faker = [];
            if (jsonResp.data.length == 0) {
                cleanPage();
                sessionStorage.setItem("progress", JSON.stringify(faker));
            } else {
                sessionStorage.setItem("progress", JSON.stringify(jsonResp.data));
                appendFirstElements();
            }
        })
        .catch(function(err) {
            console.log(err);
        })
}

const previous = document.getElementById("previous").addEventListener("click", moveBack);
const next = document.getElementById("next").addEventListener("click", moveForward);


function appendFirstElements() {
    const next = document.getElementById("previous").classList.add("disabled");
    const commArray = JSON.parse(sessionStorage.getItem("progress"));
    sessionStorage.setItem("currentExerciseId", commArray[0].id_exercise);
    appendExercise(commArray[0].exercise);
    getProgressComments();
    sessionStorage.setItem("currentIndex", 0);
}

function moveForward() {
    const commArray = JSON.parse(sessionStorage.getItem("progress"));
    const currentIndex = parseInt(sessionStorage.getItem("currentIndex")) + 1
    if (commArray.length > 0) {
        const previous = document.getElementById("previous").classList.remove("disabled");
        if (currentIndex == commArray.length - 1) {
            const next = document.getElementById("next").classList.add("disabled");
        }
        if (currentIndex < commArray.length) {
            appendExercise(commArray[currentIndex].exercise);
            sessionStorage.setItem("currentExerciseId", JSON.stringify(commArray[currentIndex].id_exercise));
            getProgressComments();
            sessionStorage.setItem("currentIndex", currentIndex);
        }
    }
}

function moveBack() {
    const commArray = JSON.parse(sessionStorage.getItem("progress"));
    const currentIndex = parseInt(sessionStorage.getItem("currentIndex")) - 1;
    if (commArray.length > 0) {
        if (currentIndex == 0) {
            const previous = document.getElementById("previous").classList.add("disabled");
        }
        if (currentIndex >= 0) {
            const next = document.getElementById("next").classList.remove("disabled");
            appendExercise(commArray[currentIndex].exercise);
            sessionStorage.setItem("currentExerciseId", JSON.stringify(commArray[currentIndex].id_exercise));
            getProgressComments();
            sessionStorage.setItem("currentIndex", currentIndex);
        }
    }
}

function appendExercise(exercise) {
    const elem = document.getElementById("requirement");
    elem.textContent = exercise;
}

function appendMessage() {
    const wrapper = document.getElementById("comments-area");
    newParagraph = document.createElement("p");
    newParagraph.textContent = "There are no comments yet...";
    wrapper.appendChild(newParagraph);
}

function removeDescendents() {
    const myNode = document.getElementById("comments-area")
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}

function cleanPage() {
    const next = document.getElementById("next").classList.add("disabled");
    const previous = document.getElementById("previous").classList.add("disabled");
    const elem = document.getElementById("put-comment-area").classList.add("disable-put-comment");
}

/*POST comment */
document.getElementById("btnComment").addEventListener("click", postCommentProgress);

const form = document.getElementById("form");
form.addEventListener("submit", postCommentProgress);

function postCommentProgress() {
    const username = sessionStorage.getItem("loggedUserUsername");
    const id_exercise = sessionStorage.getItem("currentExerciseId");
    console.log("Id-ul exercitiului" + id_exercise);
    const comment = document.getElementById("input-comment");
    if (validateComm(comment)) {
        fetch('./comment.js', {
                method: 'post',
                body: `username=${username}&id_exercise=${id_exercise}&comment=${comment.value}`,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            }).then(function(resp) {
                return resp.json();
            }).then(function(jsonResp) {
                console.log(jsonResp.message);
                getProgressComments();
            })
            .catch(function() {
                console.log(err);
            })
    }
}


function validateComm(comment) {
    if (comment.value == "") {
        return false;
    }
    return true;
}

/*Get Comments For Exercise */

function getProgressComments() {
    const id_exercise = sessionStorage.getItem("currentExerciseId");
    const comment = document.getElementById("input-comment");
    fetch("./getComments.js", {
            method: 'post',
            body: `id_exercise=${id_exercise}`,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(function(resp) {
            return resp.json();
        }).then(function(jsonResp) {
            if (jsonResp.comments.length > 0) {
                removeDescendents();
                for (i = 0; i < jsonResp.comments.length; i++) {
                    modifyCommArea(jsonResp.comments[i].username, jsonResp.comments[i].comment);
                }
            } else {
                removeDescendents();
                appendMessage();
            }
        })
        .catch(function(err) {
            console.log(err);
        })
}

function modifyCommArea(username, comment) {
    const wrapper = document.getElementById("comments-area");
    newDiv = document.createElement("div");
    newParagraph = document.createElement("p");
    bold = document.createElement("b");
    bold.textContent = username + ": ";
    node = document.createTextNode(comment);
    newParagraph.appendChild(bold);
    newParagraph.appendChild(node);
    newDiv.appendChild(newParagraph);
    wrapper.appendChild(newDiv);
}