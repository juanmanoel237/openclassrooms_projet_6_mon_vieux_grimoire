const multer = require('multer'); // Importation de multer pour la gestion des fichiers

// Définition des types MIME pour les images
const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
    // Définir le dossier de destination des fichiers
    destination: (req, file, callback) => {
        callback(null, 'images'); // Dossier 'images' pour le stockage
    },
    // Définir le nom de fichier pour éviter les conflits
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // Remplacer les espaces par des underscores
        const extension = MIME_TYPE[file.mimetype]; // Obtenir l'extension du fichier à partir de son type MIME
        callback(null, name + Date.now() + '.' + extension); // Ajouter un timestamp pour garantir l'unicité du nom
    }
});

// Exporter la configuration de multer en spécifiant que l'on gère des fichiers uniques avec le champ 'image'
module.exports = multer({ storage: storage }).single('image');
