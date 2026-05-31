const express = require('express');
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const router = express.Router();

router.post('/books', addBookHandler);
router.get('/books', getAllBooksHandler);
router.get('/books/:bookId', getBookByIdHandler);
router.put('/books/:bookId', editBookByIdHandler);
router.delete('/books/:bookId', deleteBookByIdHandler);

module.exports = router;
