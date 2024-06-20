const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const router = express.Router()

const bookCtrl = require("../controllers/books")


router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.get("/bestrating", bookCtrl.getBestRating);
router.post('/', auth, multer, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.createRating);
router.put('/:id', auth, multer, bookCtrl.upDateBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router;