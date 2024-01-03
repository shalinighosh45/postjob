const postModel = require('../../../model/postModel')
const commentModel = require('../../../model/commentModel')
const usermodel=require('../../../model/userModel')


const getAllPostsAPI = async (req, res) => {
  try {
    const posts = await postModel.find({ isActive: true });
    const users = await usermodel.find(); 

    return res.status(200).json({
      title: "Blog Page Data Fetch successfully",
      length:posts.lenghth,
      error: "",
      value: "",
      posts,
      users,
      data: req.user,
      url: req.url,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
};

const getSinglePostAPI = async (req, res) => {
  const param = req.params;
  try {
    if (!param.id) {
      return res.status(400).json({ error: "ID not found" });
    }

    const post = await postModel.findOne({
      _id: param.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const relatedPost = await postModel.find({
      isActive: true,
      _id: { $ne: param.id },
    });

    const aggregationPostComment = await commentModel.aggregate([
      { $match: { postId: post._id } },
      {
        $lookup: {
          from: "User",
          localField: "userId",
          foreignField: "_id",
          as: "authInfo",
        },
      },
      {
        $project: {
          email: 0,
          password: 0,
        },
      },
    ]);

    const comments = aggregationPostComment.map(comment => ({
      _id: comment._id,
      text: comment.text,
      user: comment.authInfo[0], // Assuming authInfo is an array with one user
      // Add other comment fields as needed
    }));

    return res.status(200).json({
      title: "Post Details Page Fetch Successfully",
      error: "",
      data: req.user,
      post,
      comments,
      relatedPost,
      user: req.user,
    });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addCommentAPI = async (req, res) => {
  const param = req.params;
  const payload = req.body;

  try {
    const newComment = new commentModel({
      body: payload.comment,
      userId: req.user.id,
      postId: param.id,
      userName: req.user.name
    });

    await newComment.save();
    
    await postModel.findByIdAndUpdate(newComment.postId, {
      $push: { commentIds: newComment.id }
    });

    return res.status(201).json({ success: "Comment added successfully" });
  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({ error: "Comment addition failed. Please try again." });
  }
};


const addLikeAPI = async (req, res) => {
  try {
    const postId = req.params.id;

    // Validate postId
    if (!postId) {
      return res.status(400).json({ error: "Bad request. Post ID is required." });
    }

    // Find the post
    const post = await postModel.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Update the post with an increased like count
    const updatedPost = await postModel.findByIdAndUpdate(
      post._id,
      { $inc: { like: 1 } }, 
      { new: true }
    );

    // Send the updated like count in the response
    return res.status(200).json({
      message: "Success",
      status: 200,
      like: updatedPost.like,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


 

module.exports = {
  getAllPostsAPI,
  getSinglePostAPI,
  addCommentAPI,
  addLikeAPI,
};
