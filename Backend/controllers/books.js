const Book = require("../models/Book"); 
const fs = require('fs'); // Import du module fs (File System) pour gérer les fichiers

// Fonction pour créer un livre
exports.createBook = (req, res, next) => {
    if (!req.body.book) {
        return res.status(400).json({ error: 'Book data is missing' }); // Vérifie si les données du livre sont présentes
    }

    // Vérifier l'objet fichier
    if (!req.file || !req.file.filename) {
        return res.status(400).json({ error: 'File upload is missing or invalid' }); // Vérifie si le fichier est présent et valide
    }

    const bookObject = JSON.parse(req.body.book); // Parse les données du livre
    delete bookObject._id; // Supprime l'ID du livre (ne doit pas être défini manuellement)
    delete bookObject._userId; // Supprime l'ID utilisateur (sera défini automatiquement)

    const book = new Book({
        ...bookObject, // Propagation des autres champs du livre
        userId: req.auth.userId, // Définir l'ID utilisateur à partir de l'authentification
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Crée l'URL de l'image
    });

    book.save() // Sauvegarde le livre dans la base de données
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré avec succès !' }); // Réponse en cas de succès
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde du livre:', error); // Affiche l'erreur dans la console
            res.status(400).json({ error }); // Réponse en cas d'erreur
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

// Fonction pour mettre à jour un livre
exports.upDateBook = (req, res, next)=>{
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book), // Si un fichier est présent, parse les données du livre
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Met à jour l'URL de l'image
    } : { ...req.body }; // Sinon, utilise directement les données du corps de la requête

    delete bookObject._userId; // Supprime l'ID utilisateur (sera défini automatiquement)
    Book.findOne({_id: req.params.id}) // Recherche le livre par ID
    .then((book)=>{
        if(book._userId != req.auth.userId){
            res.status(401).json({message:'Not authorized'}); // Vérifie si l'utilisateur est autorisé
        }else{
            Book.upDateOne({_id:req.params.id},{...bookObject, _id: req.params.id}) // Met à jour le livre
            .then(() => res.status(200).json({message:'Book modified'})) // Réponse en cas de succès
            .catch(error => res.status(400).json({error})); // Réponse en cas d'erreur
        }
    });
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
      if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "La note doit être entre 1 et 5" }); // Vérifie si la note est valide
      }

      const book = await Book.findById(req.params.id); // Recherche le livre par ID
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" }); // Réponse si le livre n'est pas trouvé
      }

      const userIdArray = book.ratings.map((rating) => rating.userId);
      if (userIdArray.includes(req.auth.userId)) {
        return res.status(403).json({ message: "Not authorized" }); // Vérifie si l'utilisateur a déjà noté
      }

      book.ratings.push({ ...req.body, grade: rating }); // Ajoute la nouvelle notation

      // Calcul de la moyenne manuellement
      const totalGrades = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );
      book.averageRating = (totalGrades / book.ratings.length).toFixed(1); // Met à jour la note moyenne

      await book.save();
      return res.status(201).json(book); // Réponse en cas de succès
    } catch (error) {
      return res.status(500).json({ error: "Erreur lors de la création de la notation" }); // Réponse en cas d'erreur
    }
};

// Fonction pour récupérer les livres avec la meilleure note
exports.getBestRating = (req, res, next) => {
    Book.find()
      .sort({ averageRating: -1 }) // Trie par note moyenne décroissante
      .limit(3) // Limite à 3 résultats
      .then((books) => res.status(200).json(books)) // Réponse en cas de succès
      .catch((error) => res.status(404).json({ error })); // Réponse en cas d'erreur
};
