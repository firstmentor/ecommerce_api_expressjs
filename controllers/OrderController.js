const OrderModel = require("../models/Order");

class OrderController{
    static newOrder = async(req,res) => {
        try{
            // console.log(req.body)
            const data = await OrderModel.create(req.body)
            res
            .status(201)
            .json({ status: "success", message: "Order added Successfully 😃🍻"});
        }catch(err){
            console.log(err)
        }
    }
    static getSingleOrder = async(req,res) => {
        try{
            const data = await OrderModel.findById(req.params.id)
            res.status(200).json({
                success: true,
                data
            })
        }catch(err){
            console.log(err)
        }
    }

    //user (after user login)
    static myOrder = async(req,res) => {
        try{
            const data = await OrderModel.find()
            res.status(200).json({
                success: true,
                data
            })
        }catch(err){
            console.log(err)
        }
    }

    //admin
    static getAllOrders = async(req,res) => {
        try{
            const data = await OrderModel.find()
            res.status(200).json({
                success: true,
                data
            })
        }catch(err){
            console.log(err)
        }
    }
    static deleteOrder = async(req,res) => {
        try{
            const data = await OrderModel.findByIdAndDelete(req.params.id)
            res
            .status(200)
            .send({ status: "success", message: "Order deleted successfully 😃🍻"});
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = OrderController