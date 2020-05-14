window.onload = check_admin();

function check_admin() {
    if (sessionStorage.getItem("loggedUserUsername") !== "admin") {
        location.assign("unknown")
    }
   
}