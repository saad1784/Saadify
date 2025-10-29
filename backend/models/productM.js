import mongoose from "mongoose";

function generateProductId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SPX${randomNum}`;
}

function generateReviewId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SRX${randomNum}`;
}

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: generateProductId,
    },
    name: {
      type: String,
      required: [true, "Enter the product name"],
      maxLength: [100, "Product name cannot exceed 75 characters"],
    },
    price: {
      type: Number,
      required: [true, "Enter the product price"],
      maxLength: [7, "Product price cannot exceed 7 digits"],
    },
    realPrice: {
      type: Number,
      maxLength: [7, "Product price cannot exceed 7 digits"],
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be less than 0"],
      max: [100, "Discount cannot be more than 100"],
    },
    description: {
      type: String,
      required: [true, "Enter the description about product"],
      maxLength: [1000, "Description cannot exceed 200 characters"],
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    color: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Select the product category"],
      enum: {
        values: [
          "Electronics",
          "Fashion",
          "Beauty",
          "Outdoors",
          "Child Products",
          "Accessories",
        ],
      },
    },
    stock: {
      type: Number,
      required: [true, "Enter the stock of product"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        _id: {
          type: String,
          default: generateReviewId, // Each review gets a unique _id
        },
        user: {
          _id: { type: mongoose.Schema.Types.ObjectId, required: true },
          first: { type: String },
          last: { type: String },
          email: { type: String },
          avatar: {
            public_id: { type: String },
            url: { type: String },
          },
          role: { type: String },
        },
        rating: { type: Number, default: 0, max: 5 },
        comment: { type: String, required: true },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.reviews.forEach((review) => {
    if (!review._id) review._id = generateReviewId();
  });
  next();
});

export default mongoose.model("Product", productSchema);
