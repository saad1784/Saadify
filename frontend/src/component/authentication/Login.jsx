import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useLoginMutation } from "../redux/api/authApi.js";
import { useSelector } from 'react-redux';
import Loader from "../layout/Loader.jsx";
import toast from 'react-hot-toast';

const Login=()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const [login,{isLoading,error,isSuccess}]=useLoginMutation();
    const {isAuthenticated}=useSelector((state)=>state.user);

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/");
        }
    },[isAuthenticated,navigate]);
    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }
        if(isSuccess){
            toast.success("Successfully Logged In");
            navigate("/");
        }
    },[error,isSuccess]);
    const submitHandler=async (e)=>{
        e.preventDefault();
        const loginData={
            email,password
        }
        login(loginData);
    }
    if(isLoading) return <Loader />
    return(
        <>
        <div id="register" style={{marginTop:"15vh"}}>
        <form onSubmit={submitHandler}>
    <h2 class="text-center">Login Your Account</h2>
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
            <button id="date" disabled={isLoading}><b>{isLoading ? "Processing..." : "Sign In"}</b></button>
       </form>
        </div>
        </>
    )
}
export default Login;