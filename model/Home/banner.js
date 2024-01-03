const mongoose=require('mongoose')
const schema=mongoose.Schema

const bannerschema=new schema({
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },

})


const bannermodel=mongoose.model('banner',bannerschema)
module.exports=bannermodel