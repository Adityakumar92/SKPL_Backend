const express = require('express');
const { createUser, updateUser, deleteUser, getAllUser, blockUser, unblockUser } = require('../../Controller/Management/user.controller');
const { login, verifyToken } = require('../../Controller/Auth/authController');
const auth = require('../../Middleware/auth');

const router = express.Router();

// User login
router.post('/login', login);

router.get("/verify-token", verifyToken);

// Create user
router.post('/', auth, createUser);

// Get all users
router.get('/', auth, getAllUser);

// Update user
router.patch('/:userId', auth, updateUser);

router.patch('/:userId', auth, blockUser);

router.patch('/:userId', auth, unblockUser);

// Delete user
router.delete('/:userId', auth, deleteUser);

module.exports=router;