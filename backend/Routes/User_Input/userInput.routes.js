const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const { createUserInput, getAllUserInputs, getUserInputById, updateUserInput, deleteUserInput, statusUpdate } = require('../../Controller/User_Input/userinput.controller');

// ✅ Create a new user input
router.post('/', auth, createUserInput
);

// ✅ Get all user inputs
router.get('/', auth, getAllUserInputs);

// ✅ Get a specific user input by ID
router.get('/:id', auth, getUserInputById);

// ✅ Update a specific user input
router.put('/:id', auth, updateUserInput);

// ✅ Delete a specific user input
router.delete('/:id', auth, deleteUserInput);

router.patch('/:id', auth, statusUpdate);

module.exports = router;
