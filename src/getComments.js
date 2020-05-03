function getComments() {

    var id_exercise = sessionStorage.getItem("exerciseId");

    var displayed = 0;
    const requestData = `id_exercise=${id_exercise}`;
    var xhttp;
    console.log(requestData);

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            // console.log(xhttp.response);
            var obj = JSON.parse(this.responseText)

            for (i = 0; i < obj.length; i++) {
                console.log(obj[i].email);
                console.log(obj[i].comment);
                document.getElementById('h1').innerHTML = obj[i].email;
                break;
            }
        } else {
            console.log('Eroare [Get Comment]');
        }
    };

    xhttp.open("POST", "./getComments.js", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(requestData);

}

window.onload = getComments();