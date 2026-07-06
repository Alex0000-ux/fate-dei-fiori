document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Motore Menu Hamburger
    // ==========================================
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

    // ==========================================
    // 1. Gestione delle animazioni allo scroll
    // ==========================================
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15 
    });
    elements.forEach(el => observer.observe(el));

    // ==========================================
    // 2. Motore Form Contatti -> WhatsApp API
    // ==========================================
    const waForm = document.getElementById('wa-form');
    if (waForm) {
        waForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('wa-nome').value.trim();
            const servizio = document.getElementById('wa-servizio').value;
            const messaggio = document.getElementById('wa-messaggio').value.trim();

            const testoWhatsApp = `Ciao Fata dei Fiori! 🌸\n\nMi chiamo *${nome}*.\nVi contatto per: *${servizio}*.\n\nEcco i dettagli della mia richiesta:\n"${messaggio}"\n\nAttendo un vostro riscontro, grazie!`;
            const urlCodificato = encodeURIComponent(testoWhatsApp);
            const numeroTelefono = "393296912460"; 
            
            const linkApi = `https://wa.me/${numeroTelefono}?text=${urlCodificato}`;
            window.open(linkApi, '_blank');
        });
    }

    // ==========================================
    // SISTEMA CENTRALIZZATO DATI GALLERIA (OTTIMIZZAZIONE MOBILE)
    // ==========================================
    let cachedGalleryData = null; // Cache per non scaricare il JSON più volte
    
    async function getGalleryData() {
        if (cachedGalleryData) return cachedGalleryData;
        try {
            const response = await fetch('img/gallery-data.json');
            if (!response.ok) throw new Error("File JSON non trovato");
            cachedGalleryData = await response.json();
            return cachedGalleryData;
        } catch (error) {
            console.error("Attenzione: Errore nel recupero dati galleria.", error);
            return null;
        }
    }

    // ==========================================
    // 3. Motore Slider Galleria Avanzato
    // ==========================================
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (track && prevBtn && nextBtn) {
        getGalleryData().then(data => {
            if (data && data.totalImages > 0) {
                inizializzaSlider(data.totalImages);
            } else {
                const galleryElement = document.querySelector('.gallery');
                if (galleryElement) galleryElement.style.display = 'none';
            }
        });
    }

    function inizializzaSlider(totalImages) {
        const fragment = document.createDocumentFragment();
        
        for (let i = 1; i <= totalImages; i++) {
            const img = document.createElement('img');
            img.src = `img/galleria/fioraio-${i}.jpg`;
            img.alt = `Creazione Floreale ${i}`;
            img.loading = 'lazy'; 
            fragment.appendChild(img);
        }
        track.appendChild(fragment); // Iniezione singola per non far scattare la pagina

        const imgs = document.querySelectorAll('.slider-track img');
        let currentIndex = 0;

        function getVisibleCards() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 4;
        }

        function updateSlider() {
            if (imgs.length === 0) return;
            const imgWidth = imgs[0].getBoundingClientRect().width;
            const gap = 20; 
            const amountToMove = currentIndex * (imgWidth + gap);
            track.style.transform = `translateX(-${amountToMove}px)`;
        }
        
        nextBtn.addEventListener('click', () => {
            const maxIndex = imgs.length - getVisibleCards();
            currentIndex = currentIndex < maxIndex ? Math.min(currentIndex + getVisibleCards(), maxIndex) : 0;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            const maxIndex = imgs.length - getVisibleCards();
            currentIndex = currentIndex > 0 ? Math.max(currentIndex - getVisibleCards(), 0) : maxIndex;
            updateSlider();
        });

        window.addEventListener('resize', () => {
            const maxIndex = imgs.length - getVisibleCards();
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateSlider();
        });

        updateSlider();
    }

});
