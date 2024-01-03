const categorymodel=require('../../../../model/Home/category')
const path=require('path')

const create_category=async(req,res)=>{
    try {
        const image=req.file
        const category_data=await categorymodel({
            title:req.body.title,
            subtitle:req.body.subtitle,
            image:image.path
        })

     const category= await category_data.save()
        res.status(200).json({
            success:"true",
            message:"data created successfullly",
            data:category
        })
    } catch (error) {
        res.status(404).json({
            msg:error.message,
            success:"false"
         })
    }
}


const getallcategory=async(req,res)=>{
    try{
  const allcategory= await categorymodel.find({})
 
 
  res.status(200).json({
     success:"true",
     length:allcategory.length,
     message:"data fetched successfullly",
     data:allcategory
 })
    }
    catch(error){
  res.status(404).json({
     msg:error.message,
     success:"false"
  })
    }
 }

// const updatecategory = async (req, res) => {
//     try {
  
//         const updatecategory = await categorymodel.findByIdAndUpdate({ _id: req.params.id }, req.body)
//         return res.status(200).send({
//             success: "true",
//             message: " data updated Successfully",
//             data: updatecategory
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             message: "Error while updating user data ",
//             error: error.message
//         })
//     }
//   }

const updatecategory = async (req, res) => {
    try {
      
        const updateData = {
            title: req.body.title,
            subtitle: req.body.subtitle,
        };

        if (req.file) {
        
            updateData.image = req.file.filename;
        }

      
        const updateBanner = await categorymodel.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });

     
        return res.status(200).send({
            success: true,
            message: "Data updated successfully",
            data: updateBanner
        });
    } catch (error) {
       
        console.log(error);
        return res.status(500).send({
            message: "Error while updating user data",
            error: error.message
        });
    }
};



  const deltetecategory = async (req, res) => {
    try {
  
        const category = await categorymodel.findByIdAndDelete({ _id: req.params.id }, req.body)
        return res.status(200).send({
            success: "true",
            message: " data deleted Successfully",
            data: category
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error while updating user data ",
            error: error.message
        })
    }
  }

module.exports={create_category,getallcategory,updatecategory,deltetecategory
}