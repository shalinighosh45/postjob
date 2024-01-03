const express=require('express');
const route=express.Router()
const empApiController = require('../../controller/Api/Employee/employeeApiController')
const verifyEmpToken = require('../../middleware/api/verifyEmpToken')
const employeeJobApi = require('../../controller/Api/Employee/employeeJobApiController')
const singleUpload=require('../../multerConfig')


route.post('/employeelogin', empApiController.empLoginAPI);
route.get('/logout', empApiController.logoutAPI);
route.get('/api/dashboard', verifyEmpToken, empApiController.employeeAPI);


route.post('/api/create/job', verifyEmpToken, singleUpload.single('companyimage'), employeeJobApi.createJobAPI);
route.get('/api/activate-job/:id', verifyEmpToken, employeeJobApi.switchJobAPI);


module.exports=route