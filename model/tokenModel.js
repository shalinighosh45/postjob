const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 8640000
        }
    }
}, { timestamps: true });

const tokenModel = mongoose.model('Token', tokenSchema);
module.exports = tokenModel;
