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

exports.getAllBooks = (req, res, next)=>{
    Book.find()
    .then((books)=>res.status(200).json(books))
    .catch((error)=>res.status(400).json({error}))
}

exports.upDateBook = (req, res, next)=>{
    const book = new Book({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price 
    })
    Book.updateOne({_id: req.params.id}, book)
    .then(()=>{
        res.status(201).json({message:'Book updated successfully'})
    })
    .catch((error)=>{res.status(400).json({error:error})})
}

exports.deleteBook = (req, res, next)=>{
    Book.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
     );
}
