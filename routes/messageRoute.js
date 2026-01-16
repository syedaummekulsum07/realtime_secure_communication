const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createMessage, getMessages, updateMessage, deleteMessage } = require('../controller/messageController');
const router = express.Router()
router.use(authenticateToken);
router.post('/', createMessage);
router.get('/:userId', getMessages);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);
module.exports = router;
