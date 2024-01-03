const companymodel=require('../../../../model/Home/company')
const path=require('path')

const create_company=async(req,res)=>{
    try {
        const image=req.file
        const category_data=await companymodel({
        
            image:image.path
        })

     const company= await category_data.save()
        res.status(200).json({
            success:"true",
            message:"data created successfullly",
            data:company
        })
    } catch (error) {
        res.status(404).json({
            msg:error.message,
            success:"false"
         })
    }
}


const getallcompany=async(req,res)=>{
    try{
  const allcompany= await companymodel.find({})
 
 
  res.status(200).json({
     success:"true",
     length:allcompany.length,
     message:"data fetched successfullly",
     data:allcompany
 })
    }
    catch(error){
  res.status(404).json({
     msg:error.message,
     success:"false"
  })
    }
 }



 const updatecompany = async (req, res) => {
    try {
        const companyId = req.params.id; // Assuming you have the company ID in the URL parameters
        const newImage = req.file;

        // Find the company by ID
        const company = await companymodel.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        // Update the company image
        company.image = newImage.path;

        // Save the updated company
        const updatedCompany = await company.save();

        res.status(200).json({
            success: true,
            message: "Company image updated successfully",
            data: updatedCompany,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




  const deltetecompany = async (req, res) => {
    try {
  
        const category = await companymodel.findByIdAndDelete({ _id: req.params.id }, req.body)
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

module.exports={create_company,getallcompany,updatecompany,deltetecompany
}