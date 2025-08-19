const express = require('express');
const auth = require('../../Middleware/auth');
const { createRole, getAllRoles, updateRoleDetails, deleteRole } = require('../../Controller/Management/role.controller');

const router = express.Router();

// Routes
router.post('/', createRole); // Add new role
router.get('/', getAllRoles); // Get all roles
router.patch('/:roleId', auth, updateRoleDetails); // Update role by ID
router.delete('/:roleId', auth, deleteRole); // Delete role by ID

module.exports=router;