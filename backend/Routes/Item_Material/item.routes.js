const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const { createItemMaterial, getAllItemMaterials, updateItemMaterial, deleteItemMaterial } = require('../../Controller/Management/item.controller');


// ✅ Create a new activity
router.post('/', auth, createItemMaterial);

// ✅ Get all activities
router.get('/', auth, getAllItemMaterials);

// ✅ Update an activity
router.put('/:id', auth, updateItemMaterial);

// ✅ Delete an activity
router.delete('/:id', auth, deleteItemMaterial);

module.exports = router;