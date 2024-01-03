const postModel = require('../../model/postModel')
const path = require('path')


const renderAddPostPage = (req, res) => {
    return res.render("Admin/addpost", {
      error: "",
      title: "Add Post Page",
      value: "",
      admin: req.admin,
      url: req.url,
    });
  };

const addPost = async (req, res) => {
    const { title, subTitle, description } = req.body;
    const image = req.file?.filename; // Assuming you are using multer for file uploads
  
    try {
      // Manual validation
      if (!title || !subTitle || !description || !image) {
        return res.render("Admin/addPost/index.ejs", {
          error: "All fields are required",
          title: "Add Post Page",
          value: req.body,
          admin: req.admin,
          url: req.url,
        });
      }
  
      const newModel = new postModel({
        title,
        subTitle,
        description,
        image,
        adminId: req.admin.id,
      });
  
      await newModel.save();
  
      req.flash("success", "Post added successfully.");
      return res.redirect("/admin/all-posts");
    } catch (error) {
      // Handle errors, maybe delete the uploaded image if it fails
  
      req.flash("error", "Post add failed. Try again..!");
      return res.redirect("/admin/all-posts");
    }
};

const renderAllPostPage = async (req, res) => {
    try {
      const posts = await postModel.find();
      return res.render("Admin/allPosts", {
        error: "",
        flashMsg: {
          error: req.flash("error"),
          msg: req.flash("msg"),
          success: req.flash("success"),
        },
        title: "All Post Page",
        posts,
        admin: req.admin,
        url: req.url,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }
};

const switchBlogPost = async(req,res)=>{
  try{
    if(!req.params.id){
      console.log('id is missing');
    }

    const user = await postModel.findById(req.params.id);

    if(!user){
      console.log('user not found');
    }

    user.isActive = !user.isActive;

    await user.save();
    return res.redirect('/admin/all-posts')

  }catch(err){
    console.log(err.message);
  }

}


module.exports={
    renderAddPostPage,
    addPost,
    renderAllPostPage,
    switchBlogPost
}