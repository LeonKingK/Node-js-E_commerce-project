const mongoose = require('mongoose');
const { Schema } = mongoose;

let ChildCatSchema = new Schema({
    name: { type: String, require: true, unique: true },
    image: { type: String, require: true },
    subcatid: { type: Schema.Types.ObjectId, ref: 'subcat' },
    created: { type: Date, default: Date.now }
});

let Childcat = mongoose.model('childcat', ChildCatSchema);
module.exports = Childcat;