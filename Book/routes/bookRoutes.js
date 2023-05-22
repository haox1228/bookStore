/**
 * @author: Nick Ma, haoxuanm
 * This routes is used to handle endpoints with books, 
 * It calls controller
 */
const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.post('/', bookController.addBook);
router.put('/:ISBN', bookController.updateBook);
router.get("/isbn/:isbn", bookController.retrieveBook);
router.get( "/:isbn", bookController.retrieveBook);
router.get('/:ISBN/related-books', bookController.relatedBooks);




module.exports = router;
