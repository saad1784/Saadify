import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    first: { 
      type: String,
       required: true 
      },
      last: { 
      type: String,
       required: true 
      },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: {
       type: String, 
       required: true 
      },
    code: { 
      type: String, 
      required: true 
    },
    codeExpire: {
       type: Date, 
       required: true
       },
  },
  { timestamps: true }
);

export default mongoose.model("PendingUser", pendingUserSchema);
