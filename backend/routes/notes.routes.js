// Notes CRUD routes 
const express = require('express');
const notesController = require('../controllers/notes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');

const router = express.Router();

// All notes routes are protected
router.use(authMiddleware.protect);

router.post('/', validationMiddleware.validateNote, notesController.createNote);
router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNoteById);
router.put('/:id', validationMiddleware.validateNote, notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;