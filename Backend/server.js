const http = require('http'); // Importation du module HTTP
const app = require('./app'); // Importation de l'application Express
const { log } = require('console'); // Importation de la fonction log depuis le module console

// Fonction pour normaliser le port
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) { // Vérifie si le port n'est pas un nombre
        return val;
    }
    if (port >= 0) { // Vérifie si le port est un nombre positif
        return port;
    }
    return false;
};

// Définit le port de l'application
const port = normalizePort(process.env.PORT || 4000);

app.set('port', port); // Met le port sur lequel l'application va écouter

// Gestionnaire d'erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') { // Vérifie si l'erreur est liée à l'écoute du serveur
        throw error;
    }
    const address = server.address(); // Récupère l'adresse du serveur
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    // Gère les différentes erreurs spécifiques
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1); // Quitte le processus avec un code d'échec
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1); // Quitte le processus avec un code d'échec
            break;
        default:
            throw error; // Lance l'erreur pour les autres cas
    }
};

// Crée un serveur HTTP avec l'application Express
const server = http.createServer(app);

server.on('error', errorHandler); // Attache le gestionnaire d'erreurs au serveur
server.on('listening', () => { // Attache un gestionnaire d'événement pour l'écoute du serveur
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind); // Affiche un message lorsque le serveur commence à écouter
});

server.listen(port); // Fait écouter le serveur sur le port spécifié
