# RFMM Swarm Stack – SZYBKI START

1. Skonfiguruj .env (patrz przykład w repo).
2. Wypełnij pliki w katalogu secrets/ (mqtt_password.txt, pg_password.txt).
3. Na wszystkich node'ach powinien być Tailscale (host, NIE w kontenerze!).
4. Zbuduj logger/watcher/lock-ui (docker build/push) lub skorzystaj z obrazu z registry.
5. Na managerze Swarm wykonaj:
   docker stack deploy -c docker-stack.yml rfmm
6. Status usług: docker service ls
7. Adminer: http://tailscale-adres:8080
8. Lock UI uruchomisz poleceniem:
   docker service scale rfmm_lockui=1
9. Watcher alarmuje przez MQTT (topic office/alerts)
10. Logger odbiera dane MQTT i loguje do bazy.

Szczegóły: patrz INSTRUKCJA.txt

---

# RFMM Swarm Stack – QUICK START

1. Configure `.env` (see the example in the repository).
2. Fill in the files in the `secrets/` directory (`mqtt_password.txt`, `pg_password.txt`).
3. Tailscale should be installed on all nodes (on the host, NOT in a container!).
4. Build `logger` / `watcher` / `lock-ui` (`docker build/push`) or use an image from the registry.
5. On the Swarm manager, run:
   docker stack deploy -c docker-stack.yml rfmm
6. Check service status with: `docker service ls`
7. Adminer: `http://tailscale-address:8080`
8. You can start Lock UI with:
   docker service scale rfmm_lockui=1
9. Watcher sends alerts via MQTT (topic `office/alerts`)
10. Logger receives MQTT data and logs it to the database.

Details: see `INSTRUKCJA.txt`
