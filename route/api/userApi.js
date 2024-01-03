const express = require('express')
const route = express.Router();
const userApiController = require('../../controller/Api/User/userApiController')
const verify = require('../../middleware/api/verify')
const verifyToken = require('../../middleware/api/verifyToken')
const userJobApiController = require('../../controller/Api/User/userJobApiController')
const userBlogApiController = require('../../controller/Api/User/userBlogApiController')


route.post('/userregistration',userApiController.createRegistration)
route.get('/confirmation/:email/:token',userApiController.confirmation)
route.post('/login',userApiController.userLoginPost)
route.get('/logout',userApiController.logout)

route.get('/home',userApiController.home)
route.get('/userdash',verifyToken,userApiController.userdash)
route.get('/appliedjobs',verifyToken,userApiController.appliedjobs)


//for job
route.get('/job/list',verifyToken,userJobApiController.jobList)
route.get('/job/detail/:id',verifyToken,userJobApiController.jobDetail)
route.post('/apply/job',verifyToken,userJobApiController.applyJob)
route.get("/category/:categoryId", verifyToken, userJobApiController.getJobsByCategoryAPI);

//for blog

route.get("/posts",verifyToken,userBlogApiController.getAllPostsAPI);
route.get("/post/:id",verifyToken,userBlogApiController.getSinglePostAPI);
route.post("/comment/:id",verifyToken,userBlogApiController.addCommentAPI);
route.patch("/add-like/:id", verifyToken,userBlogApiController.addLikeAPI);


module.exports=route