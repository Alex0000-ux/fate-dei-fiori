document.addEventListener('DOMContentLoaded', () => {



    // 0. Motore Menu Hamburger

    const hamburger = document.querySelector('.hamburger');

    const nav = document.getElementById('main-nav');

    

    if (hamburger && nav) {

        hamburger.addEventListener('click', () => {

            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

            hamburger.setAttribute('aria-expanded', !isExpanded);

            nav.classList.toggle('active');

        });



        // Chiude il menu quando si clicca su un link (utile su mobile)

        nav.querySelectorAll('a').forEach(link => {

            link.addEventListener('click', () => {

                hamburger.setAttribute('aria-expanded', 'false');

                nav.classList.remove('active');

            });

        });

    }



    

    // 1. Gestione delle animazioni allo scroll (Motore Intersection Observer)

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



    // 2. Motore Form Contatti -> WhatsApp API

    const waForm = document.getElementById('wa-form');

    

    if (waForm) {

        waForm.addEventListener('submit', function(e) {

            e.preventDefault();



            const nome = document.getElementById('wa-nome').value.trim();

            const servizio = document.getElementById('wa-servizio').value;

            const messaggio = document.getElementById('wa-messaggio').value.trim();



            const testoWhatsApp = `Ciao Fata dei Fiori! 🌸\n\nMi chiamo *${nome}*.\nVi contatto per: *${servizio}*.\n\nEcco i dettagli della mia richiesta:\n"${messaggio}"\n\nAttendo un vostro riscontro, grazie!`;

            const urlCodificato = encodeURIComponent(testoWhatsApp);

            const numeroTelefono = "393913873184"; 

            

            const linkApi = `https://wa.me/${numeroTelefono}?text=${urlCodificato}`;

            window.open(linkApi, '_blank');

        });

    }



    // 3. Motore Slider Galleria Avanzato (Generazione Dinamica via JSON)

    const track = document.querySelector('.slider-track');

    const prevBtn = document.querySelector('.prev-btn');

    const nextBtn = document.querySelector('.next-btn');

    

    if (track && prevBtn && nextBtn) {

        

        // Legge il file generato da Python per sapere quante foto ci sono realmente

        fetch('img/gallery-data.json')

            .then(response => {

                if (!response.ok) throw new Error("File di configurazione galleria non trovato");

                return response.json();

            })

            .then(data => {

                const totalImages = data.totalImages;

                if (totalImages > 0) {

                    inizializzaSlider(totalImages);

                } else {

                    document.querySelector('.gallery').style.display = 'none';

                }

            })

            .catch(error => {

                // CORRETTO: Ora scrive in console senza aprire la finestra di stampa!

                console.error("Attenzione: Impossibile mappare la galleria. Dettaglio:", error);

            });

    }



    function inizializzaSlider(totalImages) {

        // 1. Iniezione controllata delle immagini nel tracciato

        for (let i = 1; i <= totalImages; i++) {

            const img = document.createElement('img');

            img.src = `img/galleria/fioraio-${i}.jpg`;

            img.alt = `Creazione Floreale ${i}`;

            img.loading = 'lazy'; 

            track.appendChild(img);

        }



        // 2. Lettura dei nodi appena inseriti

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

        

        // Controlli di movimento

        nextBtn.addEventListener('click', () => {

            const visibleCards = getVisibleCards();

            const maxIndex = imgs.length - visibleCards;

            

            if (currentIndex < maxIndex) {

                currentIndex = Math.min(currentIndex + visibleCards, maxIndex);

            } else {

                currentIndex = 0; 

            }

            updateSlider();

        });



        prevBtn.addEventListener('click', () => {

            const visibleCards = getVisibleCards();

            const maxIndex = imgs.length - visibleCards;

            

            if (currentIndex > 0) {

                currentIndex = Math.max(currentIndex - visibleCards, 0);

            } else {

                currentIndex = maxIndex; 

            }

            updateSlider();

        });



        window.addEventListener('resize', () => {

            const maxIndex = imgs.length - getVisibleCards();

            if (currentIndex > maxIndex) {

                currentIndex = maxIndex;

            }

            updateSlider();

        });



        // Primo rendering

        updateSlider();

    }

});



//MATRIMONI LOADER

document.addEventListener('DOMContentLoaded', () => {



    const contenitoreMatrimoni = document.getElementById('grid-matrimoni');



    if (contenitoreMatrimoni) {

        // Legge il JSON aggiornato

        fetch('img/gallery-data.json')

            .then(response => {

                if (!response.ok) throw new Error("File JSON non trovato");

                return response.json();

            })

            .then(data => {

                // Legge la chiave specifica dal JSON

                const totaleFoto = data.matrimoniTotImg;



                // Se per qualche motivo nel JSON non c'è questa chiave, blocca lo script

                if (!totaleFoto) {

                    console.error("La chiave 'matrimoniTotImg' non è presente nel file JSON.");

                    return;

                }



                // Ciclo inverso: parte dall'indice maggiore e scende a 1

                for (let i = totaleFoto; i >= 1; i--) {

                    const img = document.createElement('img');

                    img.src = `img/matrimoni/${i}.jpg`;

                    img.alt = `Foto matrimonio ${i}`;

                    img.loading = 'lazy'; // Ottimizza il caricamento della pagina



                    contenitoreMatrimoni.appendChild(img);

                }

            })

            .catch(error => {

                console.error("Errore nel caricamento della galleria matrimoni:", error);

            });

    }



});



//EVENTI LOADER

document.addEventListener('DOMContentLoaded', () => {



    const contenitoreEventi = document.getElementById('grid-eventi');



    if (contenitoreEventi) {

        // Legge il JSON aggiornato

        fetch('img/gallery-data.json')

            .then(response => {

                if (!response.ok) throw new Error("File JSON non trovato");

                return response.json();

            })

            .then(data => {

                // Legge la chiave specifica dal JSON

                const totaleFoto = data.eventiTotImg;



                // Se per qualche motivo nel JSON non c'è questa chiave, blocca lo script

                if (!totaleFoto) {

                    console.error("La chiave 'eventiTotImg' non è presente nel file JSON.");

                    return;

                }



                // Ciclo inverso: parte dall'indice maggiore e scende a 1

                for (let i = totaleFoto; i >= 1; i--) {

                    const img = document.createElement('img');

                    img.src = `img/eventi/${i}.jpg`;

                    img.alt = `Foto evento ${i}`;

                    img.loading = 'lazy'; // Ottimizza il caricamento della pagina



                    contenitoreEventi.appendChild(img);

                }

            })

            .catch(error => {

                console.error("Errore nel caricamento della galleria eventi:", error);

            });

    }



});



//SINGOLI LOADER

document.addEventListener('DOMContentLoaded', () => {

    caricaSingoli();

});



document.querySelector('a[href="singoli.html"]').addEventListener('click', () => {

    setTimeout(caricaSingoli, 100);

});



async function caricaSingoli() {



    const contenitore = document.getElementById('grid-singoli');

    if (!contenitore) return;



    // evita doppio caricamento

    if (contenitore.dataset.loaded === "true") return;



    const response = await fetch('img/gallery-data.json');

    const data = await response.json();



    const totale = data.singoliTotImg;



    const fragment = document.createDocumentFragment();



    for (let i = totale; i >= 1; i--) {

        const img = new Image();

        img.src = `img/singoli/${i}.jpg`;

        img.loading = "lazy";

        fragment.appendChild(img);

    }



    contenitore.innerHTML = "";

    contenitore.appendChild(fragment);



    contenitore.dataset.loaded = "true";

}

