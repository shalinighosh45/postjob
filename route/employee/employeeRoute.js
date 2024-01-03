const express=require('express');
const route=express.Router()
const employeeController = require('../../controller/employee/employeeController')
const empAuth = require('../../middleware/employee/empAuth')
const jobController = require('../../controller/employee/jobController')
const singleUpload=require('../../multerConfig')


route.get('/',[empAuth.jwtAuth],employeeController.Auth,employeeController.home)

route.get('/about',[empAuth.jwtAuth],employeeController.Auth,employeeController.about)
route.get('/category',[empAuth.jwtAuth],employeeController.Auth,employeeController.category)
route.get('/testimonial',[empAuth.jwtAuth],employeeController.Auth,employeeController.testimonial)
route.get('/404/notfound',[empAuth.jwtAuth],employeeController.Auth,employeeController.notFound)
route.get('/contact',[empAuth.jwtAuth],employeeController.Auth,employeeController.contact)
route.get('/dashboard',[empAuth.jwtAuth],employeeController.Auth,employeeController.employee)

//for login and registration
route.get('/employeelogin',employeeController.employeeLoginPage)
route.post('/employeeloginpost',employeeController.emploginpost)
route.get('/logout',employeeController.logout)



//for jobs
route.get('/job/list',[empAuth.jwtAuth],employeeController.Auth,jobController.jobList) 
route.get('/job/detail/:id',[empAuth.jwtAuth],employeeController.Auth,jobController.jobDetail)
 route.get('/jobpost',[empAuth.jwtAuth],employeeController.Auth,jobController.jobpost)
// route.get('/jobapply',[userAuth.jwtAuth],HomeController.userAuth,jobController.jobapply) //??
 route.post('/create/job',[empAuth.jwtAuth],employeeController.Auth,singleUpload.single('companyimage'),jobController.createJob)
// route.post('/apply/job',[userAuth.jwtAuth],HomeController.userAuth,jobController.applyJob)
route.get("/category/:categoryId",[empAuth.jwtAuth],employeeController.Auth,jobController.getJobsByCategory);
//route.get('/categories',[empAuth.jwtAuth],employeeController.Auth,jobController.category)
route.get('/activate-user/:id',[empAuth.jwtAuth],employeeController.Auth,jobController.switchJob)



module.exports=route