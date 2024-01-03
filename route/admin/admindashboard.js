const express=require('express');
const Route=express.Router()
const DashboardController=require('../../controller/Admin/DashboardController')
const BannerController= require('../../controller/Admin/adminHomeContent/bannerController')
const aboutcontroller=require('../../controller/Admin//adminHomeContent/aboutcontroller')
const reviewcontroller=require('../../controller/Admin/adminHomeContent/reviewcontroller')
const upload=require('../../multerConfig')
const categorycontroller=require('../../controller/Admin/adminHomeContent/categorycontroller')
const adminAuth = require('../../middleware/admin/adminAuth')
const blogPageController = require('../../controller/Admin/blogPageController')
const companycontroller=require('../../controller/Admin/adminHomeContent/companycontroller')
const jobemployeecontroller=require('../../controller/Admin/adminHomeContent/jobandemp')
const singleUplaod = require('../../multerConfig')

//for admin dashboard
Route.get('/dashboard',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,DashboardController.dashboard)
Route.get('/',DashboardController.login)
Route.post('/adminloginpost',DashboardController.adminloginpost)
Route.get('/adminlogout',DashboardController.adminlogout)
Route.get('/alluser',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,DashboardController.alluser)
Route.get('/allemployee',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,DashboardController.allEmployee)
Route.get("/activate-user/:id",[adminAuth.jwtAdminAuth],DashboardController.adminAuth,DashboardController.switchStatusOfUser);


//for blogpage
Route.get("/add-post",[adminAuth.jwtAdminAuth],DashboardController.adminAuth,blogPageController.renderAddPostPage);
Route.post("/add/post",[adminAuth.jwtAdminAuth],DashboardController.adminAuth,singleUplaod.single('image'),blogPageController.addPost);
Route.get("/all-posts",[adminAuth.jwtAdminAuth],DashboardController.adminAuth,blogPageController.renderAllPostPage);
Route.get('/activeted/:id',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,blogPageController.switchBlogPost)




//banner
Route.get('/bannerlisting',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,BannerController.bannerlisting)
Route.post('/createbanner',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,upload.single('image'),BannerController.createbanner)
Route.post('/updatebanner/:id',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,upload.single('image'),BannerController.updatebanner)
Route.get('/bannerdel/:id',BannerController.bannerdel)
Route.get('/editbanner/:id',BannerController.editbanner)



//about
Route.get('/aboutlisting',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,aboutcontroller.aboutlisting)
Route.post('/createabout',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,upload.fields([
    { name: 'imageone', maxCount: 1 },
    { name: 'imagetwo', maxCount: 1 },
    { name: 'imagethree', maxCount: 1 },
    { name: 'imagefour', maxCount: 1 },
  ]),aboutcontroller.createAbout)

  Route.get('/aboutdel/:id',aboutcontroller.aboutdel)

//review
  Route.get('/review',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,reviewcontroller.review)
  Route.post('/createreview',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,upload.single('image'),reviewcontroller.createreview),
  Route.get('/reviewdel/:id',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,reviewcontroller.reviewdel)
  Route.get('/editreview/:id',reviewcontroller.editreview)
  Route.post('/updatereview/:id',upload.single('image'),reviewcontroller.updatereview)


//category
Route.get('/category',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,categorycontroller.category)
Route.post('/createcategory',upload.single('image'),categorycontroller.createcategory),
Route.get('/categorydel/:id',categorycontroller.categorydel)

//company
Route.get('/company',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,companycontroller.company)
Route.post('/createcompany',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,upload.single('image'),companycontroller.createcompany)
Route.get('/companydel/:id',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,companycontroller.companydel)


//job and employee
Route.get('/jobandemp',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,jobemployeecontroller.allJobs)
Route.get('/jobs/:id',[adminAuth.jwtAdminAuth],DashboardController.adminAuth,jobemployeecontroller.toggleJobStatus)


module.exports=Route