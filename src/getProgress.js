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
            for (i = 0; i < jsonResp.data.length; i++) {
                console.log("Element al vectorului " + jsonResp.data[i].id_exercise + " " + jsonResp.data[i].exercise);
            }
        })
        .catch(function() {
            console.log(err);
        })
}