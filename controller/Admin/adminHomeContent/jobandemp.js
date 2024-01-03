// const employee_job=(req,res)=>{
//     res.render('Admin/homeContent/jobandemployee',{
//         title:"job and employee page",
//         admin:req.admin
//     })
// }

// module.exports={
//     employee_job
// }


const jobModel = require('../../../model/jobModel')
const userModel = require('../../../model/userModel')





const allJobs = async (req, res) => {
    try {
        // Fetch all jobs with additional information
        const jobs = await jobModel.find().populate('createdId', 'name email') // Populate the creator's information

        res.render('Admin/homeContent/jobandemployee', {
            title: "job and employee page",
            admin: req.admin,
            jobs: jobs, // Pass the jobs data to the view
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



const toggleJobStatus = async (req, res) => {
    try {
        if (!req.params.id) {
            console.log('id is missing');
        }

        const user = await jobModel.findById(req.params.id);

        if (!user) {
            console.log('user not found');
        }

        user.isActive = !user.isActive;

        await user.save();
        return res.redirect('/admin/jobandemp')

    } catch (err) {
        console.log(err.message);
    }

};







module.exports = {
    allJobs,
    toggleJobStatus

}