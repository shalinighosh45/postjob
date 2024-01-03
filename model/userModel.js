const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Assuming email should be unique
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true
    },
    jobIds: {
        type: [mongoose.Schema.Types.ObjectId], // Corrected the type
        ref: "Job",
        default: []
    },
    applyIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Job",
        default: []
    },
    role: {
        type: String,
        enum: ["admin", "user", "employee"],
        default: "user"
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema); // Capitalized the model name
module.exports = userModel;
