import React, { useState,useEffect } from 'react';
import { useVerifyRegistrationMutation } from '../redux/api/authApi';
import {useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const VerifyEmail=()=>{
    const [otp,setOtp]=useState("");
    const [verifyRegistration,{isLoading,error,isSuccess}]=useVerifyRegistrationMutation();
   const navigate=useNavigate();
   const {isAuthenticated}=useSelector((state)=>state.user);

   useEffect(()=>{
    if(isAuthenticated){
      navigate("/");
    }
    if(error){
        toast.error(error?.data?.mesage)
    }
    if(isSuccess){
        toast.success("Email successfully verified")
        navigate("/login");
    }
   },[isAuthenticated,isSuccess,error,navigate])
  const submitHandler = (e) => {
  e.preventDefault();
  if (!otp) {
    toast.error("Enter the Code for verification");
    return;
  }
  verifyRegistration({ code: otp })
    .unwrap()
    .then((res) => {
      toast.success("Email successfully verified");
      navigate("/login");
    })
    .catch((err) => {
      toast.error(err?.data?.message || "Verification failed");
    });
};

    return(
        <>
        <div id="register" style={{marginTop:"17vh"}}>
        <form onSubmit={submitHandler}>
    <h2 class="text-center">Verify Email</h2>
 <p class="mt-4">
    <input 
    type="otp" 
    id="p8"
    name="otp"
    placeholder="Enter the 6 digtit OTP"
    value={otp}
    onChange={(e)=>setOtp(e.target.value)}
    />
 </p>
            <button id="date" disabled={isLoading}><b>{isLoading ? "Processing..." : "Submit"}</b></button>
       </form>
        </div>
        </>
    )
}
export default VerifyEmail;