document.addEventListener('DOMContentLoaded', async () => {

    // --- 0. MENU HAMBURGER ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('main-nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
            });
        });
    }

    // --- 1. ANIMAZIONI SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- 2. FORM WHATSAPP (Metodo wa.me) ---
    const waForm = document.getElementById('wa-form');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('wa-nome').value.trim();
            const servizio = document.getElementById('wa-servizio').value;
            const messaggio = document.getElementById('wa-messaggio').value.trim();
            const testo = `Ciao Fata dei Fiori! 🌸\n\nMi chiamo *${nome}*.\nVi contatto per: *${servizio}*.\n\nEcco i dettagli della mia richiesta:\n"${messaggio}"\n\nAttendo un vostro riscontro, grazie!`;
            window.open(`https://wa.me/393913873184?text=${encodeURIComponent(testo)}`, '_blank');
        });
    }

    // --- 3. CARICAMENTO GALLERIE E SLIDER UNIFICATO ---
    try {
        const response = await fetch('img/gallery-data.json');
        const data = await response.json();

        // Popolamento pagine specifiche
        popolaGalleria('grid-matrimoni', 'img/matrimoni', data.matrimoniTotImg, "Foto matrimonio");
        popolaGalleria('grid-eventi', 'img/eventi', data.eventiTotImg, "Foto evento");
        popolaGalleria('grid-singoli', 'img/singoli', data.singoliTotImg, "Foto singolo");

        // Slider Unificato
        const track = document.querySelector('.slider-track');
        if (track) {
            inizializzaSliderUnificato(data, track);
        }

    } catch (err) {
        console.error("Errore caricamento galleria:", err);
    }
});

// --- FUNZIONI DI SUPPORTO ---

function popolaGalleria(id, path, totale, alt) {
    const container = document.getElementById(id);
    if (!container || !totale) return;
    const fragment = document.createDocumentFragment();
    for (let i = totale; i >= 1; i--) {
        const img = document.createElement('img');
        img.src = `${path}/${i}.jpg`;
        img.alt = `${alt} ${i}`;
        img.loading = 'lazy';
        fragment.appendChild(img);
    }
    container.innerHTML = "";
    container.appendChild(fragment);
}

function inizializzaSliderUnificato(data, track) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    // Array con le configurazioni delle fonti per lo slider
    const fonti = [
        { path: 'img/matrimoni', totale: data.matrimoniTotImg },
        { path: 'img/eventi', totale: data.eventiTotImg },
        { path: 'img/singoli', totale: data.singoliTotImg }
    ];

    // Inserisce le immagini nello slider
    fonti.forEach(fonte => {
        if (fonte.totale) {
            for (let i = 1; i <= fonte.totale; i++) {
                const img = document.createElement('img');
                img.src = `${fonte.path}/${i}.jpg`;
                img.alt = `Creazione ${fonte.path}`;
                img.loading = 'lazy';
                track.appendChild(img);
            }
        }
    });

    const totalImages = track.querySelectorAll('img').length;

    const update = () => {
        const imgWidth = track.querySelector('img')?.getBoundingClientRect().width || 0;
        track.style.transform = `translateX(-${currentIndex * (imgWidth + 20)}px)`;
    };

    nextBtn?.addEventListener('click', () => {
        const visible = window.innerWidth <= 600 ? 1 : 4;
        currentIndex = (currentIndex < totalImages - visible) ? currentIndex + visible : 0;
        update();
    });

    prevBtn?.addEventListener('click', () => {
        const visible = window.innerWidth <= 600 ? 1 : 4;
        currentIndex = (currentIndex > 0) ? currentIndex - visible : totalImages - visible;
        update();
    });
}
