const mongoose = require('mongoose');
const { Schema } = mongoose;

const WarrantSchema = new Schema({
    name: { type: String, require: true, unique: true },
    image: { type: String, require: true },
    remark: { type: Array },
    created: { type: Date, default: Date.now() },
});

const Warranty = mongoose.model('warranty', WarrantSchema);
module.exports = Warranty;
