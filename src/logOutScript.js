document.getElementById("sign-out-link").addEventListener("click", logOut);

function logOut() {
    localStorage.setItem("loggedUserEmail", null);
    location.assign("login");
}