const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const followersSchema = new mongoose.Schema({
    
    userId: {
        type: Number,
        ref: 'User',
        required: true,
        unique:true
    },
    followers: [{ type: Number, ref: 'User'}],
    followersCount :{type:Number,default:0},
    following: [{ type: Number, ref: 'user'}],
    followingCount :{type:Number,default:0}


}, { timestamps: true });

module.exports = mongoose.model('Followers', followersSchema) //users
