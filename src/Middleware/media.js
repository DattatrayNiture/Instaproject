const multer = require("multer");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        if(!fs.existsSync("public")) {
            fs.mkdirSync("public");
        }
        if(!fs.existsSync("public/videos")) {
            fs.mkdirSync("public/videos");
        }
        cb(null,"public/videos");

    },
    filename: function(req,file,cb){
        cb(null, Date.now()+ file.originalname);
    },
});

const videoUpload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
       // if(req.body.videos == "true"){
        var ext = path.extname(file.originalname);
        if(ext !== ".mkv" && ext !== ".mp4") {
            return cb(new Error("Only videos are allowed"));
        }
        cb(null , true);
      //  req.video = "true"
    // }else{
    //     req.video = "false"
    // }
    }
})

const createPost = async (req, res) =>{
    console.log("error")

    const {name} = req.body;
     let videosPaths = []
     if(Array.isArray(req.files.videos) && req.files.videos.length > 0){
          for(let video of req.files.videos){
          videosPaths.push("/",+ video.path);
        }
     }

    try {
        const data ={
            name,
            videos : videosPaths
        }
        // const data = await Media.create()
        console.log(data)
       return res.send({data})
    } catch (error) {
        console.log(error)
        return res.send({error:error})
    }
}
// const videosPaths = []
      // if(req.video == "true"){
      //   for(let video of req.files.videos){
      //     videosPaths.push("/",+ video.path);
      //   }
      //   uploadedFileURL = videosPaths[0]





// module.exports.videoUpload = videoUpload;
module.exports.createPost = createPost;


























