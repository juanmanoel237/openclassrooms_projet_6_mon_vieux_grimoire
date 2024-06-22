const multer = require("multer");
const sharp = require("sharp");

// Modules natifs Node.js pour gérer les fichiers et les chemins de fichiers
const path = require("path");
const fs = require("fs");

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  // Définir le dossier de destination des fichiers
  destination: (req, file, callback) => {
    callback(null, "images"); // Enregistrement des fichiers dans le dossier images
  },

  // Générer un nom de fichier unique pour éviter les conflits
  filename: (req, file, callback) => {
    const name = file.originalname.slice(0, 3); // Utiliser les 3 premiers caractères du nom original
    callback(null, name + Date.now() + ".webp"); // Ajouter un timestamp et utiliser l'extension .webp
  },

  // Vérification du type MIME du fichier pour autoriser uniquement les images
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      callback(new Error("Seuls les fichiers JPG, JPEG et PNG sont autorisés !"), false);
    } else {
      callback(null, true);
    }
  },
});

// Création du dossier images s'il n'existe pas
if (!fs.existsSync("images")) {
  fs.mkdirSync("images"); // Crée le dossier images
}

// Middleware pour gérer le téléchargement de fichiers avec Multer
module.exports = multer({ storage: storage }).single("image");

// Middleware pour optimiser l'image téléchargée avec Sharp
module.exports.optimizeImage = (req, res, next) => {
  // Vérifier si un fichier a été téléchargé
  if (!req.file) {
    return next(); // Si aucun fichier, passer au middleware suivant
  }

  const filePath = req.file.path; // Chemin du fichier original
  const fileName = req.file.filename; // Nom du fichier original
  const outputFilePath = path.join("images", `resized_${fileName}`); // Chemin du fichier optimisé

  // Désactivation du cache de Sharp
  sharp.cache(false);

  // Redimensionner l'image avec Sharp
  sharp(filePath)
    .resize({ width: 500, height: 500 }) // Redimensionner à une largeur de 500 pixels et une hauteur de 600 pixels
    .toFile(outputFilePath) // Enregistrer le fichier redimensionné
    .then(() => {
      console.log(`Image ${fileName} optimisée avec succès !`); // Log de succès
      // Supprimer le fichier original et mettre à jour le chemin dans la requête
      fs.unlink(filePath, () => {
        req.file.path = outputFilePath; // Mettre à jour le chemin du fichier dans la requête
        console.log(`Image ${fileName} supprimée avec succès !`); // Log de suppression
        next(); // Passer au middleware suivant
      });
    })
    .catch((err) => {
      console.log(err); // Log de l'erreur
      return next(); // Passer l'erreur au middleware suivant
    });
};
