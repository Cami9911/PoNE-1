const navSlide = () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('.link-list');

    burgerMenu.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burgerMenu.classList.toggle('burger-active');
    });
}

navSlide();