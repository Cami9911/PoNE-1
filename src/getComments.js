document.getElementById("comment-exercise").addEventListener("click", getComments);
document.getElementById("btnComment").addEventListener("click", getComments);

function getComments() {
    removeChildren();
    document.getElementById("comment-section").style.display = "block";
    var id_exercise = sessionStorage.getItem("exerciseId");
    fetch("./getComments.js", {
            method: 'post',
            body: `id_exercise=${id_exercise}`,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(function(resp) {
            return resp.json();
        }).then(function(jsonResp) {
            if (jsonResp.comments.length == 0) {
                printNoComm();
            }
            for (i = 0; i < jsonResp.comments.length; i++) {
                modifyHTML(jsonResp.comments[i].username, jsonResp.comments[i].comment);
            }

        })
        .catch(function() {
            console.log(err);
        })
}


function modifyHTML(owner, comentariu) {
    const elem = document.createElement('div')
    const heading = document.createElement('span')
    const comment = document.createElement('p')
    const comm_text = document.createTextNode(comentariu)
    const node = document.createTextNode(owner + ': ')
    heading.appendChild(node);
    comment.appendChild(heading);
    comment.appendChild(comm_text);
    elem.appendChild(comment);
    elem.classList.add("comm");
    var original = document.getElementById('comment-section')
    original.append(elem);
}

function removeChildren() {
    const myNode = document.getElementById('comment-section')
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild)
    }
}

function printNoComm() {
    const elem = document.getElementById('comment-section');
    const message = document.createElement('p');
    message.textContent = "There are no comments yet...";
    elem.appendChild(message);

}