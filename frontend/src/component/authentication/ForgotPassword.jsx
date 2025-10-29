import React, { useEffect, useState } from 'react';
import {useForgotPasswordMutation} from '../redux/api/userApi.js';
import {useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";
import Loader from  "../layout/Loader.jsx";

const ForgotPassword=()=>{
    const [email,setEmail]=useState();
    const [forgotPassword,{isLoading,error,isSuccess}]=useForgotPasswordMutation();
    const navigate=useNavigate();
    const {isAuthenticated}=useSelector((state)=>state.user);

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/");
        }
        if(error){
            toast.error(error?.data?.message)
        }
        if(isSuccess){
            toast.success("Email has sended check your inbox")
        }
    },[isAuthenticated,isSuccess,error,navigate])
    const submitHandler=()=>{
        if(!email){
            toast.error("Enter the email for request");
        }
        forgotPassword({email})
    }
    if(isLoading) return <Loader />
    return(
       <div id="register" style={{marginTop:"17vh"}}>
        <form onSubmit={submitHandler}>
    <h2 class="text-center">Forgot Password</h2>
 <p>
    <label class="mx-1">Email</label>
    <input 
    type="email" 
    id="p8"
    name="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
 </p>
            <button id="date" disabled={isLoading}><b>{isLoading ? "Processing..." : "Submit"}</b></button>
       </form>
        </div>
    )
}
export default ForgotPassword;