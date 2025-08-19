const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const { createSite, getAllSites, getSiteById, updateSite, deleteSite } = require('../../Controller/Management/site.controller');


// POST - Create a new site
router.post('/', auth, createSite);

// GET - All sites
router.get('/',auth, getAllSites);

// GET - Single site by ID
router.get('/:id',auth, getSiteById);

// PUT - Update site by ID
router.put('/:id',auth, updateSite);

// DELETE - Delete site by ID
router.delete('/:id',auth, deleteSite);

module.exports = router;
