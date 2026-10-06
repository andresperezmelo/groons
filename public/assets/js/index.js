document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MENÚ MÓVIL
    // ==========================================================================
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // ==========================================================================
    // 2. AUTO-SCROLL DE LA GALERÍA (17 CAPTURAS)
    // ==========================================================================
    const galleryWrapper = document.getElementById('gallery-wrapper');
    const galleryTrack = document.getElementById('gallery-track');

    if (galleryWrapper && galleryTrack) {
        // Duplicamos las tarjetas para lograr un bucle infinito continuo
        const originalCards = Array.from(galleryTrack.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            galleryTrack.appendChild(clone);
        });

        let scrollPosition = 0;
        let isPaused = false;
        const scrollSpeed = 0.85; // Velocidad suave

        function autoScroll() {
            if (!isPaused) {
                scrollPosition += scrollSpeed;
                // Si llegamos a la mitad (donde inician los clones), reiniciamos
                if (scrollPosition >= galleryTrack.scrollWidth / 2) {
                    scrollPosition = 0;
                }
                galleryTrack.style.transform = `translateX(-${scrollPosition}px)`;
            }
            requestAnimationFrame(autoScroll);
        }

        // Pausa al posar el cursor o tocar en móviles
        galleryWrapper.addEventListener('mouseenter', () => isPaused = true);
        galleryWrapper.addEventListener('mouseleave', () => isPaused = false);
        galleryWrapper.addEventListener('touchstart', () => isPaused = true, { passive: true });
        galleryWrapper.addEventListener('touchend', () => isPaused = false);

        requestAnimationFrame(autoScroll);
    }

    // ==========================================================================
    // 3. LIGHTBOX MODAL
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentPhotoIndex = 1;
    const totalPhotos = 17;

    const showPhoto = (index) => {
        currentPhotoIndex = index;
        lightboxImg.src = `assets/img/prestabit/${currentPhotoIndex}.jpeg`;
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentPhotoIndex} / ${totalPhotos}`;
        }
    };

    // Delegación de eventos para tarjetas originales y clonadas
    if (galleryTrack) {
        galleryTrack.addEventListener('click', (e) => {
            const card = e.target.closest('.gallery-card');
            if (card) {
                const idx = parseInt(card.getAttribute('data-index'), 10);
                showPhoto(idx);
                lightbox.classList.add('active');
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPhotoIndex = currentPhotoIndex <= 1 ? totalPhotos : currentPhotoIndex - 1;
            showPhoto(currentPhotoIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPhotoIndex = currentPhotoIndex >= totalPhotos ? 1 : currentPhotoIndex + 1;
            showPhoto(currentPhotoIndex);
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ==========================================================================
    // 4. CALCULADORA INTERACTIVA DE TARIFAS (NUEVAS REGLAS)
    // ==========================================================================
    const planRadios = document.querySelectorAll('input[name="basePlan"]');
    const goldWrapper = document.getElementById('gold-config-wrapper');

    const clientRange = document.getElementById('client-range');
    const clientDisplay = document.getElementById('client-display');

    const addonPortal = document.getElementById('addon-portal');
    const addonBot = document.getElementById('addon-bot');

    const storageMinus = document.getElementById('storage-minus');
    const storagePlus = document.getElementById('storage-plus');
    const storageBlocksSpan = document.getElementById('storage-blocks');
    const storageTotalMbSpan = document.getElementById('storage-total-mb');
    const storagePhotosEstimate = document.getElementById('storage-photos-estimate');

    // Elementos del resumen
    const summaryPlanName = document.getElementById('summary-plan-name');
    const summaryPlanPrice = document.getElementById('summary-plan-price');
    const summaryClientsPrice = document.getElementById('summary-clients-price');
    const summaryPortalPrice = document.getElementById('summary-portal-price');
    const summaryBotPrice = document.getElementById('summary-bot-price');
    const summaryStoragePrice = document.getElementById('summary-storage-price');
    const grandTotalElement = document.getElementById('grand-total');
    const summaryPeriodLabel = document.getElementById('summary-period-label');
    const btnWhatsappQuote = document.getElementById('btn-whatsapp-quote');

    let storageBlocks = 0; // Cada bloque = 100 MB = $2 USD

    // Escala de precios de clientes para Plan Oro (bloques de 100)
    const clientTiers = {
        1: { label: '0 a 100 clientes', price: 3 },
        2: { label: '101 a 200 clientes', price: 6 },
        3: { label: '201 a 300 clientes', price: 9 },
        4: { label: '301 a 400 clientes', price: 12 },
        5: { label: '401 a 500 clientes', price: 15 },
        6: { label: '501 a 600 clientes', price: 18 },
        7: { label: '+601 clientes (Tarifa Plana)', price: 20 }
    };

    // Función auxiliar para seleccionar plan desde los botones de arriba
    window.selectPlanFromCard = function (planName) {
        planRadios.forEach(r => {
            if (r.value === planName) {
                r.checked = true;
                calculateTotal();
            }
        });
    };

    function calculateTotal() {
        let selectedPlan = 'Gratis';
        planRadios.forEach(r => {
            if (r.checked) selectedPlan = r.value;
        });

        // Habilitar o deshabilitar opciones del Plan Oro
        if (selectedPlan === 'Oro') {
            goldWrapper.classList.remove('gold-options-disabled');
        } else {
            goldWrapper.classList.add('gold-options-disabled');
        }

        // Tier de clientes seleccionado
        const tierStep = clientRange.value;
        const currentTier = clientTiers[tierStep];
        clientDisplay.textContent = `${currentTier.label} ($${currentTier.price} USD/mes)`;

        // Cálculo según el tipo de plan
        if (selectedPlan === 'Gratis') {
            summaryPlanName.textContent = 'Gratis';
            summaryPlanPrice.textContent = '$0 USD';
            summaryClientsPrice.textContent = 'Restringido';
            summaryPortalPrice.textContent = 'No disponible';
            summaryBotPrice.textContent = 'No disponible';
            summaryStoragePrice.textContent = 'No disponible';
            summaryPeriodLabel.textContent = 'Total a pagar:';
            grandTotalElement.innerHTML = `$0 <span>USD</span>`;

            const msg = encodeURIComponent('Hola, deseo activar una cuenta con el Plan Gratis en PrestaBIT.');
            btnWhatsappQuote.href = `https://api.whatsapp.com/send/?phone=573504706990&text=${msg}`;
            return;
        }

        if (selectedPlan === 'Bronce') {
            summaryPlanName.textContent = 'Bronce (1 disp. por ruta)';
            summaryPlanPrice.textContent = '$15 USD / año';
            summaryClientsPrice.textContent = 'Incluido (1 dispositivo)';
            summaryPortalPrice.textContent = 'No disponible';
            summaryBotPrice.textContent = 'No disponible';
            summaryStoragePrice.textContent = 'Copias manuales';
            summaryPeriodLabel.textContent = 'Total anual:';
            grandTotalElement.innerHTML = `$15 <span>USD / año</span>`;

            const msg = encodeURIComponent(
                `Hola, deseo contratar el *Plan Bronce* de PrestaBIT por $15 USD al año (1 dispositivo por ruta y copias manuales).`
            );
            btnWhatsappQuote.href = `https://api.whatsapp.com/send/?phone=573504706990&text=${msg}`;
            return;
        }

        // Si es PLAN ORO
        const clientsCost = currentTier.price; // Obligatorio
        const portalCost = addonPortal.checked ? 5 : 0;
        const botCost = addonBot.checked ? 10 : 0;
        const storageCost = storageBlocks * 2; // $2 USD por cada 100 MB

        const monthlyTotal = clientsCost + portalCost + botCost + storageCost;

        summaryPlanName.textContent = 'Plan Oro (Modular)';
        summaryPlanPrice.textContent = 'Base $0 (Por consumo)';
        summaryClientsPrice.textContent = `${currentTier.label} ($${clientsCost} USD)`;
        summaryPortalPrice.textContent = addonPortal.checked ? '+$5 USD / mes' : 'No contratado';
        summaryBotPrice.textContent = addonBot.checked ? '+$10 USD / mes' : 'No contratado';
        summaryStoragePrice.textContent = `${storageBlocks * 100} MB ($${storageCost} USD)`;

        summaryPeriodLabel.textContent = 'Total mensual estimado:';
        grandTotalElement.innerHTML = `$${monthlyTotal} <span>USD / mes</span>`;

        const msg = encodeURIComponent(
            `Hola, deseo contratar el *Plan Oro* de PrestaBIT con la siguiente configuración:\n` +
            `• Clientes: ${currentTier.label} ($${clientsCost} USD/mes)\n` +
            `• Portal Web Clientes: ${addonPortal.checked ? 'Sí (+$5 USD)' : 'No'}\n` +
            `• Bot de WhatsApp: ${addonBot.checked ? 'Sí (+$10 USD)' : 'No'}\n` +
            `• Almacenamiento Fotos: ${storageBlocks * 100} MB ($${storageCost} USD)\n` +
            `*Total estimado mensual: $${monthlyTotal} USD / mes*`
        );
        btnWhatsappQuote.href = `https://api.whatsapp.com/send/?phone=573504706990&text=${msg}`;
    }

    // Actualización de bloques de almacenamiento y cálculo de fotos aproximadas
    function updateStorageUI() {
        storageBlocksSpan.textContent = storageBlocks;
        const totalMb = storageBlocks * 100;
        const cost = storageBlocks * 2;
        storageTotalMbSpan.textContent = `(${totalMb} MB = $${cost} USD)`;

        // Estimación: 1 foto estándar de app suele pesar ~350 KB -> ~280 fotos por cada 100 MB
        const approxPhotos = storageBlocks * 280;
        if (storageBlocks === 0) {
            storagePhotosEstimate.innerHTML = `Capacidad estimada: <strong>0 fotos</strong> (~250 a 300 fotos promedio por cada 100 MB).`;
        } else {
            storagePhotosEstimate.innerHTML = `Capacidad estimada: <strong>~${approxPhotos.toLocaleString()} fotos</strong> (~250 a 300 fotos por cada bloque de 100 MB).`;
        }

        calculateTotal();
    }

    // Event Listeners
    planRadios.forEach(r => r.addEventListener('change', calculateTotal));
    if (clientRange) clientRange.addEventListener('input', calculateTotal);
    if (addonPortal) addonPortal.addEventListener('change', calculateTotal);
    if (addonBot) addonBot.addEventListener('change', calculateTotal);

    if (storagePlus && storageMinus) {
        storagePlus.addEventListener('click', () => {
            storageBlocks++;
            updateStorageUI();
        });

        storageMinus.addEventListener('click', () => {
            if (storageBlocks > 0) {
                storageBlocks--;
                updateStorageUI();
            }
        });
    }

    // Inicialización al cargar la página
    calculateTotal();
});