const categorymodel=require('../../../model/categorieModel')


const category=async(req,res)=>{
    try {
        const category=await categorymodel.find()

        res.render('Admin/homeContent/categorylisting',{
            title:"review page",
            categorydata:category,
            admin:req.admin
        })
    } catch (error) {
        console.log(error.message);
    }
   
}

const createcategory=async(req,res)=>{
   try {
    const image=req.file
    const category=await categorymodel({
        
        title:req.body.title,
        subtitle:req.body.subtitle,
        image:image.filename
    })
    await category.save()
    res.redirect('/admin/category')
   } catch (error) {
    console.log(error.message);
   }

}

const categorydel=async(req,res)=>{
    try {
        const id=req.params.id;
        const data=await categorymodel.findByIdAndDelete(id)
      
        res.redirect('/admin/category')
    } catch (error) {
        console.log(err.message);
    }
}
module.exports={
    category,
    createcategory,
    categorydel}