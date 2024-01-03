
const Aboutmodel = require('../../../model/Home/about')

const aboutlisting = async (req, res) => {

    try {
        const banner = await Aboutmodel.find()
        res.render('Admin/homeContent/aboutlisting', {
            title: "about Page",
            aboutdata: banner,
            admin:req.admin,
          

        })
    } catch (error) {
        console.log(error.message);
    }

}



const createAbout=async(req,res)=>{
  try {
    const about=await Aboutmodel({
      title:req.body.title,
      subtitle:req.body.subtitle,
      para1:req.body.para1,
      para2:req.body.para2,
      para3:req.body.para3,
      imageone: req.files['imageone'][0].path,
      imagetwo: req.files['imagetwo'][0].path,
      imagethree: req.files['imagethree'][0].path,
      imagefour: req.files['imagefour'][0].path,

    })

    console.log(about);
    await about.save()
    res.redirect('/admin/aboutlisting')
  } catch (error) {
    console.log(error.message);
  }
}


const aboutdel=async(req,res)=>{
  try {
      const id=req.params.id;
      const data=await Aboutmodel.findByIdAndDelete(id)
    
      res.redirect('/admin/aboutlisting')
  } catch (error) {
      console.log(error.message);
  }
}

module.exports = {
    aboutlisting,
    createAbout,
    aboutdel
}