document.getElementById("get-results").addEventListener("click", postProgress);

function postProgress() {
    console.log('Sunt in post Progress');
    const resp = document.getElementById("get-results").value;
    console.log(resp);
    if (validateResult(resp)) {
        let user = {};
        user.name = 'Diana';
        user.surname = 'T';

        let response = await fetch('./progress.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        let result = await response.json();
        alert(result.message);
    }
}

function validateResult(userResponse) {
    if (userResponse.value == "") {
        changeHTML1("*You didn't enter an answer.\n");
        return false;
    }
    return true;
}