
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./src/routes/routes')
const multer = require('multer');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
//app.use(multer().any())

// const fileUpload = require('express-fileupload');
// app.use(fileUpload());
mongoose.connect('mongodb+srv://Datta-database:D3443t1432@cluster0.y648p.mongodb.net/BackendProject1?retryWrites=true&w=majority',
 {useNewUrlParser:true}
)
.then(() => {console.log("mongoDb connected")})
.catch((err) => console.log(err))



app.use('/',routes)

app.listen(process.env.PORT || 3000 , function(){
    console.log('express is running on port',+( process.env.PORT || 3000))
});






