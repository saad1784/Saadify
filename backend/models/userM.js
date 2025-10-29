import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema=new mongoose.Schema(
    {
        first:{
            type:String,
            required:[true,"Enter the first name."],
            maxLength:[10,"First name cannot exceeds more."]
        },
        last:{
            type:String,
            required:[true,"Enter the last name."],
            maxLength:[10,"Last name cannot exceeds more."]
        },
        email:{
            type:String,
            required:[true,"Enter the email."],
            unique:[true,"This Email is already taken."]
        },
        password:{
            type:String,
            required:[true,"Enter the Password"],
            minLength:[6,"Password cannot be too small."],
        },avatar:{
            public_id:String,
            url:String,
        },
        role:{
            type:String,
            default:"user"
        },
        resetPasswordToken: String,
    resetPasswordExpire: Date,
    },
    { timestamps:true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
    };

    userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};


userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};


export default mongoose.model("User", userSchema);