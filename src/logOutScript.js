document.getElementById("sign-out-link").addEventListener("click", logOut);

function logOut() {
    localStorage.removeItem("loggedUserEmail");
    location.assign("login");
}