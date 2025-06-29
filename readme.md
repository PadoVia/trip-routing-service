## 🗂️ Struttura del progetto

```
trip-routing-service/
│
├── src/
│   ├── server.js                # Entry point - inizializza connessioni Redis e PostgreSQL
│   ├── env.js                   # Caricamento e validazione variabili da .env
│
│   ├── redis/
│   │   └── listener.js          # Redis subscriber: ascolta i topic GPS dei veicoli
│
│   ├── osrm/
│   │   └── matcher.js           # Chiama OSRM match API con coordinate e timestamp
│
│   ├── gps/
│   │   └── node-analyzer.js     # Analizza i nodi restituiti da OSRM per capire il percorso fatto
│   │
│   ├── stops/
│   │   ├── stop-matcher.js      # TODO: Confronta nodi OSRM con fermate note
│   │   └── stop-db.js           # Query per trovare fermate compatibili in PostgreSQL
│
│   ├── trips/
│   │   ├── trip-finder.js       # Cerca i trip possibili per fermata, orario, giorno
│   │   └── trip-selector.js     # TODO: Filtra i trip già assegnati, gestisce probabilità
│
│   ├── utils/
│   │   ├── datetime.js          # Conversioni date, gestione orari post-24:00 [TODO]
│   │   └── logger.js            # Logging centralizzato
│
│   └── config/
│       ├── redis.js             # Connessione Redis
│       └── postgres.js          # Connessione PostgreSQL
│
├── .env                         # Variabili: REDIS_URL, PG_URI, OSRM_ENDPOINT, ecc.
├── package.json
└── README.md
```

---

## 🧠 Flusso Logico (semplificato)

1. **`server.js`** si avvia → carica config → apre connessioni a Redis/PostgreSQL
2. **`listener.js`** ascolta `operator:busitalia_veneto_padua:vehicles:status:*`
3. Quando arriva un update:

   * prendi coordinate attuali e precedenti
   * manda a **`matcher.js`** → OSRM Matching API
   * ottieni i nodi
   * usa **`node-analyzer.js`** per vedere da quali nodi è passato
   * \[TODO] confronta con fermate conosciute (`stop-matcher.js`)
   * dalla prima fermata utile, interroga **PostgreSQL** via `stop-db.js`
     per trovare i trip compatibili (`trip-finder.js`)
   * salva i candidati trip
4. \[TODO] **`trip-selector.js`** → (alpha 2.0): filtra e pesa i trip in base a:

   * Assegnazioni esistenti
   * Turni / blocchi
   * Guasti / eccezioni
5. \[TODO] `datetime.js` → deve gestire orari tipo `25:03` correttamente

---

## 📝 TODO Riepilogo

* [ ] Mappare nodi OSRM con le fermate note (`stops/stop-matcher.js`)
* [ ] Gestire orari oltre la mezzanotte (`utils/datetime.js`)
* [ ] Gestione logica pesi trip, assegnazioni, blocchi (`trips/trip-selector.js`)
* [ ] Gestione eventi eccezionali (guasti, sostituzioni)