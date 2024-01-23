const mongoose = require('mongoose');
const { Schema } = mongoose;

const TagSchema = new Schema({
    name: { type: String, require: true, unique: true },
    image: { type: String, require: true, unique: true },
    created: { type: Date, default: Date.now },
});

let Tag = mongoose.model('tag', TagSchema);
module.exports = Tag;
