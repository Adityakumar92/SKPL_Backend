const ItemMaterial = require('../../Models/Item_Material/itemMaterial');
const Checklist = require('../../Models/CheckList/checklist.model');

// ✅ Create ItemMaterial
const createItemMaterial = async (req, res) => {
    try {
        const { item, checklist_id } = req.body;

        if (!item || !checklist_id) {
            return res.status(400).json({ message: 'Item and checklist_id are required' });
        }

        const checklist = await Checklist.findById(checklist_id);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        const newItem = new ItemMaterial({ item, checklist_id });
        await newItem.save();

        res.status(201).json({ message: 'ItemMaterial created successfully', itemMaterial: newItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get All ItemMaterials
const getAllItemMaterials = async (req, res) => {
    try {
        const items = await ItemMaterial.find().populate('checklist_id', 'name');
        res.status(200).json({ itemMaterials: items });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update ItemMaterial
const updateItemMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { item, checklist_id } = req.body;

        if (checklist_id) {
            const checklist = await Checklist.findById(checklist_id);
            if (!checklist) {
                return res.status(404).json({ message: 'Checklist not found' });
            }
        }

        const updatedItem = await ItemMaterial.findByIdAndUpdate(
            id,
            { item, checklist_id },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'ItemMaterial not found' });
        }

        res.status(200).json({ message: 'ItemMaterial updated successfully', itemMaterial: updatedItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Delete ItemMaterial
const deleteItemMaterial = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ItemMaterial.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'ItemMaterial not found' });
        }

        res.status(200).json({ message: 'ItemMaterial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createItemMaterial,
    getAllItemMaterials,
    updateItemMaterial,
    deleteItemMaterial
};
