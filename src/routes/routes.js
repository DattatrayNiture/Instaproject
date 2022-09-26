const express = require('express')
const router = express.Router()
const userController = require("../Controller/userController");
const postCntroller = require("../Controller/postController")
const followUnfollowController = require("../Controller/followUnfollowController")
const likesController = require("../Controller/likesController")
const profileCOntroller = require("../Controller/profileController")
const getLikedPost = require("../Controller/getLikedPost");
const middleware = require("../Middleware/auth")

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.put('/updateUser/:userId', middleware.authentication,middleware.authorization, userController.updateUser)


 router.post('/post/:userId',  middleware.authentication,middleware.authorization, postCntroller.createPost)
 router.put('/updatepost/:userId',  middleware.authentication,middleware.authorization, postCntroller.updatePost)
 router.get('/getpost', middleware.authentication,middleware.authorization, postCntroller.getPost)
 router.delete('/deletepost/:userId', middleware.authentication,middleware.authorization, postCntroller.deletePost)

 router.post('/follow/:userId', middleware.authentication,middleware.authorization, followUnfollowController.follow);
 router.post('/likes/:userId', middleware.authentication,middleware.authorization, likesController.likes);

 router.get('/profile/:userId', middleware.authentication,middleware.authorization, profileCOntroller.profile);
 router.get('/userlikedpost/:userId',middleware.authentication,middleware.authorization, getLikedPost.myLikedPost);

router.get("*", async function(req,res){
    return res.status(404).send({status:false, message:"page not found"})
})


module.exports = router