let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const threshold = 100; // Ajusta este valor según prefieras

window.addEventListener('scroll', function () {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > threshold) {
        // Scroll hacia abajo
        navbar.classList.add('navbar--hidden');
    } else {
        // Scroll hacia arriba
        navbar.classList.remove('navbar--hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);