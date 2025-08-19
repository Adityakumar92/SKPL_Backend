const Building = require('../../Models/Building/building.model');
const Site = require('../../Models/Site/site.model');

// ✅ Create a building
const createBuilding = async (req, res) => {
    try {
        const { building, floor, location, site_id } = req.body;

        if (!building || !floor || !location || !site_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const site = await Site.findById(site_id);
        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }

        const newBuilding = new Building({ building, floor, location, site_id });
        await newBuilding.save();

        res.status(201).json({ message: 'Building created successfully', building: newBuilding });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get all buildings
const getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.find().populate('site_id', 'site');
        res.status(200).json({ buildings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//  Get buildings detail by id
// code it

// ✅ Update a building
const updateBuilding = async (req, res) => {
    try {
        const { id } = req.params;
        const { building, floor, location, site_id } = req.body;

        if (site_id) {
            const site = await Site.findById(site_id);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
        }

        const updatedBuilding = await Building.findByIdAndUpdate(
            id,
            { building, floor, location, site_id },
            { new: true, runValidators: true }
        );

        if (!updatedBuilding) {
            return res.status(404).json({ message: 'Building not found' });
        }

        res.status(200).json({ message: 'Building updated successfully', building: updatedBuilding });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete a building
const deleteBuilding = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Building.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Building not found' });
        }

        res.status(200).json({ message: 'Building deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createBuilding,
    getAllBuildings,
    updateBuilding,
    deleteBuilding
};

