import React, { useEffect, useState } from 'react';
import {useResetPasswordMutation} from '../redux/api/userApi.js';
import {useNavigate, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader.jsx';

const ResetPassword=()=>{
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [resetPassword,{isLoading,error,isSuccess}]=useResetPasswordMutation();
   const params=useParams();
   const navigate=useNavigate();
   const {isAuthenticated}=useSelector((state)=>state.user);

   useEffect(()=>{
    if(isAuthenticated){
        navigate("/");
    }
    if(error){
        toast.error(error?.data?.message);
    }
    if(isSuccess){
        toast.success("Password changed successfully");
        navigate("/login");
    }
   },[isAuthenticated,isSuccess,error,navigate])
   const submitHandler=(e)=>{
    e.preventDefault();
    const data={password,confirmPassword};
    resetPassword({token:params?.token,body:data})
   }
   if(isLoading) return <Loader />
    return(
        <>
       <div id="register" style={{marginTop:"15vh"}}>
        <form onSubmit={submitHandler}>
    <h2 class="text-center">Reset Password</h2>
 <p>
    <label class="mx-1">Password</label>
    <input 
    type="password" 
    id="p8"
    name="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
 </p>
 <p>
     <label class="mx-1">Confirm Password</label>
    <input 
    type="password" 
    id="p8"
    name="confirmPassword"
    value={confirmPassword}
    onChange={(e)=>setConfirmPassword(e.target.value)}
    />
 </p>
            <button id="date" disabled={isLoading}><b>{isLoading ? "Processing..." : "Reset Password"}</b></button>
       </form>
        </div>
        </>
    )
}
export default ResetPassword;