const UserInput = require('../../Models/UserInput/userInput.model');

// ✅ Create a new user input
const createUserInput = async (req, res) => {
    try {
        const {
            building_id,
            activity_id,
            item_id,
            remark,
            item_description,
            work_status,
            photo_url,
            pdf
        } = req.body;

        // You should get user_id from authentication middleware, not headers
        const user_id = req.user?._id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const newUserInput = await UserInput.create({
            user_id,
            building_id,
            activity_id,
            item_id,
            remark,
            item_description,
            work_status,
            photo_url,
            pdf
        });

        const populatedInput = await UserInput.findById(newUserInput._id)
            .populate('user_id', 'username')
            .populate('building_id', 'building')
            .populate('activity_id', 'activity')
            .populate('item_id', 'item');

        res.status(201).json({
            message: 'User input created successfully',
            userInput: populatedInput
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get all user inputs
const getAllUserInputs = async (req, res) => {
    try {
        const userInputs = await UserInput.find()
            .sort({ createdAt: -1 })
            .populate('user_id', 'username')
            .populate('building_id', 'building')
            .populate('activity_id', 'activity')
            .populate('item_id', 'item');

        res.status(200).json({ userInputs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get a user input by ID
const getUserInputById = async (req, res) => {
    try {
        const { id } = req.params;
        const userInput = await UserInput.findById(id)
            .populate('user_id', 'username')
            .populate('building_id', 'building')
            .populate('activity_id', 'activity')
            .populate('item_id', 'item');

        if (!userInput) {
            return res.status(404).json({ message: 'User input not found' });
        }

        res.status(200).json({ userInput });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update a user input
const updateUserInput = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUserInput = await UserInput.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('user_id', 'username')
            .populate('building_id', 'building')
            .populate('activity_id', 'activity')
            .populate('item_id', 'item');

        if (!updatedUserInput) {
            return res.status(404).json({ message: 'User input not found' });
        }

        res.status(200).json({
            message: 'User input updated successfully',
            userInput: updatedUserInput
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete a user input
const deleteUserInput = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUserInput = await UserInput.findByIdAndDelete(id);

        if (!deletedUserInput) {
            return res.status(404).json({ message: 'User input not found' });
        }

        res.status(200).json({ message: 'User input deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Status Approved or Reject
const statusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Reject'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status value. Allowed: Pending, Approved, Reject'
            });
        }

        const updatedUserInput = await UserInput.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('user_id', 'username')
            .populate('building_id', 'building')
            .populate('activity_id', 'activity')
            .populate('item_id', 'item');

        if (!updatedUserInput) {
            return res.status(404).json({ message: 'User input not found' });
        }

        res.status(200).json({
            message: `Status updated to ${status}`,
            userInput: updatedUserInput
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createUserInput,
    getAllUserInputs,
    getUserInputById,
    updateUserInput,
    deleteUserInput,
    statusUpdate
};
