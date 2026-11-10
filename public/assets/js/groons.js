document.addEventListener('DOMContentLoaded', () => {
    const sistemas = window.SISTEMAS_GROONS || [];

    // ----------------------------------------------------------------------
    // Menú móvil
    // ----------------------------------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (menuBtn && navMenu) {
        const setOpen = (open) => {
            navMenu.classList.toggle('active', open);
            menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        };
        menuBtn.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ----------------------------------------------------------------------
    // Utilidades de render
    // ----------------------------------------------------------------------
    const PLATAFORMAS = {
        android: { icono: 'fa-brands fa-android', nombre: 'Android', tienda: 'fa-brands fa-google-play', label: 'Google Play', pre: 'Disponible en' },
        ios: { icono: 'fa-brands fa-apple', nombre: 'iOS', tienda: 'fa-brands fa-apple', label: 'App Store', pre: 'Consíguelo en' },
        web: { icono: 'fa-solid fa-globe', nombre: 'Web', tienda: 'fa-solid fa-globe', label: 'Plataforma Web', pre: 'Acceso online' },
        windows: { icono: 'fa-brands fa-windows', nombre: 'Windows', tienda: 'fa-brands fa-windows', label: 'Windows', pre: 'Descarga para' }
    };

    const ESTADOS = {
        disponible: { texto: 'Disponible', clase: 'status-live', icono: 'fa-solid fa-circle-check' },
        proximamente: { texto: 'Próximamente', clase: 'status-soon', icono: 'fa-solid fa-hourglass-half' },
        desarrollo: { texto: 'En desarrollo', clase: 'status-dev', icono: 'fa-solid fa-code' }
    };

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const statusBadge = (s) => {
        const e = ESTADOS[s.estado] || ESTADOS.proximamente;
        return `<span class="status ${e.clase}"><i class="${e.icono}"></i> ${e.texto}</span>`;
    };

    const platformChips = (s) => (s.plataformas || [])
        .filter(p => PLATAFORMAS[p])
        .map(p => `<span class="platform-chip"><i class="${PLATAFORMAS[p].icono}"></i> ${PLATAFORMAS[p].nombre}</span>`)
        .join('');

    const storeButtons = (s) => (s.plataformas || [])
        .filter(p => PLATAFORMAS[p] && s.enlaces && s.enlaces[p])
        .map(p => {
            const pl = PLATAFORMAS[p];
            return `<a href="${esc(s.enlaces[p])}" target="_blank" rel="noopener" class="btn btn-store${p === 'web' ? ' btn-store-dark' : ''}">
                        <i class="${pl.tienda}"></i>
                        <span class="btn-text"><small>${pl.pre}</small><strong>${pl.label}</strong></span>
                    </a>`;
        }).join('');

    const countdownBlock = (s) => {
        if (!s.lanzamiento) return '';
        const fecha = new Date(s.lanzamiento);
        if (isNaN(fecha)) return '';
        const fechaTxt = fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
        return `<div class="countdown" data-launch="${fecha.toISOString()}">
                    <div class="countdown-label"><i class="fa-regular fa-calendar"></i> Lanzamiento: ${esc(fechaTxt)}</div>
                    <div class="countdown-units">
                        <div><strong data-u="d">--</strong><span>días</span></div>
                        <div><strong data-u="h">--</strong><span>horas</span></div>
                        <div><strong data-u="m">--</strong><span>min</span></div>
                        <div><strong data-u="s">--</strong><span>seg</span></div>
                    </div>
                </div>`;
    };

    // ----------------------------------------------------------------------
    // Sistemas disponibles (tarjeta grande)
    // ----------------------------------------------------------------------
    const disponibles = sistemas.filter(s => s.estado === 'disponible');
    const proximos = sistemas.filter(s => s.estado !== 'disponible');

    const availableEl = document.getElementById('systems-available');
    availableEl.innerHTML = disponibles.map(s => `
        <article class="system-featured" id="sistema-${esc(s.id)}">
            <div class="system-featured-body">
                <div class="system-head">
                    <span class="system-icon"><i class="${esc(s.icono)}"></i></span>
                    <div>
                        <h3>${esc(s.nombre)}</h3>
                        <p class="system-summary">${esc(s.resumen)}</p>
                    </div>
                </div>
                ${statusBadge(s)}
                <p class="system-desc">${esc(s.descripcion)}</p>
                ${s.destacados && s.destacados.length ? `<ul class="system-points">${s.destacados.map(d => `<li><i class="fa-solid fa-check"></i> ${esc(d)}</li>`).join('')}</ul>` : ''}
                <div class="platforms"><span class="platforms-label">Disponible para:</span> ${platformChips(s)}</div>
                <div class="store-buttons">${storeButtons(s)}</div>
                ${s.enlaces && s.enlaces.pagina ? `<a href="${esc(s.enlaces.pagina)}" class="btn btn-primary">Ver ${esc(s.nombre)} <i class="fa-solid fa-arrow-right"></i></a>` : ''}
            </div>
            ${s.imagen ? `
            <div class="system-featured-media">
                <div class="device-mockup"><div class="mockup-screen"><img src="${esc(s.imagen)}" alt="${esc(s.nombre)}" loading="lazy"></div></div>
            </div>` : ''}
        </article>`).join('');

    // ----------------------------------------------------------------------
    // Próximos sistemas (grilla)
    // ----------------------------------------------------------------------
    const upcomingEl = document.getElementById('systems-upcoming');
    document.getElementById('upcoming-title').hidden = proximos.length === 0;
    upcomingEl.innerHTML = proximos.map(s => `
        <article class="system-card" id="sistema-${esc(s.id)}">
            <div class="system-head">
                <span class="system-icon"><i class="${esc(s.icono)}"></i></span>
                <div>
                    <h3>${esc(s.nombre)}</h3>
                    <p class="system-summary">${esc(s.resumen)}</p>
                </div>
            </div>
            ${statusBadge(s)}
            <p class="system-desc">${esc(s.descripcion)}</p>
            ${countdownBlock(s)}
            <div class="platforms">${platformChips(s)}</div>
            <div class="system-card-actions">
                ${s.enlaces && s.enlaces.pagina ? `<a href="${esc(s.enlaces.pagina)}" class="btn btn-outline-dark btn-sm">Ver más</a>` : ''}
                <a href="https://api.whatsapp.com/send/?phone=573504706990&text=${encodeURIComponent(`Hola, quiero que me avisen cuando ${s.nombre} esté disponible.`)}"
                   target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i class="fa-regular fa-bell"></i> Avísame</a>
            </div>
        </article>`).join('');

    // ----------------------------------------------------------------------
    // Stats del hero y footer
    // ----------------------------------------------------------------------
    const stats = document.getElementById('hero-stats');
    if (stats) {
        stats.innerHTML = `
            <div class="stat-item"><h4>${disponibles.length}</h4><p>${disponibles.length === 1 ? 'Sistema disponible' : 'Sistemas disponibles'}</p></div>
            <div class="stat-item"><h4>${proximos.length}</h4><p>En camino</p></div>
            <div class="stat-item"><h4>Android · iOS · Web</h4><p>Multiplataforma</p></div>`;
    }

    const footerSystems = document.getElementById('footer-systems');
    if (footerSystems) {
        footerSystems.innerHTML = sistemas.map(s => {
            const href = s.enlaces && s.enlaces.pagina ? s.enlaces.pagina : `#sistema-${s.id}`;
            return `<li><a href="${esc(href)}">${esc(s.nombre)}</a></li>`;
        }).join('');
    }

    // ----------------------------------------------------------------------
    // Contadores regresivos
    // ----------------------------------------------------------------------
    const countdowns = Array.from(document.querySelectorAll('.countdown'));
    if (countdowns.length) {
        const pad = (n) => String(n).padStart(2, '0');
        const tick = () => {
            const now = Date.now();
            countdowns.forEach(el => {
                const diff = new Date(el.dataset.launch).getTime() - now;
                if (diff <= 0) {
                    el.classList.add('countdown-done');
                    el.querySelector('.countdown-units').innerHTML =
                        '<div class="countdown-ready"><i class="fa-solid fa-rocket"></i> ¡Ya está aquí! Muy pronto en tiendas.</div>';
                    return;
                }
                const total = Math.floor(diff / 1000);
                const vals = {
                    d: Math.floor(total / 86400),
                    h: pad(Math.floor((total % 86400) / 3600)),
                    m: pad(Math.floor((total % 3600) / 60)),
                    s: pad(total % 60)
                };
                Object.entries(vals).forEach(([u, v]) => {
                    const node = el.querySelector(`[data-u="${u}"]`);
                    if (node) node.textContent = v;
                });
            });
        };
        tick();
        setInterval(tick, 1000);
    }
});
