const jobModel = require('../../../model/jobModel')
const userModel = require('../../../model/userModel')




const allJobsAPI = async (req, res) => {
    try {
        // Fetch all jobs with additional information
        const jobs = await jobModel.find().populate('createdId', 'name email'); // Populate the creator's information

        res.status(200).json({
            title: "job and employee page",
            len:jobs.length,
            admin: req.admin,
            jobs: jobs, // Pass the jobs data in the JSON response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const toggleJobStatusAPI = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Job ID is missing' });
        }

        const job = await jobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        job.isActive = !job.isActive;

        await job.save();
        return res.status(200).json({ message: 'Job status toggled successfully', job });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports={
    allJobsAPI,
    toggleJobStatusAPI
}