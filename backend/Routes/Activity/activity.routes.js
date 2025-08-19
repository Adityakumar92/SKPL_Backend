const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/auth');
const { createActivity, getAllActivities, updateActivity, deleteActivity } = require('../../Controller/Management/activity.controller');


// ✅ Create a new activity
router.post('/', auth, createActivity);

// ✅ Get all activities
router.get('/', auth, getAllActivities);

// ✅ Update an activity
router.put('/:id', auth, updateActivity);

// ✅ Delete an activity
router.delete('/:id', auth, deleteActivity);

module.exports = router;
