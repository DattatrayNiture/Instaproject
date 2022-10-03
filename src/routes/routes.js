const express = require('express')
const router = express.Router()
const userController = require("../Controller/userController");
const postCntroller = require("../Controller/postController")
const followUnfollowController = require("../Controller/followUnfollowController")
const likesController = require("../Controller/likesController")
const profileCOntroller = require("../Controller/profileController")
const getLikedPost = require("../Controller/getLikedPost");
const middleware = require("../Middleware/auth");
const media = require("../Middleware/media")
























// const multer = require("multer");
// const imageModel = require("../Models/imageModel")
// const fs = require("fs");
// const path = require("path");
// const Storage = multer.diskStorage({
//     destination:'upload',
//     // destination:function(req, file, cb) {
//     //     if(!fs.existsSync("public")) {
//     //         fs.mkdirSync("public");
//     //     }
//     //     if(!fs.existsSync("public/videos")) {
//     //         fs.mkdirSync("public/videos");
//     //     }
//     //     cb(null,"public/videos");

//     // },
//     filename: function(req,file,cb){
//         cb(null, Date.now()+ file.originalname);
//     }
// });

// // console.log(JSON.stringify(storage))

// const upload = multer({
//     storage: Storage,
//     // limits: { fileSize: 8 * 1024 * 1024 },
//     // fileFilter: function(req, file, cb){
//     //   //  if(req.body.videos == "true"){
//     //    // console.log(file);
//     //     var ext = path.extname(file.originalname);
//     //     if(ext !== ".mkv" && ext !== ".mp4") {
//     //         return cb(new Error("Only videos are allowed"));
//     //     }
//     //      return cb(null , true);
//       //  req.video = "true"
//     // }else{
//     //     req.video = "false"
//     // }
//    // }
// }).single('testImage')

// router.post('/upload', async (req,res)=>{
//     try{
//     upload(req,res, (err) =>{
//         if(err) {
//             console.log(err)
//         } else {
//             console.log(req.body.name)
//             console.log(req.file)
//             console.log(req)
//             console.log(req.file.filename)
//             const newImage = {
//                 name:req.body.name,
//                 image:{
//                     data:req.file.filename,
//                     contentType:"Image/png",
//                 }
//             }
//             console.log(newImage)
//             const datas = imageModel.create(newImage)
//             return  res.send({msg :"Done", data: datas})
//            // .catch((error) => console.log(error));
//         }
//     })
//     } catch(error){
//         return res.send({error:error})
//     }
// })



//const express = require('express')
// const app = express()
// const path = require('path')
// const multer = require('multer')

// var filestorageEngine = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,'./uploads')
//     },
//     filename:(req,file, cb) => {
//         cb(null,"[maues]-" + file.originalname)
//     }
// })

// var upload = multer({
//     storage:filestorageEngine
// })

// router.post('/fileee', upload.array('file', 3),(req, res) => {
//     try{
//         console.log(req.file)
//         res.send("file uploaded successfully")
        
//     }catch(error){
//         return res.status(500).send({status:false,error:error }) 
//     }
// })

// app.listen(5000, ()=> {
//     console.log("server running")
// })














const multer = require('multer')
const path = require('path') // node built-in path package
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() +'/public/')
    },
    filename: function (req, file, cb) {
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        const timestamp = Date.now()
        const extension = path.extname(file.originalname).toLowerCase()
        cb(null, originalName + '_' + timestamp + extension)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 55 * 1024 * 1024 }, // 1 Mb
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ['png','jpg', 'jpeg', 'jpg','mp4']
        if (!(acceptableExtensions.some(extension => 
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    }
})

const any = ((req, res, next)=>{

    router.use(multer().any())
    next();
})


router.post('/api/upload/single', upload.array('file',12),any, (req, res) => {
    const acceptableImageExtensions = ['png', 'jpg', 'jpeg', 'jpg']
    const acceptableVideoExtensions = ['mp4','mkv']
    const media = {
        Image:[],
        Video:[]
    }

     console.log("requestbody", req.body);
    for(let post of req.files){
    if ((acceptableImageExtensions.some(extension => 
        path.extname(post.originalname).toLowerCase() === `.${extension}`)
    )){
        media.Image.push(post.path)

    }
    if ((acceptableVideoExtensions.some(extension => 
        path.extname(post.originalname).toLowerCase() === `.${extension}`)
    )){
        media.Video.push(post.path)

    }
    }
    res.status(200).json({data1:req.files, data2:media});
})






// router.post('/upload', function(req, res) {
//     console.log(req)
//     console.log(req.files)
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No files were uploaded.');
//     }
  
//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     let sampleFile = req.files.sampleFile;
  
//     // Use the mv() method to place the file somewhere on your server
//     //process.cwd() + '/public/'
//     //sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
//     sampleFile.mv(process.cwd()+'/photos/', function(err) {
//       if (err)
//         return res.status(500).send(err);
  
//       res.send('File uploaded!');
//     });
//   });












 // router.post('/myvideo', async (req, res) => {

    // if (!req.headers.room_id) {
    //     logger.warn(error.MANDATORY_FIELDS);
    //     return res.status(500).send(error.MANDATORY_FIELDS)
    // }

   // try {
        // let storage = multer.diskStorage({
        //     destination: function (req, file, cb) {
        //         let id = req.headers.room_id;
        //         let path = `tmp/daily_gasoline_report/${id}`;
        //         fsextra.mkdirsSync(path);
        //         cb(null, path);
        //     },
        //     filename: function (req, file, cb) {
        //         // console.log(file);
        
        //         let extArray = file.mimetype.split("/");
        //         let extension = extArray[extArray.length - 1];
        //         cb(null, file.fieldname + '-' + Date.now() + "." + extension);
        //     }
        // })
//         var upload = multer({ storage: storage }).array('images', 100);
//         upload(req, res, function (err) {
//             if (err) {
//                 console.log(err);
//                 return res.end("Error uploading file.");
//              } //else {
//             //     res.end("File has been uploaded");
//             // }
//             let result = req.files
//         console.log(req.files)
//         console.log(req.file)
//         res.end("File has been uploaded");
//         });
//         let result = req.files
//         console.log(req.files)
//         console.log(req.file)
//         // error.OK
//         // logger.info(result);
//        // return res.status(200).send(result)

//     } catch (err) {
//         logger.warn(err);
//         console.log(err);
//         return res.status(500).send(error.SERVER_ERROR)
//     }
// })














// //const express = require('express')
// const path = require("path");
// const util = require("util");
// //const router = express.Router()
// const PORT = process.env.PORT || 5002
// const fs = require('fs')

// router.post("/video", async (req, res) => {
//     try {
//         let cname = req.body.name;
//         const file = req.files//.file;
//         console.log(file);
//         const fileName = file[0].originalname;
//         // const size = file.data.length;
//         const size = file[0].size;
//         console.log(size);

//         const extension = path.extname(fileName);
//         console.log(extension);

//         const allowedExtensions = /png|jpeg|jpg|gif/;

//         if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
//         if (size > 5000000) throw "File must be less than 5MB";

//         const md5 = file[0].md5;
//         const URL = md5 + extension;
//         console.log("10")

//         const dir = "./fileuploads/"
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }
//         console.log("11")
//         await util.promisify(file[0].mv)(dir + URL);
//         //await util.promisify
//         console.log("12")

//         res.status(201)

//         if (cname) {
//             res.send({
//                 name: cname,
//                 success: true,
//                 message: "File uploaded successfully!",
//                 url: `http://localhost:${PORT}/fileuploads/` + fileName,
//             });
//         } else {
//             res.send({
//                 success: true,
//                 message: "File uploaded successfully!",
//                 url: `http://localhost:${PORT}/fileuploads/` + fileName,
//             });
//         }

//     } catch (err) {
//         console.log(err);
//         if (err === "Unsupported extension!" || err === "File must be less than 5MB") {
//             res.status(400).send({
//                 success: false,
//                 message: err,
//             });
//         } else {
//             res.status(500).send({
//                 success: false,
//                 message: err,
//             });
//         }

//     }
// });

// module.exports = router















router.post('/register',upload.array('file',1),any, userController.registerUser)
router.post('/login', userController.loginUser)
router.put('/updateUser/:userId', middleware.authentication,middleware.authorization, userController.updateUser);

//  router.post('/postvideo', videoUpload.fields([
//     {
//         name:"videos",
//         maxCount:5
//     }
//  ]), media.createPost);

 router.post('/post/:userId',  middleware.authentication,middleware.authorization,upload.array('file',12),any,postCntroller.createPost)
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


module.exports = router;















