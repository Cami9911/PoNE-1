document.getElementById("generate-exercise").addEventListener("click", generateExercise);

function generateExercise() {

    document.getElementById('comment-section').style.display = "none";

    document.getElementById("divMessage").innerHTML = "";
    document.getElementById("divResponse").innerHTML = "";
    const input=document.getElementById("form1");

    fetch("./exercise.js",{
        method:'post',
        
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(function(resp) {
            return resp.json();
        }).then(function(jsonResp) {
            console.log(jsonResp);

            sessionStorage.setItem("exerciseId", jsonResp.id);
            console.log(sessionStorage.getItem("exerciseId"));

            var result = jsonResp.exercise;

            sessionStorage.setItem("resEx", result);
            // console.log(sessionStorage.getItem("resEx"));

            document.getElementById("exRequirement").innerHTML = result;
            input.reset();

        })
        .catch(function() {
            console.log(err);
        })


}