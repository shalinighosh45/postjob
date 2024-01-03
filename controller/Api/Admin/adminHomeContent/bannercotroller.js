const bannermodel=require('../../../../model/Home/banner')
const path=require('path')

const create_banner=async(req,res)=>{
    try {
        const image=req.file
        const banner=await bannermodel({
            title:req.body.title,
            subtitle:req.body.subtitle,
            image:image.path
        })

     const bannerdata= await banner.save()
        res.status(200).json({
            success:"true",
            message:"data created successfullly",
            data:bannerdata
        })
    } catch (error) {
        res.status(404).json({
            msg:error.message,
            success:"false"
         })
    }
}


const getallbanner=async(req,res)=>{
    try{
  const allbanner= await bannermodel.find({})
 
 
  res.status(200).json({
     success:"true",
     length:allbanner.length,
     message:"data fetched successfullly",
     data:allbanner
 })
    }
    catch(error){
  res.status(404).json({
     msg:error.message,
     success:"false"
  })
    }
 }

// const updatebanner = async (req, res) => {
    
//     try {
 
//         const updatebanner = await bannermodel.findByIdAndUpdate({ _id: req.params.id }, req.body)
//         return res.status(200).send({
//             success: "true",
//             message: " data updated Successfully",
//             data: updatebanner
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             message: "Error while updating user data ",
//             error: error.message
//         })
//     }
//   }

// const updatebanner = async (req, res) => {
//     try {
       
//         if (!req.file) {
           
//             const updateData = {
//                 title: req.body.title,
//                 subtitle: req.body.subtitle,
//             };

          
//             const updateBanner = await bannermodel.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });

            
//             return res.status(200).send({
//                 success: true,
//                 message: "Data updated successfully",
//                 data: updateBanner
//             });
//         } else {
          
//             const updateData = {
//                 title: req.body.title,
//                 subtitle: req.body.subtitle,
//                 image: req.file.filename,
//             };

        
//             const updateBanner = await bannermodel.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });

           
//             return res.status(200).send({
//                 success: true,
//                 message: "Data updated successfully",
//                 data: updateBanner
//             });
//         }
//     } catch (error) {
      
//         console.log(error);
//         return res.status(500).send({
//             message: "Error while updating user data",
//             error: error.message
//         });
//     }
// };


const updatebanner = async (req, res) => {
    try {
      
        const updateData = {
            title: req.body.title,
            subtitle: req.body.subtitle,
        };

        if (req.file) {
        
            updateData.image = req.file.filename;
        }

      
        const updateBanner = await bannermodel.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });

     
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







  const deltetebanner = async (req, res) => {
    try {
  
        const banner = await bannermodel.findByIdAndDelete({ _id: req.params.id }, req.body)
        return res.status(200).send({
            success: "true",
            message: " data deleted Successfully",
            data: banner
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error while updating user data ",
            error: error.message
        })
    }
  }

module.exports={create_banner,
    getallbanner,updatebanner,deltetebanner
}