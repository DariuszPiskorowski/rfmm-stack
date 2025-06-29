const mqtt = require('mqtt');
const { Pool } = require('pg');

const MQTT_BROKER_URL = process.env.MQTT_URL;
const MQTT_OPTIONS = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD
};
const TOPIC = 'devices/+/logs';

const PG_POOL = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

client.on('connect', () => {
  console.log('🌐 Połączono z MQTT, subskrypcja:', TOPIC);
  client.subscribe(TOPIC, { qos: 1 });
});

client.on('error', err => {
  console.error('Błąd MQTT:', err);
});

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

process.on('SIGINT', () => {
  console.log('Wyłączanie…');
  client.end();
  PG_POOL.end();
  process.exit(0);
});
