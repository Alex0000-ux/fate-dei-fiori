import os
import json
import glob

# Definisce i percorsi
cartella_matrimoni = os.path.dirname(os.path.abspath(__file__))
percorso_json = os.path.join(cartella_matrimoni, '..', 'gallery-data.json')

def organizza_galleria():
    # Trova tutte le immagini (jpg, jpeg, png)
    estensioni = ('*.jpg', '*.jpeg', '*.png')
    immagini = []
    for estensione in estensioni:
        immagini.extend(glob.glob(os.path.join(cartella_matrimoni, estensione)))
    
    # Ordina le immagini per data di modifica (le più recenti alla fine)
    immagini.sort(key=os.path.getmtime)
    
    totale_foto = len(immagini)
    if totale_foto == 0:
        print("Nessuna immagine trovata nella cartella.")
        return

    # FASE 1: Rinomina temporanea per evitare conflitti
    file_temporanei = []
    for i, percorso_originale in enumerate(immagini, start=1):
        estensione = os.path.splitext(percorso_originale)[1].lower()
        if estensione == '.jpeg': estensione = '.jpg'
        
        percorso_temporaneo = os.path.join(cartella_matrimoni, f"temp_{i}{estensione}")
        os.rename(percorso_originale, percorso_temporaneo)
        file_temporanei.append(percorso_temporaneo)

    # FASE 2: Rinomina definitiva (fioraio-1.jpg, fioraio-2.jpg, ecc.)
    for i, percorso_temporaneo in enumerate(file_temporanei, start=1):
        # Qui applichiamo il prefisso richiesto "fioraio-"
        percorso_definitivo = os.path.join(cartella_matrimoni, f"fioraio-{i}.jpg")
        os.rename(percorso_temporaneo, percorso_definitivo)

    # FASE 3: Gestione intelligente del JSON
    dati_json = {}
    
    # Se il file JSON esiste già, lo legge per non perdere altri dati
    if os.path.exists(percorso_json):
        try:
            with open(percorso_json, 'r') as file_json:
                dati_json = json.load(file_json)
        except json.JSONDecodeError:
            pass # Se il file è vuoto o corrotto, ignora e riparte da zero

    # Aggiunge o aggiorna solo la chiave specifica (modificala se serve)
    dati_json["totalImages"] = totale_foto

    # Salva il file JSON aggiornato
    with open(percorso_json, 'w') as file_json:
        json.dump(dati_json, file_json, indent=4)
        
    print(f"Operazione completata! {totale_foto} foto rinominate in 'fioraio-X' e chiave aggiornata nel JSON.")

if __name__ == "__main__":
    organizza_galleria()