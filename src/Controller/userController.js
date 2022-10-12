
const userModel = require("../Models/userSchema");
const validator = require("../Validator/validator");
const jwt = require("jsonwebtoken");
const validatEmail = require("validator")
const aws = require("aws-sdk");
const bcrypt = require('bcryptjs')

// aws.config.update(
//     {
//         accessKeyId: "AKIAY3L35MCRVFM24Q7U",
//         secretAccessKey: "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",
//         region: "ap-south-1"
//     }
// )


// let uploadFile = async (file) => {
//     return new Promise(async function (resolve, reject) {
//         // Promise.reject(reason) Returns a new Promise object that is rejected with the given reason.
//         // Promise.resolve(value) Returns a new Promise object that is resolved with the given value.
//         let s3 = new aws.S3({ apiVersion: "2006-03-01" }) //we will be using s3 service of aws

//         var uploadParams = {
//             ACL: "public-read",
//             Bucket: "classroom-training-bucket",
//             Key: "radhika/" + file.originalname,
//             Body: file.buffer
//         }

//        s3.upload(uploadParams, function (err, data) {
//             if (err) {
//                 return reject({ "error": err })
//             }

//             console.log(data)
//             console.log(" file uploaded succesfully ")
//             return resolve(data.Location) // HERE
//         })

//     })
// }







const multer = require('multer')
const path = require('path') // node built-in path package

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/public/')
    },
    filename: function (req, file, cb) {
        console.log("filename")
        console.log(file, "filename")
        // generate the public name, removing problematic characters
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        const timestamp = Date.now()
        console.log("destination")
        console.log(req, file)
        const extension = path.extname(file.originalname).toLowerCase()
        cb(null, originalName + '_' + timestamp + extension)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 55 * 1024 * 1024 }, // 1 Mb
    fileFilter: (req, file, callback) => {
        console.log("2 ok")

        const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg', 'mp4']
        if (!(acceptableExtensions.some(extension =>
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    }
})










const registerUser = async function (req, res) {
    try {

        const requestBody = req.body;
        if (!validator.isValidBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "ERROR! : request body is empty" });
        } else {

            const { name, user_name, phone, email, gender, password, confirmPassword, Profile } = requestBody;
            let isName = /^[A-Za-z ]*$/;

            if (!validator.isValid(name)) {
                return res.status(400).send({ status: false, message: "please enter name" });
            }
            if (!isName.test(name)) {
                return res.status(422).send({ status: false, message: "enter valid name" });
            }
            if (!validator.isValid(user_name)) {
                return res.status(400).send({ status: false, message: "please enter name" });
            }
            const isUserNameAlreadyUsed = await userModel.findOne({
                user_name,
                isDeleted: false,
            });
            if (isUserNameAlreadyUsed) {
                return res.status(409).send({
                    status: false,
                    message: `${user_name} is already used so please put valid input`,
                });
            }
            if (!validator.isValid(phone)) {
                return res.status(400).send({ status: false, message: "enter valid phone" });
            }
            if (!validator.isValidPhone(phone)) {
                return res.status(400).send({ status: false, message: "Invaid Number:please enter 10 digit Indian Phone numbers ", });
            }
            const isPhoneAlreadyUsed = await userModel.findOne({ phone, isDeleted: false, });
            if (isPhoneAlreadyUsed) {
                return res.status(409).send({ status: false, message: `${phone} this phone number is already used so please put valid input`, });
            }
            if (!validator.isValid(email)) {
                return res.status(400).send({ status: false, message: "email is not present in input request" });
            }
            if (!validatEmail.isEmail(email)) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })
            }

            if (!/^[^A-Z]*$/.test(email)) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })
            }
            const genderFrom = ["Male", "Female", "Transgender"]
            if (!validator.isValid(gender)) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST gender is invalid please select from Male ,Female ,Transgender" })
            }
            if (genderFrom.indexOf(gender) == -1) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST gender is invalid please select from Male ,Female ,Transgender " })

            }
            const profileFrom = ["private", "public"]
            if (!validator.isValid(Profile)) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST Profile status is invalid" })
            }
            if (profileFrom.indexOf(Profile) == -1) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST Profile status is invalid" })

            }
            const isEmailAlreadyUsed = await userModel.findOne({
                email,
                isDeleted: false,
            });

            if (isEmailAlreadyUsed) {
                return res.status(409).send({
                    status: false,
                    message: `${email} is already used so please put valid input`,
                });
            }
            if (!validator.isValid(password)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter valid password" });
            }
            if (!validator.isValidPassword(password)) {
                return res.status(400).send({
                    status: false,
                    msg: "Please enter Minimum eight characters password, at least one uppercase letter, one lowercase letter, one number and one special character length : min=8, max=16"

                })
            }
            if (!validator.isValid(confirmPassword)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter valid confirmpassword" });
            }

            if (password !== confirmPassword) {
                return res
                    .status(422)
                    .send({
                        status: false,
                        message: "password does not match with confirm password",
                    });
            }

            delete req.body["confirmPassword"];




            const media = {
                Image: [],
                Video: []
            }

            let files = req.files // file is the array

            if (files && files.length > 0) {

                const acceptableImageExtensions = ['png', 'jpg', 'jpeg', 'jpg']
                const acceptableVideoExtensions = ['mp4', 'mkv']
                for (let post of req.files) {
                    if ((acceptableImageExtensions.some(extension =>
                        path.extname(post.originalname).toLowerCase() === `.${extension}`)
                    )) {
                        media.Image.push(post.path)

                    }
                    if ((acceptableVideoExtensions.some(extension =>
                        path.extname(post.originalname).toLowerCase() === `.${extension}`)
                    )) {
                        media.Video.push(post.path)

                    }
                }
            } else {
                return res.status(400).send({ msg: "No file found in request for profileImage" })
            }

            requestBody.profileImage = media.Image[0];



            // creating new id for user
            // First check the table length
            let id;
            const data = await userModel.find();
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
            requestBody.id = id;
            const user = new userModel(requestBody)

            const userData = await user.save(requestBody);
            return res.status(201).send({
                status: true,
                message: "successfully saved user data",
                data: userData,
            });

        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, Error: error.message });
    }
};
const loginUser = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!validator.isValid(email)) {
            return res
                .status(400)
                .send({ status: false, message: "enter valid email" });
        }
        if (!validatEmail.isEmail(email)) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })

        }
        if (!/^[^A-Z]*$/.test(email)) {

            return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })

        }
        if (!validator.isValid(password)) {
            return res
                .status(400)
                .send({ status: false, message: "enter valid password" });
        }
        let user = await userModel.findOne({ email: email });
        let isValidPassword
        if (user) {
            // this line will return Boolean result
            isValidPassword = await bcrypt.compare(req.body.password, user.password)

        }
        if (!isValidPassword)
            return res.status(404).send({
                status: false,
                msg: "email or the password is not correct or user with this email is not present",
            });
        let token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                iat: new Date().getTime() / 1000
            },
            "IEJSFKG7857843HGDF2TVFDVDNDNHGERGGAI343734RYF743",
            {
                expiresIn: "221m",
            }
        );
        const userLogin = {
            userId: user._id,
            token: token
        }

        res.setHeader("Authorization", 'Bearer' + ' ' + token);
        return res.status(200).send({ status: true, message: "User login successfull", data: userLogin });

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message });
    }
};



const updateUser = async function (req, res) {
    try {
        const userId = req.params.userId
        let requestBody = req.body
        // console.log(req, req.body, req.file, req.files)
        if (!validator.isValidBody(req.body) && !req.files) {
            return res.status(400).send({ status: false, message: "ERROR! : request body is empty" });
        }

        let { name, user_name, phone, email, password, profileImage } = requestBody;


        if (name) {
            let isName = /^[A-Za-z ]*$/;

            if (!validator.isValid(name)) {
                return res
                    .status(400)
                    .send({ status: false, message: "please enter name" });
            }
            if (!isName.test(name)) {
                return res
                    .status(422)
                    .send({ status: false, message: "enter valid name" });
            }

        }

        if (user_name) {

            if (!validator.isValid(user_name)) {
                return res
                    .status(400)
                    .send({ status: false, message: "please enter user_name" });
            }
            const duplicate = await userModel.find({ user_name: user_name })
            if (duplicate.length) {
                return res.status(409).send({ status: true, msg: "user name is already used" })
            }

        }

        if (phone) {
            if (!validator.isValid(phone)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter valid phone" });
            }

            if (!validator.isValidPhone(phone)) {
                return res
                    .status(422)
                    .send({
                        status: false,
                        message:
                            "Invaid Number:please enter 10 digit Indian Phone numbers ",
                    });
            }
            const isPhoneAlreadyUsed = await userModel.findOne({
                phone
            });

            if (isPhoneAlreadyUsed) {
                return res.status(409).send({
                    status: false,
                    message: `${phone} this phone number is already used so please put valid input`,
                });
            }

        }

        if (email) {

            if (!validator.isValid(email)) {
                return res
                    .status(400)
                    .send({ status: false, message: "email is not present in input request" });
            }
            if (!validatEmail.isEmail(email)) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })
            }
            if (!/^[^A-Z]*$/.test(email)) {
                return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })
            }
            const isEmailAlreadyUsed = await userModel.findOne({
                email
            });

            if (isEmailAlreadyUsed) {
                return res.status(409).send({
                    status: false,
                    message: `${email} is already used so please put valid input`,
                });
            }

        }
        if (password) {
            if (!validator.isValid(password)) {
                return res.status(400).send({ status: false, message: "enter valid password" });
            }
            if (!validator.isValidPassword(password)) {
                return res.status(400).send({ status: false, msg: "Please enter Minimum eight characters password, at least one uppercase letter, one lowercase letter, one number and one special character" })
            }

            const salt = await bcrypt.genSalt(10) // idealy minimum 8 rounds required here we use 10 rounds
            const hashPassword = await bcrypt.hash(password, salt)
            requestBody.password = hashPassword
        }


        // let uploadedFileURL;

        // let files = req.files // file is the array

        // if (files && files.length > 0) {

        //     uploadedFileURL = await uploadFile(files[0])

        //     if (uploadedFileURL) {
        //         req.body.profileImage = uploadedFileURL
        //     } else {
        //         return res.status(400).send({ status: false, message: "error uploadedFileURL is not present" })
        //     }
        // }










        const media = {
            Image: [],
            Video: []
        }

        let files = req.files // file is the array

        if (files && files.length > 0) {

            const acceptableImageExtensions = ['png', 'jpg', 'jpeg', 'jpg']
            const acceptableVideoExtensions = ['mp4', 'mkv']
            for (let post of req.files) {
                if ((acceptableImageExtensions.some(extension =>
                    path.extname(post.originalname).toLowerCase() === `.${extension}`)
                )) {
                    media.Image.push(post.path)
                    req.body.profileImage = post.path;
                    break;

                }
                if ((acceptableVideoExtensions.some(extension =>
                    path.extname(post.originalname).toLowerCase() === `.${extension}`)
                )) {
                    media.Video.push(post.path)

                }
            }
        } //else {
        //             return res.status(400).send({ msg: "No file found in request for profileImage" })
        // }








        const update = req.body




        const updatedData = await userModel.findOneAndUpdate({ _id: userId }, update, { new: true })
        if (updatedData) {
            return res.status(200).send({ status: true, msg: "user profile updated", data: updatedData })
        } else {
            return res.status(400).send({ status: false, msg: "userid does not exist" })
        }



    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }


}



















module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
module.exports.updateUser = updateUser;











