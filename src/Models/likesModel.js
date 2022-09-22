const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const likesSchema = new mongoose.Schema({
    
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],  
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
  



}, { timestamps: true });

module.exports = mongoose.model('Like', likesSchema) //users
