const Checklist = require('../../Models/CheckList/checklist.model');

// ✅ Create a checklist
const createChecklist = async (req, res) => {
  try {
    const {
      name,
      icon,
      buildingReq,
      activityReq,
      itemMaterialReq,
      remarkReq,
      workStatusReq,
      itemDescription,
      photoUrlReq,
      pdfUrlReq
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Checklist name is required' });
    }

    const newChecklist = new Checklist({
      name,
      icon,
      buildingReq,
      activityReq,
      itemMaterialReq,
      remarkReq,
      workStatusReq,
      itemDescription,
      photoUrlReq,
      pdfUrlReq,
    });

    await newChecklist.save();

    res.status(201).json({
      message: 'Checklist created successfully',
      checklist: newChecklist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ✅ Get all checklists
const getAllChecklist = async (req, res) => {
    try {
        const checklists = await Checklist.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json({ checklists });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update a checklist
const updateChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const {
      name,
      icon,
      buildingReq,
      activityReq,
      itemMaterialReq,
      remarkReq,
      workStatusReq,
      itemDescription,
      photoUrlReq,
      pdfUrlReq
    } = req.body;

    const updatedChecklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        name,
        icon,
        buildingReq,
        activityReq,
        itemMaterialReq,
        remarkReq,
        workStatusReq,
        itemDescription,
        photoUrlReq,
        pdfUrlReq
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedChecklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    res.status(200).json({
      message: 'Checklist updated successfully',
      checklist: updatedChecklist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ✅ Delete a checklist
const deleteChecklist = async (req, res) => {
    try {
        const { checklistId } = req.params;

        const deletedChecklist = await Checklist.findByIdAndDelete(checklistId);

        if (!deletedChecklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        res.status(200).json({ message: 'Checklist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createChecklist,
    getAllChecklist,
    updateChecklist,
    deleteChecklist
};
