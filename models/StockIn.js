const mongoose = require("mongoose")

const stockInScheme = new mongoose.Schema({
    name:{type:String,default:""},
    companyName:{type:String,default:""},
    productType:{type:String,default:""},
    docNo:{type:Number,default:1},
    supplierDocNo:{type:String,default:""},
    supplier:{type:mongoose.Types.ObjectId,ref:"Supplier"},
    productId:{type:mongoose.Types.ObjectId,ref:"Product"},
    quantity:{type:Number,default:0, required:true},
    price:{type:Number},
    prevQuantity:{type:Number,default:0},
    expiry:{type:Date},
    unit:{type:String,default:""}
},{timestamps:true})

const StockIn = new mongoose.model("StockIn",stockInScheme)
module.exports = StockIn;