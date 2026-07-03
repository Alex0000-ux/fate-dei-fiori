import os
import glob

# Configurazione: leghiamo ogni file HTML alla sua cartella e al suo marcatore
configurazione = [
    {"html": "matrimoni.html", "cartella": "img/matrimoni", "id": "grid-matrimoni"},
    {"html": "eventi.html", "cartella": "img/eventi", "id": "grid-eventi"},
    {"html": "singoli.html", "cartella": "img/singoli", "id": "grid-singoli"}
]

for item in configurazione:
    file_html = item["html"]
    cartella_img = item["cartella"]
    id_div = item["id"]

    if not os.path.exists(file_html):
        print(f"Salto {file_html}: file non trovato nella cartella corrente.")
        continue

    # Conta quanti file .jpg ci sono nella cartella
    foto = glob.glob(f"{cartella_img}/*.jpg") + glob.glob(f"{cartella_img}/*.JPG")
    totale_foto = len(foto)

    # Crea l'HTML delle immagini (in ordine decrescente, come volevi tu)
    html_immagini = "\n"
    for i in range(totale_foto, 0, -1):
        # NOTA: qui possiamo rimettere il loading="lazy" perché ora 
        # l'HTML è fisso e non fa più impazzire i telefoni!
        html_immagini += f'        <img src="{cartella_img}/{i}.jpg" alt="Foto {i}" class="immagine-fluida" loading="lazy">\n'

    # Legge il file HTML esistente
    with open(file_html, 'r', encoding='utf-8') as f:
        contenuto = f.read()

    # Identifica i marcatori che abbiamo messo prima
    marcatore_inizio = f"<!-- INIZIO {id_div} -->"
    marcatore_fine = f"<!-- FINE {id_div} -->"

    if marcatore_inizio in contenuto and marcatore_fine in contenuto:
        # Taglia l'HTML in due pezzi (prima del marcatore e dopo il marcatore)
        prima = contenuto.split(marcatore_inizio)[0]
        dopo = contenuto.split(marcatore_fine)[1]

        # Ricuce tutto insieme con le foto in mezzo
        nuovo_contenuto = prima + marcatore_inizio + html_immagini + "    " + marcatore_fine + dopo

        # Salva il file HTML definitivo
        with open(file_html, 'w', encoding='utf-8') as f:
            f.write(nuovo_contenuto)
        print(f"✅ {file_html} aggiornato con successo: aggiunte {totale_foto} foto.")
    else:
        print(f"⚠️ Errore in {file_html}: Non trovo i commenti marcatori <!-- INIZIO... e <!-- FINE...")

print("\n🚀 Operazione completata. Ora puoi caricare i file HTML aggiornati sul server.")
