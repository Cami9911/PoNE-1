window.onload = check_user();

function check_user() {
    if (sessionStorage.getItem("loggedUserUsername") === null) {
        location.assign("login");
    }
}