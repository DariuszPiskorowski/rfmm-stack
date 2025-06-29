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
