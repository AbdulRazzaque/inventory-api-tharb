const mongoose = require('mongoose')
const Product = require("../models/Product")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const Stock = require("../models/Stock")
class ProductController{
    async getProduct (req,res){
        res.send("home routre user")
    }

//    
async createProduct(req, res) {
    const { itemCode, productName, unit, physicalLocation, sku, lotNumber, manufacturer, supplierName, addModel } = req.body;
    if (!itemCode || !productName || !unit || !physicalLocation || !sku || !manufacturer || !supplierName || !addModel) {
        res.status(400).send("Data Missing");
    } else {
        let newName = `${itemCode} ${productName} ${unit} ${physicalLocation} ${sku} ${lotNumber} ${manufacturer} ${supplierName} ${addModel}`;
        try {
            const existingProduct = await Product.findOne({ itemCode: newName });
            if (existingProduct) {
                res.status(400).send("Product Already Exist");
            } else {
                const newProduct = new Product({
                    itemCode: newName,
                    productName,
                    unit,
                    physicalLocation,
                    sku,
                    lotNumber,
                    manufacturer,
                    supplierName,
                    addModel
                });
                await newProduct.save();
                res.status(201).send({msg:"Product Created Successfully"});
            }
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    }
}

 
    async updateProduct(req,res){
   
        const {itemCode,productName,unit,physicalLocation,sku,lotNumber,manufacturer,supplierName,addModel}=req.body;
        if(!itemCode || !productName || !unit || !physicalLocation || !sku  || !manufacturer || !supplierName || !addModel){
            res.status(400).send("Data Missing")
        }
        else{
            Product.updateOne({_id: req.params.id},{$set:{itemCode,productName,unit,physicalLocation,sku,lotNumber,manufacturer,supplierName,addModel}})
            .then(response=>{
                res.status(200).send({msg:"success",result:response})
            })
        }
    }
            
    async getAllProducts(req,res){
        Product.find({}).sort({_id:-1})
        .then(response=>{
            res.status(200).send({msg:"success",result:response})
        })
    }


    async deleteProduct(req, res, next) {
        let product;
        try {
          product = await Product.findByIdAndRemove({ _id: req.params.id });
          if (!product) {
            return next(new Error("Noting to delete"));
          }

     
  
        } catch (error) {
          return next(error);
        }
        res.json(product);
      }

}

const productController = new ProductController();
module.exports=productController;