const mongoose = require('mongoose')
const Product = require("../models/Product")
const Stock = require("../models/Stock")
const StockIn = require("../models/StockIn")
const StockOut = require("../models/StockOut")
const bcrypt = require('bcrypt');
const date = require('date-and-time');
const jwt = require("jsonwebtoken")
const moment = require("moment")

class ProductController{
    async getProduct (req,res){
        res.send("home routre user")
    }

    // async getAllStocks(req,res){
    //     Stock.find({},{stockIn:0,stockOut:0}).populate("product").sort({name:1})
    //     .then(response=>{
    //         res.status(200).send({msg:"success",result:response})
    //     })
    // } 
    // async getAllStocks(req, res) {
    //     Stock.find({}).populate("product").sort({ name: 1 })
    //       .then(response => {
    //         res.status(200).send({ msg: "success", result: response })
    //       })
    //       .catch(error => {
    //         res.status(500).send({ msg: "Internal Server Error", error: error });
    //       });
    //   }
    async getAllStocks(req, res) {
      const stocks = await Stock.find({}, { stockIn: 0, stockOut: 0 ,})
        .populate("product").sort({name:1})
        .populate({
          path: "stockIn"
        });

        res.status(200).send({ msg: "successfully", result: stocks });
      }

  


      // async getAllStocksNew(req, res) {
      //   const aggregatedStocks = await Stock.aggregate([
      //       {
      //         $lookup: {
      //           from: "products",
      //           localField: "product",
      //           foreignField: "_id",
      //           as: "productDetails"
      //         }
      //       },
      //       {
      //         $unwind: "$productDetails"
      //       },
      //       {
      //         $group: {
      //           _id: "$name",
      //           totalQuantity: { $sum: "$quantity" }, // New field to sum up the quantity
      //           products: {
      //             $push: {
      //               product: "$productDetails",
      //               quantity: "$quantity",
      //               expiry: "$expiry",
      //               createdAt: "$createdAt",
      //               updatedAt: "$updatedAt",
      //             }
      //           }
      //         }
      //       },
      //       {
      //         $sort: { _id: 1 }
      //       }
      //     ]);
          
      //   res.status(200).send({ msg: "success", result: aggregatedStocks });
      // }
 
    //   async stockIn(req, res) {
    //     let { docNo, department, itemCode, productId, quantity, expiry, unit, } = req.body;
    
    //     console.log("Stock IN -------")
    //     console.log(req.body)
    
    //     if (!docNo || !department || !itemCode || !productId || !quantity || !expiry || !unit) {
    //         res.status(400).send({ msg: "fill all required fields" });
    //     } else {
    //         quantity = parseInt(quantity);
    
        
    
    //         let stockFind = await Stock.findOne({ product: mongoose.Types.ObjectId(productId) });
    
    //         console.log("stockfind", stockFind)
    
    //         if (stockFind) {
    //             const newStockIn = new StockIn({
    //                 name: req.body.productName,
    //                 productId,
    //                 itemCode,
    //                 department: req.body.department,
    //                 docNo,
    //                 quantity,
    //                 expiry,
    //                 unit,
    //                 prevQuantity: stockFind.quantity
    //             });
    
    //             const stockInResponse = await newStockIn.save();
    //             let newExpiryArray = [];
    
    //             if (stockFind.expiryArray.length > 0) {
    //                 let checkExpiryExistenceArray = stockFind.expiryArray.filter(i => moment.parseZone(i.expiry).local().format("DD/MM/YY") === moment.parseZone(expiry).local().format("DD/MM/YY"));
    
    //                 if (checkExpiryExistenceArray.length > 0) {
    //                     newExpiryArray = stockFind.expiryArray.map((i, index) => {
    //                         if (moment.parseZone(i.expiry).local().format("DD/MM/YY") === moment.parseZone(expiry).local().format("DD/MM/YY")) {
    //                             i.prevQuantity = i.quantity;
    //                             i.quantity = i.quantity + quantity;
    //                         }
    //                         return i;
    //                     });
    //                 } else {
    //                     newExpiryArray = stockFind.expiryArray;
    //                     newExpiryArray.push({ expiry: new Date(expiry), quantity, prevQuantity: 0 });
    //                 }
    //             } else {
    //                 newExpiryArray = [{ prevQuantity: stockFind.totalQuantity, quantity: stockFind.totalQuantity + quantity, expiry: new Date(expiry) }];
    //             }
    
    //             let totalQuantity = 0;
    //             newExpiryArray.forEach(i => {
    //                 totalQuantity += i.quantity;
    //             });
    
    //             const stockUpdate = await Stock.updateOne({ product: mongoose.Types.ObjectId(productId) }, { $set: { expiryArray: newExpiryArray, totalQuantity }, $push: { stockIn: stockInResponse._id } });
    
    //             console.log(stockUpdate, 'stockUpdate');
    
    //             res.status(200).send({ msg: 'Product added successfully', result: stockInResponse });
    //         } else {
    //             console.log("inside new stocks and stockin");
    
    //             const newStockIn = new StockIn({
    //                 name: req.body.productName,
    //                 productId,
    //                 itemCode,
    //                 department: req.body.department,
    //                 docNo,
    //                 quantity,
    //                 expiry,
    //                 unit,
    //                 prevQuantity: stockFind?.quantity
    //             });
    
    //             const stockInResponse = await newStockIn.save();
    
    //             const newStock = new Stock({
    //                 name: req.body.productName,
    //                 product: mongoose.Types.ObjectId(productId),
    //                 totalQuantity: quantity,
    //                 department: req.body.department,
    //                 expiryArray: [{ expiry: new Date(expiry), quantity, prevQuantity: 0 }],
    //                 stockIn: [stockInResponse._id]
    //             });
    
    //             newStock.save()
    //                 .then(newStockResponse => {
    //                     res.status(200).send({ msg: 'Product added successfully', result: stockInResponse });
    //                 })
    //                 .catch(error => {
    //                     res.status(500).send({ msg: 'Error occurred while saving new stock', error });
    //                 });
    //         }
    //     }
    // }
    
    
    async stockIn(req, res) {
      let { docNo, department, itemCode, productId, quantity, expiry } = req.body;
  
      console.log("Stock IN -------");
      console.log(req.body);
  
      if (!docNo || !department || !itemCode || !productId || !quantity || !expiry) {
          res.status(400).send({ msg: "Fill all required fields" });
      } else {
          quantity = parseInt(quantity);
  
          let stockFind = await Stock.findOne({ product: mongoose.Types.ObjectId(productId) });
  
          console.log("stockfind", stockFind);
  
          if (stockFind) {
              const newStockIn = new StockIn({
                  name: req.body.productName,
                  productId,
                  itemCode,
                  department: req.body.department,
                  docNo,
                  quantity,
                  expiry,
                  prevQuantity: stockFind.quantity
              });
  
              const stockInResponse = await newStockIn.save();
              let newExpiryArray = [];
  
              if (stockFind.expiryArray.length > 0) {
                  let checkExpiryExistenceArray = stockFind.expiryArray.filter(i => moment.parseZone(i.expiry).local().format("DD/MM/YY") === moment.parseZone(expiry).local().format("DD/MM/YY"));
  
                  if (checkExpiryExistenceArray.length > 0) {
                      newExpiryArray = stockFind.expiryArray.map((i, index) => {
                          if (moment.parseZone(i.expiry).local().format("DD/MM/YY") === moment.parseZone(expiry).local().format("DD/MM/YY")) {
                              i.prevQuantity = i.quantity;
                              i.quantity = i.quantity + quantity;
                          }
                          return i;
                      });
                  } else {
                      newExpiryArray = stockFind.expiryArray;
                      newExpiryArray.push({ expiry: new Date(expiry), quantity, prevQuantity: 0 });
                  }
              } else {
                  newExpiryArray = [{ prevQuantity: stockFind.totalQuantity, quantity: stockFind.totalQuantity + quantity, expiry: new Date(expiry) }];
              }
  
              let totalQuantity = 0;
              newExpiryArray.forEach(i => {
                  totalQuantity += i.quantity;
              });
  
              const stockUpdate = await Stock.updateOne({ product: mongoose.Types.ObjectId(productId) }, { $set: { expiryArray: newExpiryArray, totalQuantity }, $push: { stockIn: stockInResponse._id } });
  
              console.log(stockUpdate, 'stockUpdate');
  
              res.status(200).send({ msg: 'Product added successfully', result: stockInResponse });
          } else {
              console.log("inside new stocks and stockin");
  
              const newStockIn = new StockIn({
                  name: req.body.productName,
                  productId,
                  itemCode,
                  department: req.body.department,
                  docNo,
                  quantity,
                  expiry,
                  prevQuantity: stockFind?.quantity
              });
  
              const stockInResponse = await newStockIn.save();
  
              const newStock = new Stock({
                  name: req.body.productName,
                  product: mongoose.Types.ObjectId(productId),
                  totalQuantity: quantity,
                  department: req.body.department,
                  expiryArray: [{ expiry: new Date(expiry), quantity, prevQuantity: 0 }],
                  stockIn: [stockInResponse._id]
              });
  
              newStock.save()
                  .then(newStockResponse => {
                      res.status(200).send({ msg: 'Product added successfully', result: stockInResponse });
                  })
                  .catch(error => {
                      res.status(500).send({ msg: 'Error occurred while saving new stock', error });
                  });
          }
      }
  }
  
  
    
    
    
    
     
    async stockInUpdateQuantity(req,res){ //6450eb9087560398aa7377b9 //"Novacoc"
        // if(!req.body.id || req.body.quantity===null || !req.body.productName || !req.body.originalQuantity){ //originalquantity is the original quantity of stock In and quantity is the latest modiefied qunatity
        // res.status(400).send("Bad Request")
        // }else{   
            let price =0
            const {id,quantity,productName,originalQuantity}=req.body;
         let update=   StockIn.updateOne({_id:mongoose.Types.ObjectId(req.body.id)},{quantity:parseInt(req.body.quantity),
                prevQuantity:parseInt(req.body.originalQuantity)})
            .then(response=>{
                // console.log(req.body.originalQuantity,'req.body.originalQuantity')
                // console.log(req.body.quantity,'req.body.quantity')
                let finalquantity = price  + parseInt(req.body.originalQuantity)
                // console.log(finalquantity,'finalquantity')
                   Stock.updateOne({name:req.body.productName},{$inc:{quantity: finalquantity}})

                    .then(responses=>{
                       
                        res.status(200).send({msg:"success",result:"Successfully updated quantity"})
                    })
            })
        // }
        console.log(update)
        
    }

    async stockOutUpdateQuantity(req,res){
        // const {id,quantity,productName,originalQuantity}=req.body
        let prise =0
        if(!req.body.id || !req.body.quantity || !req.body.productName || !req.body.originalQuantity){
            res.status(400).send("Bad Request")
        }else{
         await   StockOut.updateOne({_id:mongoose.Types.ObjectId(req.body.id)},{quantity:parseInt(req.body.quantity),
            prevQuantity:parseInt(req.body.originalQuantity)})
            .then(response=>{
                console.log(prise,'prise')
                 console.log(req.body.quantity,'req.body.quantity')
                 let finalquantity = prise - parseInt(req.body.quantity)
                 console.log(finalquantity,'finalquantity')
                 
                 //yaha par orginal quantity agar 20 hai aur abhi editing quantity 10 hai to 20-10=10 yani 10 hi quantity stockout hui isiliey 10 add kardo
            Stock.updateOne({name:req.body.productName},{$inc:{quantity:finalquantity}})
                .then(responses=>{
                    res.status(200).send({msg:"success",result:responses})
                })
            })
        }
    }



    async stockInDelete(req,res){
        if(!req.body.id || !req.body.quantity || !req.body.productName){
            res.status(400).send("Bad Request")
        }else{
            StockIn.deleteOne({_id:mongoose.Types.ObjectId(req.body.id)})
            .then(response=>{
                // res.status(200).send({msg:"success",result:response})
                Stock.updateOne({name:req.body.productName},{$inc:{quantity:-parseInt(req.body.quantity)}})
                .then(responses=>{
                    res.status(200).send({msg:"success",result:responses})
                })
            })
        }
        
    }
    async stockOutDelete(req,res){
        if(!req.body.id || !req.body.quantity || !req.body.productName){
            res.status(400).send("Bad Request")
        }else{
            StockOut.deleteOne({_id:mongoose.Types.ObjectId(req.body.id)})
            .then(response=>{
                // res.status(200).send({msg:"success",result:response})
                Stock.updateOne({name:req.body.productName},{$inc:{quantity:parseInt(req.body.quantity)}})
                .then(responses=>{
                    res.status(200).send({msg:"success",result:responses})
                })
            })
        }
    }

    async updatestockIn(req,res){
        try {
            let {productType,productName,companyName,productId,supplierId,supplierDocNo,quantity,price,expiry,docNo,unit} = req.body;
            if(!productType||!productName||!companyName||!productId||!supplierId||!supplierDocNo||!quantity||!price||!expiry||!docNo||!unit){
                res.status(400).send("Bad Request")
          console.log(req.body)
            }else{
                quantity = parseInt(quantity)
                // price = parseInt(price)
                price = parseFloat(price)
                
                Stock.findOneAndUpdate({name:req.body.productName})
                .then(async response=>{
                    const newStockIn = new StockIn({
                        name:productName,
                        companyName,
                        productType,
                        docNo,
                        supplierDocNo,
                        supplier:supplierId,
                        quantity,
                        price,
                        expiry,
                        unit
                    },{new: true})
                    const stockInResponse = await newStockIn.save()
                    if(response){
                        //product already exist increase quantity and stock in
                        Stock.findOneAndUpdate({_id:response._id},{$inc:{quantity:quantity},$push:{stockIn:stockInResponse._id}})
                        .then(async stockUpdateResponse=>{
                            console.log(stockUpdateResponse)
                            await StockIn.updateOne({_id:stockInResponse._id},{$set:{prevQuantity:stockUpdateResponse.quantity}})
                            res.status(200).send({msg:'success',result:stockInResponse})
                        })
                    }else{
                        //product doesn't exist stock in and create
                            const newStock = new Stock({
                                name:productName,
                                product:mongoose.Types.ObjectId(productId),
                                quantity,
                                stockIn:[stockInResponse._id]
                            })
                            newStock.save()
                            .then(newStockResponse=>{
                                res.status(200).send({msg:'success',result:stockInResponse})
                            })
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }


    async deleteStockIn(req,res){
        //stock in ki ID bhejo aur jo stockin ki quantity thi, wo bhi bhejo
        console.log(req.body)
        const expiryDateToUpdate = new Date(req.body.expiry); // Replace with the actual expiry date
        const decreaseQuantityBy = req.body.quantity; // Replace with the amount you want to decrease
        StockIn.deleteOne({_id:mongoose.Types.ObjectId(req.body.stockInId)})
        .then(response=>{
            console.log(response)
            Stock.updateOne(
                {
                    name: req.body.productName,
                    'expiryArray.expiry': expiryDateToUpdate
                },
                {
                    $inc: {
                        'expiryArray.$.quantity':-decreaseQuantityBy,
                        'totalQuantity':-decreaseQuantityBy
                    },
                    'expiryArray.$.prevQuantity': decreaseQuantityBy,
                    $pull: {
                        'stockIn': mongoose.Types.ObjectId(req.body.stockInId)
                      }
                }
                )
                .then(stockresponse=>{
                    console.log(stockresponse)
                    res.status(200).send({msg:"success",result:"Successfully Removed StockIn"}) 
                })
        })
    }
   

    async deleteStockOut(req,res){
        console.log(req.body)
        const expiryDateToUpdate = new Date(req.body.expiry); // Replace with the actual expiry date
        const increaseQuantityBy = req.body.quantity; // Replace with the amount you want to decrease
        StockOut.deleteOne({_id:mongoose.Types.ObjectId(req.body.stockOutId)})
        .then(async response=>{
            console.log(response)
        let prevQ = null
        const singleStock = await Stock.findOne({name: req.body.productName})
            console.log(singleStock)
            if(singleStock){
                if(singleStock.expiryArray.length>0){
                    prevQ = singleStock.expiryArray.filter(i=>i.expiry.toString()===expiryDateToUpdate.toString())[0].quantity
                }
            }
            console.log("prevq",prevQ)
            if(prevQ){
                Stock.updateOne(
                    {
                      name: req.body.productName,
                      'expiryArray.expiry': expiryDateToUpdate
                    },
                    {
                      $set: {
                        'expiryArray.$.prevQuantity': req.body.quantity // Assigning the current quantity to prevQuantity
                      },
                      $inc: {
                        'expiryArray.$.quantity':increaseQuantityBy,
                        'totalQuantity':increaseQuantityBy
                      },
                      $pull: {
                        'stockOut': mongoose.Types.ObjectId(req.body.stockOutId)
                      }
                    }
                  )
                        .then(stockresponse=>{
                            console.log(stockresponse)
                            res.status(200).send({msg:"success",result:"Successfully Removed Stockout"}) 
                        })
            }else{
                Stock.updateOne(
                    {
                      name: req.body.productName,
                    },
                    {
                        'totalQuantity': 0,
                        $pull: {
                            'stockOut': mongoose.Types.ObjectId(req.body.stockOutId)
                          }
                    }
                  )
                        .then(stockresponse=>{
                            console.log(stockresponse)
                            res.status(200).send({msg:"success",result:"Successfully Removed Stockout"}) 
                        })
            }

        })
    } 
    // async getPrevStockInInfo(req,res){
    //     console.log(req.body)
    //     if(!req.body.start || !req.body.end || !req.body.department || !req.body.productId){
    //         res.status(400).send("Bad Request")
    //     }else{
    //         // let d1 = date.parse(req.body.to, 'YYYY/MM/DD');
    //         // let d2 = date.parse(req.body.from, 'YYYY/MM/DD'); //format - '2023/01/10'
    //         // console.log(d1)
    //         // StockIn.find({name:req.body.productType,$and:[{createdAt:{$gt:d1}},{createdAt:{$lt:d2}}]})
    //         var startDate = new Date(req.body.start); // Replace with your start date
    //         var endDate = new Date(req.body.end);   // Replace with your end date
    //         var department = n(req.body.department);   // Replace with your end date
    //         // var productIds = req.body.productId;  // Replace with your array of productIds
            
    //         // StockIn.aggregate([
    //         //   {
    //         //     $match: {
    //         //       $and: [
    //         //         { createdAt: { $gte: startDate, $lte: endDate } },
    //         //         { productId: { $in: productIds.map(pid => mongoose.Types.ObjectId(pid)) } }
    //         //       ]
    //         //     }
    //         //   },
    //         //   {
    //         //     $lookup: {
    //         //       from: "stockOut",
    //         //       localField: "productId",
    //         //       foreignField: "productId",
    //         //       as: "stockOutData"
    //         //     }
    //         //   },
    //         //   {
    //         //     $unwind: {
    //         //       path: "$stockOutData",
    //         //       preserveNullAndEmptyArrays: true
    //         //     }
    //         //   },
    //         //   {
    //         //     $project: {
    //         //       _id: 0,
    //         //       name: 1,
    //         //       companyName: 1,
    //         //       productType: 1,
    //         //       docNo: 1,
    //         //       supplierDocNo: 1,
    //         //       supplier: 1,
    //         //       productId: 1,
    //         //       quantityDifference: {
    //         //         $subtract: [
    //         //           { $ifNull: ["$quantity", 0] },
    //         //           { $ifNull: ["$stockOutData.quantity", 0] }
    //         //         ]
    //         //       },
    //         //       price: 1,
    //         //       prevQuantity: 1,
    //         //       expiry: 1,
    //         //       unit: 1,
    //         //       createdAt: 1,
    //         //       updatedAt: 1,
    //         //       __v: 1
    //         //       // Add more fields as needed
    //         //     }
    //         //   }
    //         // ])
            
    //         const productIds = req.body.productId; // Assuming productIds is an array

    //         // StockIn.find({
    //         //   createdAt: {
    //         //     $gte: new Date(req.body.start),
    //         //     $lte: new Date(req.body.end)
    //         //   },
    //         //   productId: { $in: productIds }
    //         // })    
    //         StockIn.aggregate([
    //           {
    //             $match: {
    //               createdAt: { $gte: startDate, $lte: endDate },
    //               productId: { $in: productIds.map(id => mongoose.Types.ObjectId(id)) }
    //             }
    //           },
    //           {
    //             $group: {
    //               _id: "$productId",
    //               stockInDocs: { $push: "$$ROOT" },
    //               totalStockIn: { $sum: "$quantity" }
    //             }
    //           },
    //           {
    //             $lookup: {
    //               from: "StockOut",
    //               localField: "_id",
    //               foreignField: "productId",
    //               as: "stockOutData"
    //             }
    //           },
    //           {
    //             $unwind: {
    //               path: "$stockOutData",
    //               preserveNullAndEmptyArrays: true
    //             }
    //           },
    //           {
    //             $group: {
    //               _id: "$_id",
    //               stockInDocs: { $first: "$stockInDocs" },
    //               totalDifference: { $sum: { $subtract: ["$totalStockIn", { $ifNull: ["$stockOutData.quantity", 0] }] } }
    //             }
    //           },
    //           {
    //             $unwind: "$stockInDocs"
    //           },
    //           {
    //             $project: {
    //               _id: "$stockInDocs._id",
    //               productId: "$_id",
    //               name: "$stockInDocs.name",
    //               department: "$stockInDocs.department",
    //               prevQuantity: "$stockInDocs.prevQuantity",
    //               quantity: "$stockInDocs.quantity",
    //               price:"$stockInDocs.price",
    //               createdAt: "$stockInDocs.createdAt",
    //               expiry: "$stockInDocs.expiry",
    //               totalDifference: 1
    //             }
    //           }
    //         ])       
    //         .then(response=>{
    //             res.status(200).send({msg:"success",result:response})
    //         })       

    //     }
        
    // }
    async getPrevStockInInfo(req, res) {
      console.log(req.body);
      if (!req.body.start || !req.body.end || !req.body.department || !req.body.productId) {
          res.status(400).send("Bad Request");
      } else {
          var startDate = new Date(req.body.start);
          var endDate = new Date(req.body.end);
          const productIds = req.body.productId;
          const department = req.body.department; // Assuming department is provided as a string
  
          StockIn.aggregate([
              {
                  $match: {
                      createdAt: { $gte: startDate, $lte: endDate },
                      productId: { $in: productIds.map(id => mongoose.Types.ObjectId(id)) },
                      department: department // Match by department
                  }
              }, // Comment: Matching documents by department
              {
                  $group: {
                      _id: "$productId",
                      stockInDocs: { $push: "$$ROOT" },
                      totalStockIn: { $sum: "$quantity" }
                  }
              },
              {
                  $lookup: {
                      from: "StockOut",
                      localField: "_id",
                      foreignField: "productId",
                      as: "stockOutData"
                  }
              },
              {
                  $unwind: {
                      path: "$stockOutData",
                      preserveNullAndEmptyArrays: true
                  }
              },
              {
                  $group: {
                      _id: "$_id",
                      stockInDocs: { $first: "$stockInDocs" },
                      totalDifference: { $sum: { $subtract: ["$totalStockIn", { $ifNull: ["$stockOutData.quantity", 0] }] } }
                  }
              },
              {
                  $unwind: "$stockInDocs"
              },
              {
                  $project: {
                      _id: "$stockInDocs._id",
                      productId: "$_id",
                      name: "$stockInDocs.name",
                      department: "$stockInDocs.department",
                      prevQuantity: "$stockInDocs.prevQuantity",
                      quantity: "$stockInDocs.quantity",
                      price: "$stockInDocs.price",
                      createdAt: "$stockInDocs.createdAt",
                      expiry: "$stockInDocs.expiry",
                      totalDifference: 1
                  }
              }
          ])
          .then(response => {
              res.status(200).send({ msg: "success", result: response });
          });
      }
  }
  
    async getStockInDocNo(req,res){
        StockIn.find({},{docNo:1}).sort({createdAt:-1}).limit(1)
        .then(response=>{
            res.status(200).send({msg:'success',result:response})
        })
    }
    async getStockOutDocNo(req,res){
        StockOut.find({},{docNo:1}).sort({createdAt:-1}).limit(1)
        .then(response=>{
            res.status(200).send({msg:'success',result:response})
        })
    }

    async getMonthlyReport(req,res){
        let d1 = date.parse(req.body.from, 'YYYY/MM/DD');
        let d2 = date.parse(req.body.to, 'YYYY/MM/DD'); //format - '2023/01/10'
        console.log(d2,d3)
        StockOut.aggregate([
            {
              $match: {
                $and: [
                  { createdAt: { $gt: d1 } },
                  { createdAt: { $lt: d2 } }
                ]
              }
            },
            {
              $lookup: {
                from: "locations",
                localField: "location",
                foreignField: "_id",
                as: "location"
              }
            }
          ])
        .then(response=>{
            res.status(200).send({msg:"success",result:response})
        })
    }
//,$and:[{createdAt:{$gt:"2022-11-29T18:30:00.000Z"}},{createdAt:{$lt:"2022-12-31T18:30:00.000Z"}} ]
    async getStockReport(req,res){
        if(!req.body.start || !req.body.end || !req.body.selectedLocation){
            res.status(400).send("Bad Request")
        }else{
            StockOut.find({
                createdAt: {
                  $gte: new Date(req.body.start),
                  $lte: new Date(req.body.end)
                },
                location: req.body.selectedLocation._id
              })    
              .populate('productId')          
            .then(response=>{
                res.status(200).send({msg:"success",result:response})
            })
        }
        
        // let d1 = date.parse(req.body.from, 'YYYY/MM/DD');
        // let d2 = date.parse(req.body.to, 'YYYY/MM/DD'); //format - '2023/01/10'
        // console.log(d1,d2)
        // StockOut.find({location:mongoose.Types.ObjectId(req.body.locationId),trainerName:req.body.trainerName,$and:[{createdAt:{$gt:d1}},{createdAt:{$lt:d2}}]})
        // .then(response=>{
        //     res.status(200).send({msg:"success",result:response})
        // })
    }

    async getStockAllStockOut(req,res){
        if(req.body.search){
            StockOut.find({docNo:req.body.search}).populate('location').populate('productId')
            .then(response=>{
                res.status(200).send({msg:"success",result:response})
            })
        }else{
            StockOut.find({}).populate('location').populate('productId')
            .then(response=>{
                res.status(200).send({msg:"success",result:response})
            })
        }
    }

    async getDocumentStockOut(req,res){
        console.log(req.body.docNo)
        StockOut.aggregate([
            // {
            //     $match:req.body.docNo?{docNo:parseInt(req.body.docNo)}:{}
            // },
            // {
            //     $sort:{docNo:-1}
            // },
            // {
            //     $group:{
            //     _id:{
            //     docNo:"$docNo",
            //     },
            //     trainerName:{$push:"$trainerName"},
            //     createdAt:{$push:"$createdAt"}
                
            // }}  
            {
                $group: {
                  _id: "$docNo",
                  stockouts: { $push: "$$ROOT" }
                }
              },
              {
                $sort: {
                  "_id": -1 // Sorting by docNo in ascending order
                }
              }
        ])
        .then(response=>{
            res.status(200).send({msg:"success",result:response})
        })
    }

    async getStockDoucments(req,res){
        console.log(req.body.name)
        if(!req.body.name){
            res.status(400).send("Bad Request")
        }else{
            let stockout = await 
            StockOut.find({name:req.body.name}).sort({docNo:-1})

            let stockin = await 
            StockIn.find({name:req.body.name}).sort({docNo:-1})

            res.status(200).send({msg:"success",result:{stockout:stockout,stockin}})
        }
    }

    async getStockoutByDocNo(req,res){
        if(!req.body.docNo){
            res.status(400).send("Bad Request")
        }else{
            let stockout = await StockOut.aggregate([
                {
                    $match:{docNo:parseInt(req.body.docNo)}
                },
                {
                    $sort:{createdAt:-1}
                },
                {
                    $group:{
                        _id:{
                            docNo:"$docNo",
                            },
                            doc:{
                                $push:{
                                    _id:"$_id",
                                    name:"$name",
                                // productType:"$vitamin",
                                // supplierDocNo:"$supplierDocNo",
                                quantity:"$quantity",
                                unit:"$unit",
                                doctorName:"$doctorName",
                                trainerName:"$trainerName",
                                prevQuantity:"$prevQuantity",
                                expiry:"$expiry",
                                date:"$date",
                                "createdAt":"$createdAt",
                                }
                            }
                    // _id:{
                    // docNo:"$docNo",
                    // },
                    // createdAt:{$push:"$createdAt"},
                    // name:{$push:"$name"},
                    // // productType:{$push:"$vitamin"},
                    // // supplierDocNo:{$push:"$supplierDocNo"},
                    // quantity:{$push:"$quantity"},
                    // unit:{$push:"$unit"},
                    // doctorName:{$push:"$doctorName"},
                    // trainerName:{$push:"$trainerName"},
                    // prevQuantity:{$push:"$prevQuantity"},
                    // date:{$push:"$date"},
                    
                }}  
            ])
            res.status(200).send({msg:"success",result:stockout})
        }

    }
    async getStockInByDocNo(req,res){
        if(!req.body.docNo){
            res.status(400).send("Bad Request")
        }else{
            let stockin = await StockIn.aggregate([
                {
                    $match:{docNo:parseInt(req.body.docNo)}
                },
                {
                    $sort:{createdAt:-1}
                },
                {
                    $group:{
                        _id:{
                            docNo:"$docNo",
                            },
                            doc:{
                                $push:{
                                _id:"$_id",
                                name:"$name",
                                // supplier:"$supplier.name",
                                // productType:"$vitamin",
                                // supplierDocNo:"$supplierDocNo",
                                quantity:"$quantity",
                                unit:"$unit",
                                companyName:"$companyName",
                                productType:"$productType",
                                price:"$price",
                                prevQuantity:"$prevQuantity",
                                expiry:"$expiry",
                                "createdAt":"$createdAt",
                                }
                            }
                    // _id:{
                    // docNo:"$docNo",
                    // },
                    // createdAt:{$push:"$createdAt"},
                    // name:{$push:"$name"},
                    // productType:{$push:"$productType"},
                    // supplierDocNo:{$push:"$supplierDocNo"},
                    // supplier:{$push:"$supplier"},
                    // quantity:{$push:"$quantity"},
                    // unit:{$push:"$unit"},
                    // price:{$push:"$price"},
                    // prevQuantity:{$push:"$prevQuantity"},
                    // expiry:{$push:"$expiry"},
                    
                }} 
            ])
            res.status(200).send({msg:"success",result:stockin})
        }

    }

    async currentStockList(req,res){
        Stock.find({}).populate("stockIn").populate("stockOut")
        .populate({ 
            path: 'stockIn',
            populate: {
              path: 'supplier',
              model: 'Supplier'
            } 
         })
        .populate({ 
            path: 'stockOut',
            populate: {
              path: 'location',
              model: 'Location'
            } 
         })

        .then(response=>{
            res.status(200).send({msg:'success',result:response})
        })
    }

   
      
    async testRoute(req,res){
        Stock.findOne({
            "expiryArray": {
              $elemMatch: {
                "expiry": new Date(1638000000000)
              }
            }
          })
          .then(response=>{
            res.send(response)
          })
          
    }
      
    async stockOuts(req, res,next) {
        console.log("Stockout start--------------------------------- body",req.body)
        // const stockOuts = req.body.stockOuts;
        // const allStockOuts = [];
        for (let i = 0; i < stockOuts.length; i++) {
          const { unit, productName, productId, docNo, locationId, quantity, date, trainerName, doctorName, locationName,expiry,price,locationObject } = stockOuts[i];
          
      
          if (!unit || !productName || !productId || !docNo || !locationId || !date || !trainerName || !doctorName) {
            res.status(400).send("Bad Request");
            return;
          }
      
          let parsedQuantity = parseInt(quantity);
          let newExpiryArray = []
          let totalQuantity = 0
          let stockIndoc = null
          let existingStock = null
          let newStock = null;
          // If the parsed quantity is positive, convert it to negative
          if (parsedQuantity > 0) {
            parsedQuantity = -parsedQuantity;
          }
          if(!expiry){
            //new stock
            newStock = new Stock({
                name:productName,
                product:mongoose.Types.ObjectId(productId),
                totalQuantity:parsedQuantity,
                expiryArray:[],
            })
          }else{
            existingStock = await Stock.findOne({
            name:productName,
            "expiryArray": {
            $elemMatch: {
              "expiry": new Date(expiry)
            }
          }});
            stockIndoc  = await StockIn.findOne({name:productName}).sort({createdAt:-1})
          }


          if (existingStock) {
            // Create a new expiry array object if it exist
            if(expiry){
                newExpiryArray = existingStock.expiryArray.map(item=>{
                    console.log(item.expiry,new Date(expiry))
                    if(item.expiry.toString()===new Date(expiry).toString()){
                        item.prevQuantity = item.quantity
                        item.quantity = item.quantity - quantity    
                    }
                    return item
                });
            }
            console.log("Existing Stock-----StockInDoc",existingStock,stockIndoc)
          } 
      
          // Create a new stock-out record
          const newStockOut = new StockOut({
            name: productName,
            docNo,
            location: locationId,
            locationObject,
            quantity: quantity,
            date,
            trainerName,
            doctorName,
            unit,
            productId:mongoose.Types.ObjectId(productId),
            locationName,
            expiry:expiry?new Date(expiry):null,
            stockInPrice:stockIndoc?stockIndoc.price:0,
            prevQuantity: existingStock ? existingStock.totalQuantity : 0,
            // price:parseInt(price)
            price :parseFloat(price)
          });
      
          const stockOutResponse = await newStockOut.save();
          console.log("stockout response------",stockOutResponse)
          if(!expiry && newStock){
            newStock.stockOut = [stockOutResponse._id]
            let newStockAdd = await newStock.save()
            console.log("new stock added-----",newStockAdd)

          }else{
            newExpiryArray.map(item=>{
                totalQuantity = totalQuantity + item.quantity
            })
            const stockUpdate = await Stock.updateOne({product:mongoose.Types.ObjectId(productId)},{$set:{expiryArray:newExpiryArray,totalQuantity},$push:{stockOut:stockOutResponse._id}})
            console.log("currentSTockupdate-----",stockUpdate)
          }
          allStockOuts.push(stockOutResponse);
        }
      
        res.status(200).send({ msg: 'success', result: allStockOuts });
      }
           
      
    async getSummaryStockout(req,res){
        if(!req.body.start || !req.body.end){
            res.status(400).send("Bad Request")
        }else{
            const startDate = new Date(req.body.start);
            const endDate = new Date(req.body.end);
            const locations = req.body.selectedLocation; // Assuming locations is an array of location names
            
            StockOut.aggregate([
              {
                $match: {
                  createdAt: {
                    $gte: startDate,
                    $lte: endDate
                  },
                  locationName: {
                    $in: locations
                  }
                }
              },
              {
                $group: {
                  _id: "$locationName",
                  total: {
                    $sum: {
                      $multiply: ["$quantity", "$price"]
                    }
                  },
                  documents: {
                    $push: "$$ROOT"
                  }
                }
              }
            ])
            
              .then(response=>{
                res.status(200).send({msg:"success",result:response})
              })
        }

          
    }

      

}

const productController = new ProductController();
module.exports=productController;