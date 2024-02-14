const mongoose = require("mongoose")

const productScheme = new mongoose.Schema({
    name:{type:String,default:"",required:true},
    companyName:{type:String,default:"",required:true},
    type:{type:String,default:"",required:true},
    unit:{type:String,default:"",required:true},
},{timestamps:true})

const Product = new mongoose.model("Product",productScheme)
module.exports = Product;