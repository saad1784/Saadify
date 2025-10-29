import jwt from "jsonwebtoken";
import User from "../models/userM.js";


export const isAuthenticatedUser = async (req, res, next) => {
 const token = req.cookies?.token;
console.log(token);
  if (!token) {
    return res.status(401).json({
      message: "Please login to access this resource",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


export const authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
if(!roles.includes(req.user.role)){
      return res.status(403).json({
message:`Role (${req.user.role}) is not allowed to access this resource`
    });
}
next();
    };
};