
function postCommentFunction() {

    var email = sessionStorage.getItem("loggedUserEmail");
    var id_exercise = sessionStorage.getItem("exerciseId");
    var comment = document.getElementById("comment");

   if(validateComment(comment)) {

        var displayed = 0;
        const requestData = `email=${email}&id_exercise=${id_exercise}&comment=${comment.value}`;
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
        xhttp.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);

                console.log(response);

           } else {
                console.log(response);
                console.log('eroare de aia mare');
            }
        };

        xhttp.open("POST", "./comment.js", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(requestData);
    }
}

function validateComment(comment) {
    if (comment.value == "") {
        alert("You didn't enter a comment!");
        return false;
    }
    return true;
}