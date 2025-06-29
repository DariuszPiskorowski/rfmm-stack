const Docker = require('dockerode');
const mqtt = require('mqtt');

const WATCHED = (process.env.WATCHED_CONTAINERS || "logger,db").split(",");
const MQTT_URL = process.env.MQTT_URL;
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const docker = new Docker();
const mqttClient = mqtt.connect(MQTT_URL, {
  username: MQTT_USER,
  password: MQTT_PASSWORD
});

function notify(container, status) {
  const msg = `ALARM: Kontener ${container} ${status}!`;
  mqttClient.publish('office/alerts', msg);
}

async function checkAndRestart() {
  for (let name of WATCHED) {
    try {
      const container = docker.getContainer(name.trim());
      const data = await container.inspect();
      if (data.State.Status !== 'running') {
        await container.restart();
        notify(name, "zrestartowany");
      }
    } catch (err) {
      notify(name, `niedostepny: ${err.message}`);
    }
  }
}

mqttClient.on('connect', () => {
  setInterval(checkAndRestart, 10000);
});
mqttClient.on('error', (err) => {
  console.error('MQTT connection error:', err);
});
mqttClient.on('offline', () => {
  console.warn('MQTT client is offline');
});
mqttClient.on('reconnect', () => {
  console.log('MQTT client is reconnecting');
});
