const jwt = require('jsonwebtoken'); // Import du module jsonwebtoken pour gérer les JWT (JSON Web Tokens)

module.exports = (req, res, next) => {
    try {
        // Récupération du token depuis l'en-tête d'autorisation
        const token = req.headers.authorization.split(' ')[1];
        
        // Vérification et décryptage du token avec la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        
        // Extraction de l'ID utilisateur depuis le token décrypté
        const userId = decodedToken.userId;
        
        // Ajout de l'ID utilisateur à l'objet req.auth pour une utilisation ultérieure
        req.auth = { userId: userId };
        
        // Passage au middleware suivant
        next();
    } catch (error) {
        // En cas d'erreur (token invalide ou absent), renvoie une réponse 401 (non autorisé)
        res.status(401).json({ error });
    }
};
