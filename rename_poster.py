import os
import cv2

# Specifica il percorso della tua cartella con i video
cartella_video = "img/video"

# Ottieni tutti i file video nella cartella
estensioni_valide = ('.mp4', '.mov', '.avi', '.mkv')
files_video = [f for f in os.listdir(cartella_video) if f.lower().endswith(estensioni_valide)]

# Ordina i file in ordine alfabetico per coerenza prima di rinominarli
files_video.sort()

for indice, nome_file in enumerate(files_video, start=1):
    percorso_vecchio = os.path.join(cartella_video, nome_file)
    nome_nuovo_video = f"video{indice}.mp4"
    percorso_nuovo = os.path.join(cartella_video, nome_nuovo_video)
    
    # 1. Rinomina il video
    # Usiamo un blocco try/except nel caso il file si chiami già in quel modo
    if percorso_vecchio != percorso_nuovo:
        os.rename(percorso_vecchio, percorso_nuovo)
        print(f"Rinominato: {nome_file} -> {nome_nuovo_video}")
    
    # 2. Crea il poster
    nome_poster = f"poster{indice}.jpg"
    percorso_poster = os.path.join(cartella_video, nome_poster)
    
    # Estrai il frame con OpenCV
    cap = cv2.VideoCapture(percorso_nuovo)
    
    # Imposta la lettura al frame 30 (circa 1 secondo dall'inizio a 30fps)
    # per evitare di pescare uno schermo nero iniziale
    cap.set(cv2.CAP_PROP_POS_FRAMES, 30)
    successo, immagine = cap.read()
    
    if successo:
        cv2.imwrite(percorso_poster, immagine)
        print(f"Creato poster: {nome_poster}")
    else:
        # Se il video è cortissimo e non ha 30 frame, riprova con il frame 0
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        successo, immagine = cap.read()
        if successo:
            cv2.imwrite(percorso_poster, immagine)
            print(f"Creato poster dal frame 0: {nome_poster}")
        else:
            print(f"Errore nell'estrazione del poster per {nome_nuovo_video}")
            
    cap.release()

print("\nOperazione completata con successo! I tuoi video e poster sono pronti.")