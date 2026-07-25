import os
import cv2

# Specifica il percorso della tua cartella con i video
cartella_video = "img/video"

# Ottieni tutti i file video nella cartella
estensioni_valide = ('.mp4', '.mov', '.avi', '.mkv')
tutti_i_files = os.listdir(cartella_video)

# Separiamo i video già rinominati da quelli nuovi
video_nuovi = []
numeri_occupati = []

for f in tutti_i_files:
    if f.lower().endswith(estensioni_valide):
        # Controlla se il file segue già lo schema "videoX.mp4"
        if f.startswith("video") and f[5:-4].isdigit():
            numeri_occupati.append(int(f[5:-4]))
        else:
            video_nuovi.append(f)

# Ordina i nuovi file in ordine alfabetico per coerenza
video_nuovi.sort()

# Trova il primo numero progressivo libero da cui partire
indice_corrente = max(numeri_occupati) + 1 if numeri_occupati else 1

if not video_nuovi:
    print("Non ci sono nuovi video da rinominare.")
else:
    for nome_file in video_nuovi:
        percorso_vecchio = os.path.join(cartella_video, nome_file)
        
        # Cerca il prossimo numero disponibile (ulteriore controllo di sicurezza)
        while True:
            nome_nuovo_video = f"video{indice_corrente}.mp4"
            percorso_nuovo = os.path.join(cartella_video, nome_nuovo_video)
            if not os.path.exists(percorso_nuovo):
                break
            indice_corrente += 1
            
        # 1. Rinomina il video nuovo
        os.rename(percorso_vecchio, percorso_nuovo)
        print(f"Rinominato: {nome_file} -> {nome_nuovo_video}")
        
        # 2. Crea il poster associato con lo stesso numero
        nome_poster = f"poster{indice_corrente}.jpg"
        percorso_poster = os.path.join(cartella_video, nome_poster)
        
        # Estrai il frame con OpenCV
        cap = cv2.VideoCapture(percorso_nuovo)
        
        # Imposta la lettura al frame 30 (circa 1 secondo dall'inizio a 30fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, 30)
        successo, immagine = cap.read()
        
        if successo:
            cv2.imwrite(percorso_poster, immagine)
            print(f"Creato poster: {nome_poster}")
        else:
            # Se il video è cortissimo, riprova con il frame 0
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            successo, immagine = cap.read()
            if successo:
                cv2.imwrite(percorso_poster, immagine)
                print(f"Creato poster dal frame 0: {nome_poster}")
            else:
                print(f"Errore nell'estrazione del poster per {nome_nuovo_video}")
                
        cap.release()
        indice_corrente += 1

print("\nOperazione completata! I nuovi video e poster sono pronti.")
