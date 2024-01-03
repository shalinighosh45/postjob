const mongoose = require('mongoose');
const schema=mongoose.Schema

const aboutSchema = new schema({
title:{
  type:String,
  required:true
},
subtitle:{
  type:String,
  required:true
},
para1:{
  type:String,
  required:true
},
para2:{
  type:String,
  required:true
},
para3:{
  type:String,
  required:true
},
imageone:[{
  type:String,
  required:true
}],
imagetwo:[{
  type:String,
  required:true
}],
imagethree:[{
  type:String,
  required:true
}],
imagefour:[{
  type:String,
  required:true
}]

});

const aboutModel = mongoose.model('about', aboutSchema);

module.exports = aboutModel;
