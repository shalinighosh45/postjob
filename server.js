const express=require('express')
const ejs=require('ejs')
const path=require('path')
const mongoose=require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors')
const multer  = require('multer')
const dotenv = require("dotenv");
const connectDb = require("./config/db");
dotenv.config();
connectDb();
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer')



const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'shuvam',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash());
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'Public')))

app.set('view engine','ejs')
app.set('views','views')



app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(express.static("upload"));


const userAuth = require('./middleware/user/userAuth')
app.use(userAuth.jwtAuth)

const empAuth = require('./middleware/employee/empAuth')
app.use(empAuth.jwtAuth)
 
//defien admin route
const AdminRoute=require('./route/admin/admindashboard')
app.use('/admin',AdminRoute)

//define employee route
const employeeRoute = require('./route/employee/employeeRoute')
app.use('/employee',employeeRoute)

//define user route
const homeRouter=require('./route/user/HomeRoute')
app.use(homeRouter)


//userapi
const userApi = require('./route/api/userApi')
app.use('/user',userApi)

//adminapi
const adminapi=require('./route/api/adminapi')
app.use('/adminapi',adminapi)

//employeeapi
const employeeApi = require('./route/api/employeeApi')
app.use('/employee',employeeApi)

//connect mongodb
const port = process.env.port || 7000;
app.listen(port, () => {
  console.log(`Server is starting at the port http://localhost:${port}`);
});