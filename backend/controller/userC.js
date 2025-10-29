import User from '../models/userM.js';
import sendToken from '../utils/token.js';
import crypto from 'crypto';
import {sendEmail} from '../utils/sendEmail.js';
import PendingUser from '../models/PendingUser.js';
import bcrypt from 'bcrypt';
import { delete_file, upload_file } from '../utils/cloudinary.js';
import { getEmailVerificationTemplate } from '../utils/emailVerificationTemplate.js';
import { getResetPasswordTemplate } from '../utils/emailTemplate.js';

export const registerUser = async (req, res) => {
  try {
    const { first, last, email, password } = req.body;

    if (!first || !last || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old pending users
    await PendingUser.deleteMany({ email });

    // Create pending user
    await PendingUser.create({
      first,
      last,
      email,
      password: hashedPassword,
      code: verificationCode,
      codeExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send email
    const message =getEmailVerificationTemplate(verificationCode);

    await sendEmail({
      to: email,
      subject: "Your Verification Code",
      html: message,
    });

    res.status(201).json({ success: true, message: "Verification code sent to email." });
  } catch (err) {
    console.error("❌ Register error full:", err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};
export const verifyRegistration = async (req, res) => {
  try {
    const { code } = req.body;

    const pendingUser = await PendingUser.findOne({
      code,
      codeExpire: { $gt: Date.now() },
    });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const user = await User.create({
      first: pendingUser.first,
      last: pendingUser.last,
      email: pendingUser.email,
      password: pendingUser.password, 
    });

    await PendingUser.deleteOne({ _id: pendingUser._id });

    res.status(200).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
};

export const loginUser = async (req, res) => {
  
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter email and password",
      });
    }

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    const user = await User.findOne({ email: emailTrimmed }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    let isPasswordMatched = false;
    try {
      isPasswordMatched = await user.comparePassword(passwordTrimmed);
    } catch (err) {
      console.error("Error comparing password:", err);
      return res.status(500).json({
        success: false,
        message: "Server error during password verification",
      });
    }

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

sendToken(user, 200, res);
  
};

export const logOut=async(req,res,next)=>{
    res.cookie("token",null,{
expires:new Date(Date.now()),
httpOnly:true
    });
    res.status(200).json({
        message:"Logged out"
    });
};



// Forgot Password
export const forgotPassword = async (req, res) => {
  let user;
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email.",
      });
    }

    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/password/reset/${resetToken}`;

    // Simple HTML template
    const message = getResetPasswordTemplate(user.first,user.last,resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Password Recovery - Saadify",
      html: message,
    });

    return res.status(200).json({
      success: true,
      message: `Password reset email has been sent to ${user.email}`,
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);

    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    return res.status(500).json({
      success: false,
      message: "Email could not be sent. Please try again later.",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide password and confirm password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    user.password = password; // pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

//admin
export const getUser = async (req, res, next) => {
const users =await User.find();
res.status(200).json({
    users,
})
};

export const uploadAvatar = async (req, res) => {
  try {
    const base64Image = req.body.avatar;

    if (!base64Image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload base64 directly to Cloudinary
    const avatarResponse = await upload_file(base64Image, 'shopit/avatars');

    // Update user's avatar in DB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarResponse },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({ message: 'Avatar upload failed' });
  }
};
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?._id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }


    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
const newUserData ={
    first:req.body.first,
    last:req.body.last,
};
const user=await User.findByIdAndUpdate(req.user._id,newUserData,{new:true});
res.status(200).json({
    user,
})
};

//admin
export const getUserProfile=async(req,res,next)=>{
const user =await User.findById(req?.user?._id);
res.status(200).json({
    user
})
};

export const getUserDetails = async (req, res, next) => {
  const user=await User.findById(req.params.id);
  if(!user){
    return next(`User not found with id: ${req.params.id}`);
  }
res.status(200).json({
    user,
})
};


export const updateUser = async (req, res, next) => {
const newUserData={
first:req.body.first,
last:req.body.last,
email:req.body.email,
role:req.body.role
}
const user =await User.findByIdAndUpdate(req.params.id,newUserData,{new:true});
res.status(200).json({
    user,
})
};

export const deleteUser =async(req,res,next)=>{
const user=await User.findById(req.params.id);
if(!user){
  return next(`User not found with this id:${req.params.id}`);
};
if(user?.avatar?.public_id){
  await delete_file(user?.avatar?.public_id);
}
await user.deleteOne();
res.status(200).json({
    message:"User is deleted"
})
};