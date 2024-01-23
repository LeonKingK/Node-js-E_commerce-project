const mongoose = require('mongoose');
const { Schema } = mongoose;

const UnreadSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'user' },
    to: { type: Schema.Types.ObjectId, ref: 'user' },
    created: { type: Date, default: Date.now }
});


const Unread=mongoose.model('unread',UnreadSchema);
module.exports=Unread;