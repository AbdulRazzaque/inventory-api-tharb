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
        const {name,companyName,type,unit}=req.body;
        if(!name || !companyName || !type || !unit){
            res.status(400).send("Data Missing")
        }
        else{
            let newName = `${name} ${companyName} ${type} ${unit}`
            Product.findOne({name:newName})
            .then(response=>{
                if(response){
                    res.status(400).send("Product Already Exist")
                }else{
                    const newProduct = new Product({
                        name:newName,
                        companyName,
                        type,
                        unit
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
        const {name,companyName,type,unit,productId}=req.body;
        let newName = `${name} ${companyName} ${type} ${unit}`
        if(!name || !companyName || !type || !unit){
            res.status(400).send("Data Missing")
        }
        else{
            Product.updateOne({_id:mongoose.Types.ObjectId(productId)},{$set:{name:newName,companyName,type,unit}})
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

    async getAllProductType(req,res){
            Product.find({},{type:1})
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

    // async deleteProduct(req,res){
    //     let {array} = req.body;
    //     if(!req.body.array){
    //         res.status(400).send("Data Missing")
    //     }else{
    //         array = array.map(item=>mongoose.Types.ObjectId(item))
    //         Product.deleteMany({_id: { $in: array}})
    //         .then(response=>{
    //             if(response.deletedCount===1){
    //                 res.status(200).send({msg:"success",result:"Deleted"})
    //             }else{
    //                 res.status(400).send("Not deleted")
    //             }
    //         })
    //     }
    // }


}

const productController = new ProductController();
module.exports=productController;