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
            console.log(jsonResp);
        })
        .catch(function() {
            console.log(err);
        })
}