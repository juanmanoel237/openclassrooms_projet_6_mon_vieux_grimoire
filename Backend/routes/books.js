const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();
const bookCtrl = require("../controllers/books");

// Route pour obtenir tous les livres
router.get('/', bookCtrl.getAllBooks);
// Route pour obtenir les livres les mieux notés, doit être avant /:id pour ne pas être interprétée comme une route avec un ID
router.get("/bestrating", bookCtrl.getBestRating);
// Route pour obtenir un livre par son ID
router.get('/:id', bookCtrl.getOneBook);
// Route pour créer un nouveau livre avec authentification et upload d'image
router.post('/', auth, multer, multer.optimizeImage, bookCtrl.createBook);
// Route pour ajouter une note à un livre avec authentification
router.post("/:id/rating", auth, bookCtrl.createRating);
// Route pour mettre à jour un livre par son ID avec authentification et upload d'image
router.put('/:id', auth, multer, multer.optimizeImage, bookCtrl.upDateBook);
// Route pour supprimer un livre par son ID avec authentification
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
