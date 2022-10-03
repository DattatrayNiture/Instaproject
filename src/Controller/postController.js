const path = require("path");
const postModel = require("../Models/postModel");
const userModel = require("../Models/userSchema");
const moment = require('moment')
const validator = require("../Validator/validator")
//const aws = require("aws-sdk");
//const { response } = require("express");
const mongoose = require("mongoose")
//const paginate = require("mongoose-aggregate-paginate-v2");

const createPost = async function (req, res) {
  try {
    let { post, text, status, tags, friendTags } = req.body;
    const userId = req.params.userId;
    if (!text || !req.params.userId) {
      return res.status(400).send({ status: true, msg: "ERROR! : BAD REQUEST please fill all fields" })
    }
    req.body.tags = JSON.parse(tags)
    req.body.friendTags = JSON.parse(friendTags)
    let user = await userModel.findById(userId)
    if (!user) res.satus(404).send({ msg: "user with this id is not valid" })

    let uploadedFileURL =[];


    req.body.post = {
      image:[],
      videos:[]
   }



    let files = req.files // file is the array
            
    if (files && files.length > 0) {

const acceptableImageExtensions = ['png', 'jpg', 'jpeg', 'jpg'];
const acceptableVideoExtensions = ['mp4','mkv'];

for(let post of req.files){
if ((acceptableImageExtensions.some(extension => 
   path.extname(post.originalname).toLowerCase() === `.${extension}`)
)){
   req.body.post.image.push(post.path)

}
if ((acceptableVideoExtensions.some(extension => 
   path.extname(post.originalname).toLowerCase() === `.${extension}`)
)){
  req.body.post.videos.push(post.path)

}
}
}
else {
           return res.status(400).send({ msg: "No file found in request for profileImage" })
}


    let id;
    const data = await postModel.find();
    if (data.length === 0) {
      id = 1
      // then post your query along with your id  
    }
    else {
      // find last item and then its id
      const length = data.length
      const lastItem = data[length - 1]
      const lastItemId = lastItem.id // or { id } = lastItem
      id = lastItemId + 1
    }
    req.body.id = id
    
    req.body.userId = userId
    let savedData = await postModel.create(req.body)
    res.status(201).send({ status: true, data: savedData })

  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })

  }
}

const getPost = async (req, res) => {

  try {


    let user = await userModel.findById(req.query.userId)
    if (!user) res.satus(404).send({ msg: "user with this id is not valid" })
    let Id = user.id
    if (req.query.page && req.query.limit) {
      const userId =  mongoose.Types.ObjectId(req.query.userId); // req.query.userId
       const condition = postModel.aggregate([
        { '$match'    : {$and: [{userId: { $ne:userId}},{status :"Public"}, {isDeleted:false } ]}},
        {
          '$addFields': {
            you_like_post: {
                  $cond: [{ $in: [Id,"$like"] }, "Yes", "No"]
                 // $cond: [{ $eq:["$like",'15'] }, "Yes", "No"]
              }
          }
      },// { $sample: { size: 2 }},
        { '$sort'     : { createdAt: -1} },
        // { '$facet'    : {
        //     metadata: [ { $count: "total" },{ $addFields: { page: Number(req.query.page) } } ],
        //     data: [ { $limit: Number(req.query.limit) } ] // add projection here wish you re-shape the docs
        // } }
    ] )
    postModel.aggregatePaginate(condition, { page: req.query.page, limit: req.query.limit })
      //postModel.paginate({}, { page: req.query.page, limit: req.query.limit })
       .then((response) => {
          return res.status(200).send({ status: true, data: response })
       })
        .catch((error) => {
          return res.status(400).send({ status: true, msg: error.message })
        })
    } else {
      postModel.find({ userId: { $ne: req.query.userId } ,status :"Public"})
        .then((response) => {
          return res.status(200).send({ status: true, data: response })
        })
        .catch((error) => {
          return res.status(400).send({ status: true, msg: error.message })
        })
    }
  } catch (error) {

    console.log(error)
    return res.status(500).send({ mgs: "Error", error: error.message })

  }
}



const updatePost = async function (req, res) {
  try {
    let postId = req.body.postId

    if (!postId) res.status(400).send({ status: false, msg: "Bad Request" })
    let postObject = await postModel.findOne({ _id: postId, isDeleted: false })
    if(!postObject){
      return res.status(404).send({status:false, msg:"post with this ID not present"})
    }
    if(JSON.stringify(postObject.userId) != JSON.stringify(req.params.userId)){

      return res.status(400).send({status:false, msg:"this post is not belong's to this user"})

    }
    let { text, tags, friendTags, status } = req.body;
    if (tags || friendTags) {
      

      if (tags) {
        tags = JSON.parse(tags)
        let dbtags = postObject.tags

        tags = [...dbtags, ...tags]
        tags = tags.filter((val, index, arr) => arr.indexOf(val) == index)
        req.body.tags = tags;


      }
      if (friendTags) {

        friendTags = JSON.parse(friendTags)

        let dbfriend = postObject.friendTags;
        friendTags = [...dbfriend, ...friendTags];
        friendTags = friendTags.filter((val, index, arr) => arr.indexOf(val) == index)
        req.body.friendTags = friendTags

      }

      if (status) {
        if (status != "Public" || status != "Private") {
          return res.status(400).send({ status: false, msg: "please fill valid status" })
        }
      }
    }
    await postModel.updateOne({ _id: postId, isDeleted: false }, req.body)

    let postCollection = await postModel.find({ _id: postId })

    if (!postCollection) { return res.status(404).send({ status: false, msg: "Data is Not updated" }) }

    return res.status(200).send({ status: true, msg: postCollection })

  } catch (err) {
    console.log("This is the error :", err.message)
    return res.status(500).send({ msg: "Error", error: err.message })
  }
}



const deletePost = async function (req, res) {
  try {
    let postId = req.params.postId

    await postModel.find({ _id: postId, isDeleted: false })
    let date = new Date()

    await postModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: date }, { new: true })
    return res.status(200).send({ status: true, msg: "Done" })


  }
  catch (error) {
    console.log(error)
    return res.send({ msg: error.message })
  }
}




module.exports.createPost = createPost
module.exports.getPost = getPost
module.exports.deletePost = deletePost
module.exports.updatePost = updatePost