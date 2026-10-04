const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // access tokens expire after 15 minutes
    }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);