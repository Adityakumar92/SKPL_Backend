const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const { createBuilding, getAllBuildings, updateBuilding, deleteBuilding } = require('../../Controller/Management/building.controller');

// POST - Create a new building
router.post('/', auth, createBuilding);

// GET - Get all buildings
router.get('/', auth, getAllBuildings);

// PUT - Update a building by ID
router.put('/:id', auth, updateBuilding);

// DELETE - Delete a building by ID
router.delete('/:id', auth, deleteBuilding);

module.exports = router;
