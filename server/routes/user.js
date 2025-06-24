const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/profile', authMiddleware, userController.updateProfile);
router.post('/profile-pic', authMiddleware, userController.uploadProfilePic);
router.post('/delete', authMiddleware, userController.deleteAccount);

module.exports = router; 