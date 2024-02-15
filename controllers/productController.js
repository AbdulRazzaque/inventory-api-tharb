const mongoose = require('mongoose')
const Product = require("../models/Product")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const _ = require("lodash")
class ProductController{
    async getProduct (req,res){
        res.send("home routre user")
    }

    async createProduct(req,res){
        const {itemCode,productName,unit,physicalLocation,sku,lotNumber,manufacturer,supplierName,addModel}=req.body;
        if(!itemCode || !productName || !unit || !physicalLocation || !sku  || !manufacturer || !supplierName || !addModel){
            res.status(400).send("Data Missing")
        }
        else{
            let newName = `${itemCode} ${productName} ${unit} ${physicalLocation} ${sku} ${lotNumber} ${manufacturer} ${supplierName} ${addModel}`
            Product.findOne({itemCode:newName})
            .then(response=>{
                if(response){
                    res.status(400).send("Product Already Exist")
                }else{
                    const newProduct = new Product({
                        itemCode:newName,
                        productName,
                        unit,
                        physicalLocation,
                        sku,
                        lotNumber,
                        manufacturer,
                        supplierName,
                        addModel
                    })
                    newProduct.save()
                    .then(newProdResponse=>{
                        res.status(200).send({msg:"Product added successfully",result:newProdResponse})
                    })
                }
            })
            
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
        Product.find({}).sort({name:1})
        .then(response=>{
            res.status(200).send({msg:"success",result:response})
        })
    }

    // async getAllProductType(req,res){
    //         Product.find({},{type:1})
    //         .then(response=>{
    //             res.status(200).send({msg:"success",result:response})
    //         })
    // }

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