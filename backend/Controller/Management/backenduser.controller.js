const BackendUser = require("../../Models/Auth/backenduser.model");
const RolePermission = require("../../Models/Auth/role_permission");
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { username, email, phone, role_id, password } = req.body;

        const user = await BackendUser.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already present' });

        const isRole = await RolePermission.findById(role_id);
        if (!isRole) return res.status(400).json({ message: 'Role not present' });

        if(password.length <6) return res.status(400).json({ message: 'Password must be 6 character' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new BackendUser({
            username,
            email,
            phone: phone?phone : null,
            password: hashedPassword,
            roleAndPermission: role_id,
        });

        await newUser.save();

        console.log(`User sent login email: ${email} and password: ${password} via email and SMS`);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error while creating user' });
    }
};

const getAllUser = async (req, res) => {
    try {
        const roles = await BackendUser.find().populate('roleAndPermission', 'role').sort({ createdAt: -1 });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch roles', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, phone, password, role_id } = req.body;

    if (userId === req.user.id || userId === req.user._id?.toString()) {
        return res.status(403).json({ message: 'You cannot delete your own account' });
    }

    try {
        const isUser = await BackendUser.findById(userId);
        if (!isUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (username) isUser.username = username;
        if (email) isUser.email = email;
        if (phone) isUser.phone = phone;
        if (role_id) isUser.roleAndPermission = role_id;
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            isUser.password = hashedPassword;
        }

        await isUser.save();

        return res.status(200).json({ message: 'User updated successfully', user: isUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Server error while updating user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Prevent a logged-in user from deleting themselves
        if (userId === req.user.id || userId === req.user._id?.toString()) {
            return res.status(403).json({ message: 'You cannot delete your own account' });
        }

        const user = await BackendUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await BackendUser.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Prevent blocking yourself
        if (userId === req.user.id || userId === req.user._id?.toString()) {
            return res.status(403).json({ message: 'You cannot block your own account' });
        }

        const user = await BackendUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        user.isBlocked = true;
        await user.save();

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ message: 'Server error while blocking user' });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await BackendUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isBlocked) {
            return res.status(400).json({ message: 'User is not blocked' });
        }

        user.isBlocked = false;
        await user.save();

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ message: 'Server error while unblocking user' });
    }
};

module.exports = {
    createUser,
    getAllUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser
};