const Book = require("../models/Book");
const mongoSanitize = require('mongo-sanitize');
const fs = require('fs')

// Fonction pour créer un livre
exports.createBook = (req, res, next) => {
    if (!req.body.book) {
        return res.status(400).json({ error: 'Book data is missing' });
    }

    // Vérifier l'objet fichier
    if (!req.file || !req.file.filename) {
        return res.status(400).json({ error: 'File upload is missing or invalid' });
    }

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré avec succès !' });
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde du livre:', error);
            res.status(400).json({ error });
        });
};


exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(404).json({ error }));
  };

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
