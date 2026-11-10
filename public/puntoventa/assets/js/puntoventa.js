document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MENÚ MÓVIL
    // ==========================================================================
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        const setOpen = (open) => {
            navMenu.classList.toggle('active', open);
            menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        };
        menuBtn.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setOpen(false)));
    }

    // ==========================================================================
    // 2. GALERÍA CON AUTO-SCROLL INFINITO
    // ==========================================================================
    const galleryWrapper = document.getElementById('gallery-wrapper');
    const galleryTrack = document.getElementById('gallery-track');

    if (galleryWrapper && galleryTrack) {
        Array.from(galleryTrack.children).forEach(card => galleryTrack.appendChild(card.cloneNode(true)));

        let scrollPosition = 0;
        let isPaused = false;
        const scrollSpeed = 0.85;

        const autoScroll = () => {
            if (!isPaused) {
                scrollPosition += scrollSpeed;
                if (scrollPosition >= galleryTrack.scrollWidth / 2) scrollPosition = 0;
                galleryTrack.style.transform = `translateX(-${scrollPosition}px)`;
            }
            requestAnimationFrame(autoScroll);
        };

        galleryWrapper.addEventListener('mouseenter', () => isPaused = true);
        galleryWrapper.addEventListener('mouseleave', () => isPaused = false);
        galleryWrapper.addEventListener('touchstart', () => isPaused = true, { passive: true });
        galleryWrapper.addEventListener('touchend', () => isPaused = false);

        requestAnimationFrame(autoScroll);
    }

    // ==========================================================================
    // 3. LIGHTBOX
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const totalPhotos = window.PV_TOTAL_FOTOS || 1;
    let current = 1;

    const showPhoto = (index) => {
        current = index;
        lightboxImg.src = `assets/img/${current}.jpeg`;
        lightboxCounter.textContent = `${current} / ${totalPhotos}`;
    };

    if (galleryTrack && lightbox) {
        galleryTrack.addEventListener('click', (e) => {
            const card = e.target.closest('.gallery-card');
            if (!card) return;
            showPhoto(parseInt(card.dataset.index, 10));
            lightbox.classList.add('active');
        });

        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPhoto(current <= 1 ? totalPhotos : current - 1);
        });
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showPhoto(current >= totalPhotos ? 1 : current + 1);
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') lightbox.classList.remove('active');
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        });
    }
});
