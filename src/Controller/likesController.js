const likesModel = require("../Models/likesModel")
const validator = require("../Validator/validator");
const userModel = require("../Models/userSchema");
const postModel = require("../Models/postModel");

const likes = async (req, res) => {
    try {
        if (!validator.isValidBody(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "ERROR! : request body is empty" });
        }
        const { postId, request } = req.body;
        const userId = req.params.userId
        const user = await userModel.findById({ _id: userId })
        console.log("DDDDDDDD",user)
        if (!user) {
            return res.status(404).send({ status: false, msg: "ERROR! user not found" })
        }
        const likesExists = await likesModel.findOne({ userId: userId }).lean()

        const post = await postModel.findOne({ _id: postId , isDeleted: false}).lean();

        if (!post) {
            return res.status(404).send({ status: false, msg: "ERROR! post not found" })
        }
        if(post.status == "Private"){
            return res.status(400).send({status:true, msg:"this post is private you can not like this post"})
        }
        if (request === "like") {
            console.log("likeExists", likesExists)
            if (!likesExists) {
                let likedoc = {
                    userId: userId,
                    likes: [],
                    dislikes: []
                }
                likedoc.likes.push(post.id);
                post.like.push(user.id);
                post.likeCounts++;
                const result = await likesModel.create(likedoc)
                await postModel.findOneAndUpdate({ _id: postId }, post)
                return res.status(201).send({ status: true, msg: "success first like", data: result })
            } else {

                if (post.like.indexOf(user.id) == -1) {

                    if (post.dislike.indexOf(user.id) !== -1){

                        post.dislike.splice(post.dislike.indexOf(user.id), 1);
                        likesExists.dislikes.splice(likesExists.dislikes.indexOf(post.id), 1)
                        post.dislikeCounts--;
                    }

                    likesExists.likes.push(post.id)
                    post.like.push(user.id);
                    post.likeCounts++;
                    //console.log(likesExists)
                    const result = await likesModel.findOneAndUpdate({ userId: userId }, likesExists, { new: true })
                    await postModel.findOneAndUpdate({ _id: postId }, post)
                    return res.status(200).send({ status: true, msg: "success like", data: result })
                } else {

                    return res.status(200).send({ status: true, msg: "you already like this post" })
                }
            }

        } else if (request === "dislike") {
           
            if (!likesExists) {

                let likedoc = {

                    userId: userId,
                    likes: [],
                    dislikes: []

                }
                likedoc.dislikes.push(post.id);
                post.dislike.push(user.id)
                post.dislikeCounts++
                await likesModel.create(likedoc)
                await postModel.findOneAndUpdate({ _id: postId }, post)
                return res.status(200).send({ status: true, msg: "success first dislike" })


            } else {

                if (post.dislike.indexOf(user.id) == -1) {
                    if (post.like.indexOf(user.id) !== -1){
                        post.like.splice(post.like.indexOf(user.id), 1);
                        likesExists.likes.splice(likesExists.dislikes.indexOf(post.id), 1)
                        post.likeCounts--;
                    }

                    likesExists.dislikes.push(post.id)
                    post.dislike.push(user.id)
                    post.dislikeCounts++
                    await likesModel.findOneAndUpdate({ userId: userId }, likesExists, { new: true })
                    await postModel.findByIdAndUpdate({ _id: postId }, post )
                    return res.status(200).send({ status: true, msg: "success dislike" })
                } else {
                
                    return res.status(200).send({ status: true, msg: "you already dislike this post" })
                }

            }

        } else {
            return res.status(400).send({ status: false, msg: "Bad request " })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })

    }

}


module.exports.likes = likes
