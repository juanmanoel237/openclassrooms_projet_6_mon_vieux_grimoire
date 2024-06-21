const Book = require("../models/Book"); 
const fs = require('fs'); // Import du module fs (File System) pour gérer les fichiers

// Fonction pour créer un livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${
        req.file.filename
      }`,
      // On initialise la note moyenne à la première note donnée sinon la note moyenne est à 0
      averageRating: bookObject.ratings[0].grade,
    });
    // Save = méthode de mongoose pour enregistrer un objet dans la base de données
    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Objet enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  };
  
  exports.upDateBook = (req, res, next) => {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${
            req.file.filename
          }`,
        }
      : { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(403).json({ message: "403: unauthorized request" });
        } else {
          const filename = book.imageUrl.split("/images/")[1];
          req.file &&
            fs.unlink(`images/${filename}`, (err) => {
              if (err) console.log(err);
            });
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => {
        res.status(404).json({ error });
      });
  };
// Fonction pour récupérer un livre par ID
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }) // Recherche le livre par ID
      .then((book) => res.status(200).json(book)) // Réponse en cas de succès
      .catch((error) => res.status(404).json({ error })); // Réponse en cas d'erreur
};

// Fonction pour récupérer tous les livres
exports.getAllBooks = (req, res, next)=>{
    Book.find() // Recherche tous les livres
    .then((books)=>res.status(200).json(books)) // Réponse en cas de succès
    .catch((error)=>res.status(400).json({error})); // Réponse en cas d'erreur
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
    // Trouver le livre à supprimer en utilisant l'ID dans les paramètres de la requête
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        // Vérifier si l'utilisateur qui demande la suppression est bien celui qui a créé le livre
        if (book.userId != req.auth.userId) {
          // Si l'utilisateur n'est pas autorisé, renvoyer une réponse avec un statut 403
          res.status(403).json({ message: "403: unauthorized request" });
        } else {
          // Extraire le nom du fichier de l'URL de l'image du livre
          const filename = book.imageUrl.split("/images/")[1];
          // Supprimer le fichier image associé au livre du système de fichiers
          fs.unlink(`images/${filename}`, () => {
            // Supprimer le document livre de la base de données
            Book.deleteOne({ _id: req.params.id })
              .then(() => {
                // Renvoyer une réponse de succès si la suppression a réussi
                res.status(200).json({ message: "Objet supprimé !" });
              })
              .catch((error) => res.status(400).json({ error }));
          });
        }
      })
      .catch((error) => {
        // Renvoyer une réponse d'erreur si le livre n'a pas été trouvé
        res.status(404).json({ error });
      });
};


// Fonction pour ajouter une notation à un livre
exports.createRating = async (req, res) => {
    try {
        const { rating } = req.body;
        // Vérifie si la note est valide (entre 0 et 5)
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "La note doit être entre 1 et 5" });
        }

        // Recherche le livre par son ID
        const book = await Book.findById(req.params.id);
        // Réponse si le livre n'est pas trouvé
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        // Vérifie si l'utilisateur a déjà noté ce livre
        const userIdArray = book.ratings.map((rating) => rating.userId);
        if (userIdArray.includes(req.auth.userId)) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Ajoute la nouvelle notation au livre
        book.ratings.push({ ...req.body, grade: rating });

        // Calcul de la moyenne des notes manuellement
        const totalGrades = book.ratings.reduce(
            (sum, rating) => sum + rating.grade,
            0
        );
        // Met à jour la note moyenne
        book.averageRating = (totalGrades / book.ratings.length).toFixed(1);

        // Sauvegarde le livre avec la nouvelle note
        await book.save();
        // Réponse en cas de succès
        return res.status(201).json(book);
    } catch (error) {
        // Réponse en cas d'erreur
        return res.status(500).json({ error: "Erreur lors de la création de la notation" });
    }
};


// Fonction pour récupérer les livres avec la meilleure note
exports.getBestRating = (req, res, next) => {
    Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(404).json({ error }));
  };
