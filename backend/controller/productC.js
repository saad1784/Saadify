import Product from '../models/productM.js';
import Order from '../models/orderM.js';
import User from '../models/userM.js';
import mongoose from "mongoose";
import APIFilters from '../utils/appFilter.js';
import {delete_file,upload_file} from "../utils/cloudinary.js";

export const getProducts=async (req,res,next)=>{

   const appfilters= new APIFilters(Product.find(),req.query).search().filters();
   let products =await appfilters.query;
let filteredProductCount =products.length;

    res.status(200).json({
        filteredProductCount,
        products
    })
}

export const createProduct = async (req, res) => {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(200).json({
      success: true,
      product,
    });
};

export const getOneProduct= async (req,res) => {
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(400).json({
            message:"Product not found"
        });
    };
    res.status(200).json({
        product
    });
}

//admin
export const getAdminProducts=async (req,res,next) =>{
    const products =await Product.find();
    
    res.status(200).json({
        products
    });
};

export const updateProduct=async (req , res,next) =>{
    let product =await Product.findById(req.params.id);
if(!product){
       return next("Product Not Found",404);  
}
product =await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json({
        product
    });
};


export const uploadProductImages=async (req , res,next) =>{
    let product =await Product.findById(req.params.id);
if(!product){
  return next(new ErrorHandler("Product Not Found",404)); 
}

const uploader=async (image)=>upload_file(image,"shopit/products");
const urls=await Promise.all((req?.body?.images).map(uploader));

product?.images?.push(...urls);
await product?.save();

    res.status(200).json({
        product
});

};

export const deleteProductImage=async (req , res,next) =>{
    let product =await Product.findById(req.params.id);
if(!product){
  return next(new ErrorHandler("Product Not Found",404)); 
}
const isDeleted=await delete_file(req.body.imgId);
if(isDeleted){
product.images=product?.images?.filter(
  (img)=>img.public_id !== req.body.imgId
)
}
await product?.save();
    res.status(200).json({
        product
});

};



export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next("Product not found", 404);
    }
    for (let img of product.images) {
      await delete_file(img.public_id);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error) {
    return next(error.message, 500);
  }
};

export const createProductReviews = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) return res.status(400).json({ error: "Product not found" });

    // Embed full user info automatically
    const review = {
      user: {
        _id: req.user._id,
        first: req.user.first,
        last: req.user.last,
        email: req.user.email,
        avatar: req.user.avatar
          ? { public_id: req.user.avatar.public_id, url: req.user.avatar.url }
          : null,
        role: req.user.role || "user",
      },
      rating: Number(rating),
      comment,
    };

    // Check if user already reviewed
    const isReviewed = product.reviews.find(
      (r) => r.user._id.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      // Update existing review
      product.reviews.forEach((rev) => {
        if (rev.user._id.toString() === req.user._id.toString()) {
          rev.comment = comment;
          rev.rating = Number(rating);
          rev.user = review.user; // update user info automatically
        }
      });
    } else {
      // Add new review
      product.reviews.push(review);
    }

    // Update product stats
    product.numOfReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: isReviewed ? "Review updated" : "Review added",
      reviews: product.reviews,
      numOfReviews: product.numOfReviews,
      ratings: product.ratings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};



export const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
      

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { productId, id } = req.query;

    // productId is a string (e.g., "SPX2232"), so we only validate the review id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid or missing review ID" });
    }

    // Find product by custom string ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Filter out the review to be deleted
    product.reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== id.toString()
    );

    // Update review counts and average rating
    product.numOfReviews = product.reviews.length;
    product.ratings =
      product.reviews.length === 0
        ? 0
        : product.reviews.reduce((acc, item) => acc + item.rating, 0) /
          product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const canUserReview=async (req , res) =>{
   const orders=await Order.find({
user:req.user._id,
"orderItems.product":req.query.productId
   });
   if(orders.length === 0){
    return res.status(200).json({canReview:false})
   }
    res.status(200).json({
        canReview:true
    });

};