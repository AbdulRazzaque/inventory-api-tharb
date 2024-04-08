
const Order = require("../models/Order")

class OrderController{


        async CreateOrder(req,res,next){
            const {refNo,productId,productName,memberId,memberName,requiredQuantity,status}= req.body
            // if(!refNo || !productId || !productName || !memberId || !memberName || !requiredQuantity ){
            //     res.status(400).send("All field required")
            // }
            const existingrefNo = await Order.findOne({refNo:refNo});
            if(existingrefNo){
                res.status(400).send("This RefNo is already exist")
            }
            else{
                const neworder = new Order ({
                    refNo,
                    productId,
                    productName,
                    memberId,
                    memberName,
                    requiredQuantity,
                    status


                })
                neworder.save()
                .then(response=>{
                    res.status(200).send({msg:"Order Successfully",result:response})
                })
            }
        }

        async getAllOrder(req,res){
            
         await Order.find({_id:req.params.id})
         .populate("productId")
        .populate("memberId")
            .then(response=>{
                res.status(200).send({msg:"Sucess",result:response})
            })
        }

        async updateOrder(req, res) {
            const { refNo, productId, productName, memberId, memberName, status } = req.body;
            
            if (!refNo || !productId || !productName || !memberId || !memberName) {
                res.status(400).send("All fields are required");
            } else {
                try {
                    await Order.updateOne(
                        { _id: req.params.id },
                        { $set: { refNo, productId, productName, memberId, memberName, requiredQuantity, status } }
                    )
                    .then(resposne=>{
                        res.status(200).send({msg:"succses",result:resposne})
                    })
                } catch (error) {
                    res.status(500).send({ msg: "Internal Server Error", error: error.message });
                }
            }
        }
        async deleteOrder (req,res,next){
            try{
              const deleteOrder =  await Order.findByIdAndRemove({_id:req.params.id})
              if(!deleteOrder){
                return next (new Error ("Somting is wrong"));
              }
              res.json(deleteOrder)
            } catch(error){
                return next (error);
            }

        }
        
}

const orderController = new OrderController();
module.exports = orderController