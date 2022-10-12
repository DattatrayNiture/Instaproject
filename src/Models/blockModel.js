const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blockSchema = new mongoose.Schema({
    
    userId: {
        type: Number,
        ref: 'User',
        required: true,
    },
    userBlocked: [{ type:Number, ref: 'User'}],  
    peopleBlocked: [{ type: Number, ref: 'User'}]

}, { timestamps: true });

module.exports = mongoose.model('Block', blockSchema) 
