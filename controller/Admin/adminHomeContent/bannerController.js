const bannermodel=require('../../../model/Home/banner')
const userModel = require('../../../model/userModel')

const bannerlisting = async(req,res)=>{

    try {
    const banner=await bannermodel.find()
    res.render('Admin/homeContent/bannerlisting',{
        title:"Banner Page",
        bannerdata:banner,
        admin:req.admin,
        data:req.admin
    })
    } catch (error) {
        console.log(error.message);
    }
    
}

const createbanner=async(req,res)=>{
   try {
    const image=req.file

    const banner=await  bannermodel({
        title:req.body.title,
        subtitle:req.body.subtitle,
        image:image.filename
    })
console.log(banner);
await banner.save()
res.redirect('/admin/bannerlisting')

   } catch (error) {
    console.log(error.message);
   }
}



const bannerdel=async(req,res)=>{
    try {
        const id=req.params.id;
        const data=await bannermodel.findByIdAndDelete(id)
      
        res.redirect('/admin/bannerlisting')
    } catch (error) {
        console.log(err.message);
    }
}



const editbanner = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await bannermodel.findById(id);

       

        res.render('Admin/updatecontent/bannerupdate', {
            title: 'Edit Page',
            data: data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
};


const updatebanner=async(req,res)=>{
    try{
        const id =req.params.id;
        const image=req.file;

        const title=req.body.title;
        const subtitle=req.body.subtitle;
       
        const data = await bannermodel.findById(id);
        data.title=title;
        data.subtitle=subtitle;
       

        if(image){
            data.image=image.path
        }
         await data.save();

         res.redirect('/admin/bannerlisting')

    }catch(err){
        console.log(err.message);
    }

}





module.exports={
    bannerlisting,
    createbanner,
    bannerdel,
    editbanner,
    updatebanner
  

}