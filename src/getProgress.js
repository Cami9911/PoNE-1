window.onload = getProgress();

function getProgress() {
    fetch('./getProgress.js', {
            method: 'post',
            // body: `username=${sessionStorage.getItem("loggedUserUsername")}`,
            body: `username=Diana`,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(function(resp) {
            return resp.json();
        }).then(function(jsonResp) {
            console.log(jsonResp.message);
            sessionStorage.setItem("progress", JSON.stringify(jsonResp.data));
            sessionStorage.setItem("currentIndex", 0);
            appendFirstElements();
        })
        .catch(function() {
            console.log(err);
        })
}

const previous = document.getElementById("previous").addEventListener("click", moveBack);
const next = document.getElementById("next").addEventListener("click", moveForward);


function appendFirstElements() {
    const next = document.getElementById("previous").classList.add("disabled");
    const elem = document.getElementById("requirement");
    const commArray = JSON.parse(sessionStorage.getItem("progress"));
    sessionStorage.setItem("currentExerciseId", commArray[0].id_exercise);
    elem.textContent = commArray[0].exercise;
    let newSpan;
    if (commArray[0].comments.length != 0) {
        removeDescendents();
        for (i = 0; i < commArray[0].comments.length; i++) {
            const wrapper = document.getElementById("comments-area");
            newSpan = document.createElement("span");
            newSpan.textContent = "User: " + commArray[0].comments[i].username + ":  " + commArray[0].comments[i].comment;
            wrapper.appendChild(newSpan);
        }
    }
}

function moveForward() {
    /*iau datele din sessionStorage */
    const previous = document.getElementById("previous").classList.remove("disabled");
    /*iau datele din sessionStorage */
    const commArray = JSON.parse(sessionStorage.getItem("progress"));
    const currentIndex = parseInt(sessionStorage.getItem("currentIndex")) + 1;
    /*appenduiesc cerinta exercitiului */
    appendExercise(commArray[currentIndex].exercise);
    /*setez id-ul exercitiului current pentru a putea adauga comentarii mai tarziu*/
    sessionStorage.setItem("currentExerciseId", JSON.stringify(commArray[currentIndex].id_exercise));
    /*sterg descendentii elementului unde voi appendui noile elem */
    removeDescendents();
    if (currentIndex == commArray.length - 1) {
        const next = document.getElementById("next").classList.add("disabled");
    }
    if (commArray[currentIndex].comments.length == 0) {
        appendMessage();
    } else {
        appendComments(commArray, currentIndex);
    }
    sessionStorage.setItem("currentIndex", currentIndex);
}

function moveBack() {
    /*iau datele din sessionStorage */
    const commArray = JSON.parse(sessionStorage.getItem("progress"));
    const currentIndex = parseInt(sessionStorage.getItem("currentIndex")) - 1;
    if (currentIndex == 0) {
        const next = document.getElementById("previous").classList.add("disabled");
    }
    /*appenduiesc cerinta exercitiului */
    appendExercise(commArray[currentIndex].exercise);
    /*setez id-ul exercitiului current pentru a putea adauga comentarii mai tarziu*/
    sessionStorage.setItem("currentExerciseId", JSON.stringify(commArray[currentIndex].id_exercise));
    /*sterg descendentii elementului unde voi appendui noile elem */
    removeDescendents();

    if (commArray[currentIndex].comments.length == 0) {
        appendMessage();
    } else {
        appendComments(commArray, currentIndex);
    }
    sessionStorage.setItem("currentIndex", currentIndex);
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

function appendComments(commArray, currentIndex) {
    const wrapper = document.getElementById("comments-area");
    for (i = 0; i < commArray[currentIndex].comments.length; i++) {
        newDiv = document.createElement("div");
        newSpan = document.createElement("span");
        newSpan.textContent = commArray[currentIndex].comments[i].username + ":    " + commArray[currentIndex].comments[i].comment;
        newDiv.appendChild(newSpan);
        wrapper.appendChild(newDiv);
    }
}

function removeDescendents() {
    const myNode = document.getElementById("comments-area")
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}