const reviewmodel = require('../../../model/Home/review')


const review = async(req, res) => {
    const data=await reviewmodel.find()
    res.render('Admin/homeContent/review', {
        title: "review page",
        reviewdata:data,
        admin:req.admin

    })
}

const createreview = async (req, res) => {
    try {
        const image = req.file
        const review = await reviewmodel({



            name: req.body.name,
            profession: req.body.profession,
            review:req.body.review,
            image: image.filename
        })

        console.log(review);
        await review.save()
        res.redirect('/admin/review')
    } catch (error) {
        console.log(error.message);
    }
}

const reviewdel=async(req,res)=>{
    try {
        const id=req.params.id;
        const data=await reviewmodel.findByIdAndDelete(id)
      
        res.redirect('/admin/review')
    } catch (error) {
        console.log(error.message);
    }
  }


  const editreview = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await reviewmodel.findById(id);

       

        res.render('Admin/updatecontent/reviewupdate', {
            title: 'Edit Page',
            data: data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
};


const updatereview=async(req,res)=>{
    try{
        const id =req.params.id;
        const image=req.file;

        const name=req.body.name;
        const profession=req.body.profession;
        const review=req.body.review
       
        const data = await reviewmodel.findById(id);
        data.name=name;
        data.profession=profession;
        data.review=review
       

        if(image){
            data.image=image.path
        }
         await data.save();

         res.redirect('/admin/review')

    }catch(err){
        console.log(err.message);
    }

}

module.exports = {
    review,
    createreview,
    reviewdel,
    editreview,
    updatereview
}