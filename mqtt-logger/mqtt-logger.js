
// Importujemy klienta MQTT oraz pulę połączeń do Postgresa
const mqtt = require('mqtt');
const { Pool } = require('pg');


// Dane do połączenia z brokerem MQTT pobierane z env
const MQTT_BROKER_URL = process.env.MQTT_URL;
const MQTT_OPTIONS = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD
};
// Subskrybujemy wszystkie logi z urządzeń
const TOPIC = 'devices/+/logs';


// Konfiguracja połączenia z bazą Postgres (dane z env)
const PG_POOL = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});


// Tworzymy klienta MQTT
const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);


// Po połączeniu z brokerem subskrybujemy temat logów
client.on('connect', () => {
  console.log('🌐 Połączono z MQTT, subskrypcja:', TOPIC);
  client.subscribe(TOPIC, { qos: 1 });
});


// Obsługa błędów MQTT
client.on('error', err => {
  console.error('Błąd MQTT:', err);
});


// Gdy przyjdzie wiadomość na subskrybowany temat, zapisujemy ją do bazy
client.on('message', async (topic, payloadBuf) => {
  const payload = payloadBuf.toString('utf8');
  const deviceId = topic.split('/')[1] || 'unknown';
  try {
    await PG_POOL.query(
      `INSERT INTO logs(device_id, topic, payload) VALUES ($1,$2,$3)`,
      [deviceId, topic, payload]
    );
    console.log(`✔ ${deviceId} → zapisano w bazie`);
  } catch (err) {
    console.error('Błąd zapisu do Postgresa:', err);
  }
});


// Obsługa zamknięcia procesu (np. Ctrl+C)
process.on('SIGINT', () => {
  console.log('Wyłączanie…');
  client.end();
  PG_POOL.end();
  process.exit(0);
});
