const companymodel=require('../../../model/Home/company')


const company=async(req,res)=>{
    try {
        const company=await companymodel.find()

 
    res.render('Admin/homeContent/companylisting',{
        title:"company page",
      
        companydata:company,
         admin:req.admin,

    })

    } catch (error) {
        console.log(error.message);
    }
   
}


const createcompany=async(req,res)=>{
    try {
        const image=req.file
        const company=await companymodel({
            image:image.filename
        })
        console.log(company);
        await company.save()
        return res.redirect('/admin/company')

    } catch (error) {
        console.log(error.message);
    }
}

const companydel=async(req,res)=>{
    try {
        const id=req.params.id;
        const data=await companymodel.findByIdAndDelete(id)
      
        res.redirect('/admin/company')
    } catch (error) {
        console.log(err.message);
    }
}

module.exports={
    company,
    createcompany,
    companydel
}