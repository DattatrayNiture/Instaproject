
const mongoose  = require("mongoose")
const bcrypt = require('bcrypt')


const userSchema =  new mongoose.Schema({
    
        id:{type:Number,required:true},
        name: {type:String, required:true,trim:true},
        user_name: {type:String, required:true,unique:true,trim:true},
        email: {type:String, required:true,unique:true},
        profileImage: {type:String, required:true}, // s3 link
        gender:{type:String,enum:["Male", "Female", "Transgender"]},
        phone: {type:String, required:true, unique:true}, 
        password: {type:String, required:true}, // encrypted password
        Profile:{type:String, enum:["private", "public"], default:"public"}
    },{timestamps:true}
              
)


//here we are using bcrypt password hashing 
userSchema.pre('save', async function(next){ // here we can not use fatarrow function because here we are using this keyword
  try {
    const salt = await bcrypt.genSalt(10) // idealy minimum 8 rounds required here we use 10 rounds  
    //below we are generating hashPassword by applying 10 rounds on it
    const hashPassword = await bcrypt.hash(this.password,salt)
    this.password = hashPassword
    next()

  } catch (error) {

    next(error)
  }
})


module.exports = mongoose.model('User', userSchema)
















