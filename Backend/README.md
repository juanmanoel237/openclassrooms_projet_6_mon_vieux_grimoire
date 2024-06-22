# Mon Vieux Grimoire

## Description

Le backend est créé pour un site web de notations de livres. Le serveur tourne sur le port 4000.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :

- [Node.js](https://nodejs.org/) (version x.x.x ou supérieure)
- [MongoDB](https://www.mongodb.com/)

## Configuration de la base de données

1. Créez une base de données MongoDB.
2. Créez un fichier `.env` à la racine du projet pour y cacher votre URI fourni par MongoDB pour la connexion. Par exemple :

    ```env
    MONGO_URI=mongodb://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
    JWT_SECRET=RANDOM_TOKEN_SECRET
    PORT=4000
    ```

3. Assurez-vous de cacher votre fichier `.env` dans un `.gitignore` pour qu'il ne soit pas poussé vers le dépôt.

    ```plaintext
    .env
    ```

## Démarrage

Commande : `nodemon server`

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo
npm install
