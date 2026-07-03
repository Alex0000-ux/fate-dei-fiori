const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Configurazione CORS: sostituisci con l'URL del tuo sito reale!
app.use(cors({
    origin: ['https://tuosito.it', 'https://tuosito.github.io'], // Metti qui il dominio del tuo sito
    methods: ['POST']
}));

app.use(express.json());

// Endpoint di ricezione
app.post('/invia-messaggio', async (req, res) => {
    const { nome, servizio, messaggio } = req.body;
    
    // Verifica minima dei dati
    if (!nome || !servizio || !messaggio) {
        return res.status(400).json({ success: false, error: "Dati mancanti" });
    }

    try {
        const token = process.env.WHATSAPP_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_ID;
        const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

        await axios.post(url, {
            messaging_product: "whatsapp",
            to: "393913873184",
            type: "text",
            text: { body: `Nuova richiesta da ${nome} (Servizio: ${servizio}):\n${messaggio}` }
        }, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, message: "Messaggio inviato con successo!" });
    } catch (err) {
        console.error("Errore API WhatsApp:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: "Errore nell'invio a WhatsApp" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend attivo sulla porta ${PORT}`));
