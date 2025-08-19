const Activity = require('../../Models/Activity/activity.model');
const Checklist = require('../../Models/CheckList/checklist.model');

// ✅ Create Activity
const createActivity = async (req, res) => {
    try {
        const { activity, checklist_id } = req.body;

        if (!activity || !checklist_id) {
            return res.status(400).json({ message: 'Activity and checklist_id are required' });
        }

        const checklistExists = await Checklist.findById(checklist_id);
        if (!checklistExists) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        const newActivity = new Activity({ activity, checklist_id });
        await newActivity.save();

        res.status(201).json({ message: 'Activity created successfully', activity: newActivity });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get All Activities
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find().populate('checklist_id', 'name');
        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update Activity
const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity, checklist_id } = req.body;

        if (checklist_id) {
            const checklistExists = await Checklist.findById(checklist_id);
            if (!checklistExists) {
                return res.status(404).json({ message: 'Checklist not found' });
            }
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            { activity, checklist_id },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete Activity
const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Activity.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createActivity,
    getAllActivities,
    updateActivity,
    deleteActivity
};
