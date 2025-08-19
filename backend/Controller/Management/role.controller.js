const RolePermission = require("../../Models/Auth/role_permission");

// ✅ Create Role
const createRole = async (req, res) => {
  try {
    const {
      role,
      dashboard = false,
      submission = 'NA',
      about='NA',
      contact='NA',
      siteManagement = 'NA',
      buildingManagement = 'NA',
      roleManagement = 'NA',
      userManagement = 'NA',
      checklistManagement = 'NA',
      activityManagement = 'NA',
      itemsMaterialManagement = 'NA',
    } = req.body;

    // Check if role name already exists
    const isRoleExist = await RolePermission.findOne({ role: role.trim() });
    if (isRoleExist) {
      return res.status(409).json({ message: 'Role already exists' });
    }

    // Create new role
    const newRole = await RolePermission.create({
      role: role.trim(),
      dashboard,
      submission,
      about,
      contact,
      siteManagement,
      buildingManagement,
      roleManagement,
      userManagement,
      checklistManagement,
      activityManagement,
      itemsMaterialManagement
    });

    res.status(201).json({ message: 'New role created successfully', role: newRole });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Server error while creating role' });
  }
};

// ✅ Get All Roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await RolePermission.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error while fetching roles' });
  }
};

// ✅ Update Role
const updateRoleDetails = async (req, res) => {
  try {
    const { roleId } = req.params;
    const updates = req.body;

    const roleToUpdate = await RolePermission.findById(roleId);
    if (!roleToUpdate) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const loggedInRoleId = String(req.user?.roleAndPermission); // Ensure string comparison

    // Block editing your own role
    if (loggedInRoleId === String(roleId)) {
      return res.status(403).json({ message: 'You cannot update your own role' });
    }

    // Prevent duplicate role names
    if (updates.role) {
      const duplicate = await RolePermission.findOne({
        role: updates.role.trim(),
        _id: { $ne: roleId }
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Another role with this name already exists' });
      }
    }

    // Apply updates
    Object.assign(roleToUpdate, updates);
    if (updates.role) {
      roleToUpdate.role = updates.role.trim();
    }

    await roleToUpdate.save();

    res.status(200).json({ message: 'Role updated successfully', updatedRole: roleToUpdate });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Server error while updating role' });
  }
};

// ✅ Delete Role
const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const loggedInRoleId = String(req.user?.roleAndPermission); // Ensure string comparison

    // Block deleting your own role
    if (loggedInRoleId === String(roleId)) {
      return res.status(403).json({ message: 'You cannot delete your own role' });
    }

    const role = await RolePermission.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await RolePermission.findByIdAndDelete(roleId);

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Server error while deleting role' });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  updateRoleDetails,
  deleteRole
};
