document.getElementById("generate-exercise").addEventListener("click", generateExercise);

function generateExercise() {

    document.getElementById('comment-section').style.display = "none";

    document.getElementById("divMessage").innerHTML = "";
    document.getElementById("divResponse").innerHTML = "";

    var displayed = 0;
    var xhttp;

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }


    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response);

            xhttp.idExercise = response.id;
            sessionStorage.setItem("exerciseId", xhttp.idExercise);
            console.log(sessionStorage.getItem("exerciseId"));

            var result = response.exercise;

            xhttp.resultEx = result;
            sessionStorage.setItem("resEx", xhttp.resultEx);
            // console.log(sessionStorage.getItem("resEx"));

            document.getElementById("exRequirement").innerHTML = result;

        } else {
            console.log(response);
            console.log('Error in [Exercise Script]');
        }

    };

    xhttp.open("POST", "./exercise.js", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(null);

}