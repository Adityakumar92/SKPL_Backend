const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
    {
        activity : {
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

module.exports = mongoose.model('Activity', ActivitySchema);