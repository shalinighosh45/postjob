const mongoose=require('mongoose')
const schema=mongoose.Schema

const categoryschema=new schema({
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
    joblink:{
       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    }

},
{timestamps:true}
)


const categorymodel=mongoose.model('category',categoryschema)
module.exports=categorymodel