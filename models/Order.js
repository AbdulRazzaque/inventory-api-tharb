const mongoose = require("mongoose")

const orderScheme = new mongoose.Schema({
    refNo:{type:Number,unique:true},
    productId:[{type:mongoose.Types.ObjectId,ref:"Product"}],
    productName:[{type:String}],
    memberId:{type:mongoose.Types.ObjectId,ref:"Member"},
    memberName:{type:String,},
    requiredQuantity:[{type:Number}],
    status:{type:String,default:"in progress"},


},{timestamps:true})

const Order = new mongoose.model("Order",orderScheme)
module.exports = Order


