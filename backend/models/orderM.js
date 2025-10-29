import mongoose from "mongoose";

function generateOrderId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SOX${randomNum}`;
}

const orderSchema= new mongoose.Schema({
    _id: {
    type: String,
    default: generateOrderId,
  },
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true,
        },
        phoneNo:{
            type:String,
            required:true,
        },instructions:{
            type:String,
            required:false,
            maxLength:[500,"Instruction Note Cannot too long."]
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            },
            image:{
                type:String,
                required:false,
            },price:{
                type:String,
                required:true
            },
            product:{
                type:String,
                required:true,
                ref:"product"
            },color:{
                type:String,
            }
        },
    ],
    paymentMethod:{
            type:String,
            required:[true,"Select the payment method"],
            enum:{
                values:["COD","BANK"],
                message:"Select: COD or BANK"
            }
        },
        paymentInfo:{
            id:String,
            status:String,
        },
        itemPrice:{
            type:Number,
            required:true,
        },deliveryCharges:{
            type:Number,
            required:true,
        },totalAmount:{
            type:Number,
            required:true
        },orderStatus:{
            type:String,
            enum:{
                values:["Processing","Shipped","Delivered"],
                message:"Select correct order status",
            },
            default:"Processing",
        },
        pixelToken: { type: String, default: null },
        tokenUsed: { type: Boolean, default: false },
        tokenExpiresAt: { type: Date, default: null },
        deliveredAt:Date
},{timestamps:true});
export default mongoose.model("Order",orderSchema);