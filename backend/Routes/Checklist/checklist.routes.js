const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const { createChecklist, getAllChecklist, updateChecklist, deleteChecklist } = require('../../Controller/Management/checklist.controller');


// ✅ Create a checklist
router.post('/', auth, createChecklist);

// ✅ Get all checklists
router.get('/', auth, getAllChecklist);

// ✅ Update a checklist
router.patch('/:checklistId', auth, updateChecklist);

// ✅ Delete a checklist
router.delete('/:checklistId', auth, deleteChecklist);

module.exports = router;
