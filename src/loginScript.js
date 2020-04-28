"use strict"


function loginFunction() {

    var email = document.getElementById("email");
    var password = document.getElementById("password");

    var displayed = 0;
    const requestData = `name=${name.value}&email=${email.value}&password=${password.value}`;
    var xhttp;

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xhttp.variabilaNefolositaDeNimeni = email.value;
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);

            if (response.message === "SUCCEEDED") {
                sessionStorage.setItem("loggedUserEmail", xhttp.variabilaNefolositaDeNimeni);
                location.assign("main-page.html");
            } else {
                location.assign("failure");
            }
        }
    };

    xhttp.open("POST", "./login.js", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(requestData);

}
