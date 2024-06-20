const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const router = express.Router()

const bookCtrl = require("../controllers/books")


router.post('/', auth, multer, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks)
router.get('/:id', bookCtrl.getOneBook)
router.put('/:id', auth, bookCtrl.upDateBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router;