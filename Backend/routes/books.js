const express = require('express')
const router = express.Router()

const bookCtrl = require("../controllers/books")


router.post('/', bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks)
router.get('/id', bookCtrl.getOneBook)
router.put('/:id', bookCtrl.upDateBook)
router.put('/:id', bookCtrl.deleteBook)

module.exports = router;