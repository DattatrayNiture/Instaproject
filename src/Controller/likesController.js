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
        const user = await userModel.findById({ _id: userId, isDeleted: false })

        if (!user) {
            return res.status(404).send({ status: false, msg: "ERROR! user not found" })
        }
        const likesExists = await likesModel.findOne({ userId: userId }).lean()

        const post = await postModel.findById({ _id: postId });

        if (!post) {
            return res.status(404).send({ status: false, msg: "ERROR! post not found" })
        }
        if (request === "like") {
            console.log("likeExists", likesExists)
            if (!likesExists) {
                let likedoc = {
                    userId: userId,
                    likes: [],
                    dislikes: []
                }
                likedoc.likes.push(postId);
                post.like.push(user.id);
                const result = await likesModel.create(likedoc)
                return res.status(200).send({ status: true, msg: "success first like", data: result })
            } else {

                if (post.like.indexOf(user.id) == -1) {
                    likesExists.likes.push(postId)
                    post.like.push(user.id);
                    post.likeCounts++;
                    console.log(likesExists)
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
                likedoc.dislikes.push(postId);
                post.dislike.push(user.id)
                await likesModel.create(likedoc)
                return res.status(200).send({ status: true, msg: "success first dislike" })


            } else {
                if (post.dislike.indexOf(user.id) == -1) {
                    likesExists.dislikes.push(postId)
                    post.dislike.push(user.id)
                    post.dislikeCounts++
                    await likesModel.findByIdAndUpdate({ userId: userId }, likesExists, { new: true })
                    await postModel.findByIdAndUpdate({ _id: postId }, { post })
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
