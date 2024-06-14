const Book = require("../models/Book");
const mongoSanitize = require('mongo-sanitize');

// Fonction pour créer un livre
exports.createBook = (req, res, next) => {
    // Assainir les données entrantes
    const sanitizedBody = {
        title: mongoSanitize(req.body.title),
        description: mongoSanitize(req.body.description),
        imageUrl: mongoSanitize(req.body.imageUrl),
        userId: mongoSanitize(req.body.userId),
        price: mongoSanitize(req.body.price),
    };

    // Créer une nouvelle instance de Book avec les données assainies
    const book = new Book(sanitizedBody);

    // Sauvegarder le livre dans la base de données
    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré avec succès !' });
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde du livre:', error);
            res.status(400).json({ error });
        });
};

exports.getOneBook = (req, res, next)=>{
    Book.findOne({
        _id: req.params.id
    })
    .then((book)=>res.status(200).json(book))
    .catch((error)=>res.status(404).json({error}))
}
