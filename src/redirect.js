const pencil = document.getElementById("pencil");
const circle = document.getElementById("circle");

pencil.addEventListener("click", redirect);
circle.addEventListener("click", change);

function redirect() {
    location.assign("animation")
}

function change() {
    location.assign("exercise")
}