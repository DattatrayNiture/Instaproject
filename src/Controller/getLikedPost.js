
const likesModel = require("../Models/likesModel");
const userModel = require("../Models/userSchema");
const postModel = require("../Models/postModel");

const myLikedPost = async (req, res) =>{

    try {

        const userId = req.params.userId

        const user = await userModel.findById({_id:userId}).lean()
        if(!user){
            return res.status(404).send({status:false, msg:"ERROR! user not found"})
        }
        const getLikedPost = await likesModel.findOne({userId:userId});
        const result = []
       
        for(let i=0; i< getLikedPost.likes.length; i++){
       
            let obj = await postModel.findOne({id:getLikedPost.likes[i]})  // getLikedPost.likes[i]
            if(JSON.stringify(obj.userId)!==JSON.stringify(userId)){
                result.push(obj._id)
            }
        }

        return res.status(200).send({status:true, data:result})  
    } catch (error) {

        console.log(error)
        return res.status(500).send({status:false, error:error.message})
        
    }

}

module.exports.myLikedPost = myLikedPost;



