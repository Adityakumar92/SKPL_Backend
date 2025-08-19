const mongoose = require('mongoose');

const ItemMaterialSchema = new mongoose.Schema(
    {
        item : {
            type: String,
            require: true,
        },
        checklist_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Checklist',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('ItemMaterial', ItemMaterialSchema);