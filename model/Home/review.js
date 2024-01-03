const mongoose=require('mongoose')
const schema=mongoose.Schema

const reviewschema=new schema({
    image:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    profession:{
        type:String,
        required:true
    },

})


const reviewmodel=mongoose.model('review',reviewschema)
module.exports=reviewmodel