import Order from "../models/orderM.js";
import Product from "../models/productM.js";
import crypto from "crypto";

export const newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      itemPrice,
      deliveryCharges,
      totalAmount,
      paymentMethod,
      paymentInfo,
    } = req.body;

    // ✅ Generate unique token (for secure thank-you validation)
    const pixelToken = crypto.randomBytes(16).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min validity

    // ✅ Create the order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      itemPrice,
      deliveryCharges,
      totalAmount,
      paymentMethod,
      paymentInfo,
      user: req.user._id,
      pixelToken,
      tokenExpiresAt,
      tokenUsed: false,
    });

    // ✅ Reduce stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      product.stock = Math.max(product.stock - item.quantity, 0);
      await product.save({ validateBeforeSave: false });
    }

    // ✅ Send token back for thank-you page verification
    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
      token: pixelToken,
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.query.t;
    const order = await Order.findById(id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (
      !token ||
      order.pixelToken !== token ||
      order.tokenUsed ||
      (order.tokenExpiresAt && order.tokenExpiresAt < new Date())
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
    order.tokenUsed = true;
    await order.save();
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const getOrders =async (req,res,next)=>{
const orders=await Order.find({user:req.user._id});
res.status(200).json({
        orders,
    });
};

export const getOnlyOrderDetail =async (req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next("Order not found with this Id",404);
    };
    res.status(200).json({
        order,
    })
};

//admin
export const allOrders =async (req,res,next)=>{
const orders=await Order.find();
res.status(200).json({
        orders,
    });
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "No order found with this ID" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ success: false, message: "This order has already been delivered" });
    }

    let productNotFound=false;
    // Use for...of to handle async properly
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product.toString());

      if (!product) {
        productNotFound=true;
        break
      }

      product.stock = product.stock - item.quantity;
      await product.save({ validateBeforeSave: false });
    }
    if(productNotFound){
      return res.status(404).json({ message: "The order not found with one and more ID's" });
    }

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save(); // Save the updated order

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });
  } catch (error) {
    next(error); // Pass error to your error handler middleware
  }
};

export const deleteOrder =async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next("Order not found with this Id",404);
    };
    await order.deleteOne();
    res.status(200).json({
        success:true,
    })
};

async function getSalesData(startDate,endDate) {
  const salesData=await Order.aggregate([
    {
    $match:{
      createdAt:{
        $gte:new Date(startDate),
        $lte:new Date(endDate)
    },
  },
},
{
  $group:{
    _id:{
      date: {$dateToString: {format:"%Y-%m-%d", date:"$createdAt"}},
      },
      totalSales: { $sum: "$totalAmount" },
      numOrders:{$sum:1}
    
  },
},
  ]);

  //Creating Map
  const salesMap=new Map();
  let totalSales=0;
  let totalNumOrders=0;

  salesData.forEach((entry)=>{
    const date=entry?._id.date;
    const sales=entry?.totalSales;
    const numOrders=entry?.numOrders;

    salesMap.set(date,{sales,numOrders});
    totalSales += sales;
    totalNumOrders += numOrders;
  });
  const dateBetweens=getDatesBetween(startDate,endDate);

  //create final sales
  const finalSalesData=dateBetweens.map((date)=>({
    date,
    sales:(salesMap.get(date) || {sales:0}).sales,
    numOrders:(salesMap.get(date) || {numOrders:0}).numOrders,
  }));
  return {salesData:finalSalesData,totalSales,totalNumOrders}
};

function getDatesBetween(startDate,endDate){
  const dates=[];
  let currentDate=new Date(startDate);
  while(currentDate <= new Date(endDate)){
    const formattedDate =currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() +1)
  }
  return dates;
}

export const getSales =async (req,res,next)=>{
const startDate=new Date(req.query.startDate);
const endDate=new Date(req.query.endDate);

startDate.setUTCHours(0,0,0,0);
endDate.setUTCHours(23,59,59,999);

const {salesData,totalSales,totalNumOrders} =await getSalesData(startDate,endDate);

    res.status(200).json({
        totalSales,
        totalNumOrders,
        sales:salesData,
    });
};