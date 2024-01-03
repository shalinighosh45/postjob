const mongoose=require('mongoose')
const schema=mongoose.Schema

const companyschema=new schema({
    image:{
        type:String,
        required:true
    },
   

})


const companymodel=mongoose.model('company',companyschema)
module.exports=companymodel