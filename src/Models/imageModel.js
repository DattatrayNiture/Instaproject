const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const ImageSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    name: {
        data:Buffer,
        contentType: String
    }
    // likes: [{ type:Number, ref: 'Post'}],  
    // dislikes: [{ type: Number, ref: 'Post'}]

}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema) //users
