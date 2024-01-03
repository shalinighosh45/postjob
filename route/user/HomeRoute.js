const express=require('express');
const route=express.Router()
const HomeController=require('../../controller/User/HomeController')
const auth = require('../../middleware/verify')
const userAuth = require('../../middleware/user/userAuth')
const jobController = require('../../controller/User/jobController')
const singleUpload=require('../../multerConfig')
const blogController=require('../../controller/User/blogController')


route.get('/',[userAuth.jwtAuth],HomeController.userAuth,HomeController.home) 
route.get('/about',[userAuth.jwtAuth],HomeController.userAuth,HomeController.about)
route.get('/category',[userAuth.jwtAuth],HomeController.userAuth,HomeController.category)
route.get('/testimonial',[userAuth.jwtAuth],HomeController.userAuth,HomeController.testimonial)
route.get('/404/notfound',[userAuth.jwtAuth],HomeController.userAuth,HomeController.notFound)
route.get('/contact',[userAuth.jwtAuth],HomeController.userAuth,HomeController.contact)
route.get('/user',[userAuth.jwtAuth],HomeController.userAuth,HomeController.userDash)
route.get('/appliedjobs',[userAuth.jwtAuth],HomeController.userAuth,HomeController.appliedjobs)

//for login and registration
route.get('/userlogin',HomeController.userlogin)
route.get('/user_reg',HomeController.user_registration)
route.post('/createRegistration',[auth.checkDuplicate],HomeController.createRegistration)
route.get('/confirmation/:email/:token',HomeController.confirmation)
route.post('/userloginpost',HomeController.userloginpost)
route.get('/logout',HomeController.logout)



//for jobs
route.get('/job/list',[userAuth.jwtAuth],HomeController.userAuth,jobController.jobList)
route.get('/job/detail/:id',[userAuth.jwtAuth],HomeController.userAuth,jobController.jobDetail)
//route.get('/jobpost',[userAuth.jwtAuth],HomeController.userAuth,jobController.jobpost) 
route.get('/jobapply',[userAuth.jwtAuth],HomeController.userAuth,jobController.jobapply) 
//route.post('/create/job',[userAuth.jwtAuth],HomeController.userAuth,singleUpload.single('companyimage'),jobController.createJob)
route.post('/apply/job',[userAuth.jwtAuth],HomeController.userAuth,jobController.applyJob)
route.get("/category/:categoryId",[userAuth.jwtAuth],HomeController.userAuth,jobController.getJobsByCategory);


//for blog
route.get("/posts",[userAuth.jwtAuth],HomeController.userAuth,blogController.renderAllPost);
route.get("/post/:id",[userAuth.jwtAuth],HomeController.userAuth,blogController.renderSinglePostPage);
route.post("/comment/:id",[userAuth.jwtAuth],HomeController.userAuth,blogController.addComment);
route.patch("/add-like/:id",[userAuth.jwtAuth],HomeController.userAuth,blogController.addLike);





module.exports=route