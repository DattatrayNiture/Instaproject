const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const likesSchema = new mongoose.Schema({
    
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{ type:Number,required: true, ref: 'Post'}],  
    dislikes: [{ type: Number,required: true, ref: 'Post'}]

}, { timestamps: true });

module.exports = mongoose.model('Like', likesSchema) //users
