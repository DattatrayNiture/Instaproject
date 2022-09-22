
const postModel = require("../Models/postModel");
const userModel = require("../Models/userSchema");
const moment = require('moment')
const validator = require("../Validator/validator")
const aws = require("aws-sdk");
aws.config.update(
    {
      accessKeyId: "AKIAY3L35MCRVFM24Q7U",
      secretAccessKey: "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",
      region: "ap-south-1"
    }
  )
  let uploadFile = async (file) => {
    return new Promise(async function (resolve, reject) {
     // Promise.reject(reason) Returns a new Promise object that is rejected with the given reason.
     // Promise.resolve(value) Returns a new Promise object that is resolved with the given value.
      let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws  
      var uploadParams = {
        ACL: "public-read",
        Bucket: "classroom-training-bucket", 
        Key: "radhika/" + file.originalname, 
        Body: file.buffer 
      }
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          return reject({ "error": err })
        }
        console.log(data)
        console.log(" file uploaded succesfully ")
        return resolve(data.Location) // HERE
      })
      
    })
  }




const createPost = async function (req, res) {
    try {
        let { post, text, status, tags, friendTags } = req.body;
        const userId = req.params.userId;
        if ( !text || !req.params.userId) {
             return res.status(400).send({ status: true, msg: "ERROR! : BAD REQUEST please fill all fields" }) 
            }
        req.body.tags = JSON.parse(tags)
        req.body.friendTags = JSON.parse(friendTags)
        let user = await userModel.findById(userId)
        if (!user) res.satus(404).send({ msg: "user with this id is not valid" })

    let uploadedFileURL;

    let files = req.files // file is the array
    if (files && files.length > 0) {

      uploadedFileURL = await uploadFile (files[0])

    }
    else {
      return res.status(400).send({ msg: "No file found in request for postImage" })
    }
        req.body.post = uploadedFileURL;
        req.body.userId = userId
        let savedData = await postModel.create(req.body)
        res.status(201).send({ status: true, data: savedData })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })

    }
}



const updatePost = async function (req, res) {
    try {
        let postId = req.body.postId

        if (!postId) res.status(400).send({ status: false, msg: "Bad Request" })
        let { text, tags, friendTags, status } = req.body;
        if (tags || friendTags) {
            let postObject = await postModel.findOne({ _id: postId, isDeleted: false })

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
                if(status != "Public" || status != "Private"){
                    return res.status(400).send({status:false, msg:"please fill valid status"})
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
        return res.status(200).send({status:true, msg:"Done"})


    }
    catch (error) {
        console.log(error)
        return res.send({ msg: error.message })
    }
}




module.exports.createPost = createPost
module.exports.deletePost = deletePost
module.exports.updatePost = updatePost