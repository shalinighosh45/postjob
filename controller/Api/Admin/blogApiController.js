const postModel = require('../../../model/postModel')
const path = require('path')


const fetchAllBlogsAPI = async (req, res) => {
    try {
    
      const posts = await postModel.find();
      return res.status(200).json({ message: 'Fetch All Blogs',len:posts.length, admin: req.admin, blogs: posts });
    } catch (error) {
      console.error(error);
      // Handle errors and send an error response
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addPostAPI = async (req, res) => {
    const { title, subTitle, description } = req.body;
    const image = req.file?.filename;
  
    try {
      if (!title || !subTitle || !description || !image) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const newModel = new postModel({
        title,
        subTitle,
        description,
        image,
        adminId: req.admin.id,
      });
  
      await newModel.save();
  
      return res.status(201).json({ message: 'Post added successfully', post: newModel });
    } catch (error) {
      // Handle errors, maybe delete the uploaded image if it fails
  
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
const fetchBlogsByIdsAPI = async (req, res) => {
    try {
        const ids = req.params.id.split(','); 
        const posts = await postModel.find({ _id: { $in: ids } });

        return res.status(200).json({ message: 'Fetch Blogs by IDs', len: posts.length, admin: req.admin, blogs: posts });
    } catch (error) {
        console.error(error);
        // Handle errors and send an error response
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const switchBlogPostAPI = async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: 'Blog post ID is missing' });
      }
  
      const user = await postModel.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      user.isActive = !user.isActive;
  
      await user.save();
      return res.status(200).json({ message: 'Blog post activation state switched successfully', user });
  
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  

module.exports={
    fetchAllBlogsAPI,
    addPostAPI,
    fetchBlogsByIdsAPI,
    switchBlogPostAPI
}