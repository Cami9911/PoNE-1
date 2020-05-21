document.getElementById("sign-out-link").addEventListener("click", logOut);

function logOut() {
    sessionStorage.removeItem("loggedUserUsername");
    location.assign("login");
}