
# Importanza di questo microservizio

Ci troviamo nell'applicazione LiveQuiz di Alessio S. e questo microservizio gestisce la parte realtime dell'applicazione, in particolare:
- Stato delle stanze (classifica in tempo reale etc.)
- Connessioni socket

Le funzionalità applicative che esporrà questo microservzio
- Creare una stanza (input: il quiz da eseguire)
- Partecipare a una stanza, unendosi tramite username
- Poter partecipare al quiz tramite eventi inviati e ricevuti in tempo reale
