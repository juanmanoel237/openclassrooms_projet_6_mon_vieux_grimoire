const bookCtrl = require("../controllers/books")

router.post('/', bookCtrl.createBook);