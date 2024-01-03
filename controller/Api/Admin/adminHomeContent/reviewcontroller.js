const reviewmodel=require('../../../../model/Home/review')
const path=require('path')

const create_review=async(req,res)=>{
    try {
        const image=req.file
        const review=await reviewmodel({
            review:req.body.review,
            profession:req.body.profession,
            name:req.body.name,
            image:image.path
        })

     const reviewdata= await review.save()
        res.status(200).json({
            success:"true",
            message:"data created successfullly",
            data:reviewdata
        })
    } catch (error) {
        res.status(404).json({
            msg:error.message,
            success:"false"
         })
    }
}


const getallreview=async(req,res)=>{
    try{
  const allreview= await reviewmodel.find({})
 
 
  res.status(200).json({
     success:"true",
     length:allreview.length,
     message:"data fetched successfullly",
     data:allreview
 })
    }
    catch(error){
  res.status(404).json({
     msg:error.message,
     success:"false"
  })
    }
 }



const updatereview = async (req, res) => {
    try {
      
        const updateData = {
            review:req.body.review,
            profession:req.body.profession,
            name:req.body.name
        };

        if (req.file) {
        
            updateData.image = req.file.filename;
        }

      
        const updatereview = await reviewmodel.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });

     
        return res.status(200).send({
            success: true,
            message: "Data updated successfully",
            data: updatereview
        });
    } catch (error) {
       
        console.log(error);
        return res.status(500).send({
            message: "Error while updating user data",
            error: error.message
        });
    }
};







  const deltetereview = async (req, res) => {
    try {
  
        const review = await reviewmodel.findByIdAndDelete({ _id: req.params.id }, req.body)
        return res.status(200).send({
            success: "true",
            message: " data deleted Successfully",
            data: review
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error while updating user data ",
            error: error.message
        })
    }
  }

module.exports={create_review,
    getallreview,updatereview,deltetereview
}