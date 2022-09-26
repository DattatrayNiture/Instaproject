const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const mongoosePagination = require("mongoose-paginate-v2")

const postSchema = new mongoose.Schema({
    post: {type:String, required:true}, // s3 link
    text: {
        type: String,
        maxlength: 500,
        default:""
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    status:{
        type:String,
        enum:["Public","Private"],
        default:"Private"
    },
    tags: [{
        type: String
    }],
    id:{type:Number,required:true},
    like:[{type: Number, ref: 'User'}],
    likeCounts:{type: Number, default:0},
    dislike:[{type: Number, ref: 'User'}],
    dislikeCounts:{type: Number, default:0},
    
    friendTags: [{ type: Number, ref: 'User'}],
    deletedAt: {
        type: String

    },
    isDeleted: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

postSchema.plugin(mongoosePagination)

module.exports = mongoose.model('Post', postSchema) //users
