document.getElementById("comment-exercise").addEventListener("click", getComments);
document.getElementById("btnComment").addEventListener("click", getComments);


function getComments() {
    document.getElementById("comment-section").style.display = "block";

    var id_exercise = sessionStorage.getItem("exerciseId");
    console.log('Id_exercise din [getComments] ' + id_exercise);
    var displayed = 0;
    const requestData = `id_exercise=${id_exercise}`;
    var xhttp;
    console.log(requestData);

    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.response);
            var obj = JSON.parse(this.responseText)
            if (obj.length > 0) {
                removeChildren();
                for (i = 0; i < obj.length; i++) {
                    console.log(obj[i].username);
                    console.log(obj[i].comment);
                    modifyHTML(obj[i].username, obj[i].comment);
                }
            }
        } else {
            console.log('Eroare [Get Comment]');
        }
    };

    xhttp.open("POST", "./getComments.js", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(requestData);

}

function modifyHTML(owner, comentariu) {
    var elem = document.createElement('div')
    var heading = document.createElement('span')
    var comment = document.createElement('p')
    var comm_text = document.createTextNode(comentariu)
    var node = document.createTextNode('@' + owner + ': ')
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