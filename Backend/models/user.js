const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  // Champ email avec validation et contrainte d'unicité
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // Utilisation de la bibliothèque validator pour valider l'email
      validator: (value) => {
        if (validator.isEmail(value)) {
          // Vérification que le domaine de l'email ne contient pas "yopmail"
          const domain = value.split("@")[1];
          return !domain.includes("yopmail");
        }
        return false; // Email invalide si non conforme
      },
      message: "Adresse e-mail invalide", // Message d'erreur pour email invalide
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// Ajout du plugin uniqueValidator pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
