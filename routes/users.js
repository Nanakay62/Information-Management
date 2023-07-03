const express = require('express');
const router = express.Router();
const BookController = require('../controllers/books');

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', BookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Book not found
 */
router.get('/:id', BookController.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *             required:
 *               - title
 *               - author
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/', BookController.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *             required:
 *               - title
 *               - author
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid request body
 */
router.put('/:id', BookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete('/:id', BookController.deleteBook);

module.exports = router;