const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema(
    {
        site:{
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Site', SiteSchema);