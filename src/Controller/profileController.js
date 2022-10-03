

const likesModel = require("../Models/likesModel")
const validator = require("../Validator/validator");
const userModel =  require("../Models/userSchema");
const postModel = require("../Models/postModel");
const followersModel = require("../Models/followUnfollowModel")



const profile = async (req, res) =>{

    try {

        const userId = req.params.userId
        const user = await userModel.findById({_id:userId}).lean()
        if(!user){
            return res.status(404).send({status:false, msg:"ERROR! user not found"})
        }
        const followerInfo = await followersModel.findOne({userId:user.id})
        const post = await postModel.find({userId:userId, isDeleted:false});

        let likes = [];
        let postCount = post.length
        for (let i = 0; i < post.length; i++){
            likes = [...likes, ...post[i].like ]
        }
        let profiledata;
        if(followerInfo){
         profiledata = {
            profileImage:user.profileImage,
            name:user.name,
            user_name:user.user_name,
            email:user.email,
            phone:user.phone,
            Profile:user.profile,
            followersCount : followerInfo.followersCount ,
            followingCount : followerInfo.followingCount ,
            postCount : postCount,
            allLikes : likes
        }
    }else{
         profiledata = {
            profileImage:user.profileImage,
            name:user.name,
            user_name:user.user_name,
            email:user.email,
            phone:user.phone,
            Profile:user.profile,
            followersCount : 0,
            followingCount : 0 ,
            postCount : postCount,
            allLikes : likes
        }

    }


        return res.status(200).send({status:true, profileData: profiledata}) 
    } catch (error) {

        console.log(error)
        return res.status(500).send({status:false, error:error.message})
        
    }

}


module.exports.profile = profile;

