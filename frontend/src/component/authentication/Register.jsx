import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../redux/api/authApi';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader';
import toast from 'react-hot-toast';

const Register=()=>{
    const [user,setUser]=useState({
        first:'',
        last:'',
        email:"",
        password:""
    })
    const {first,last,email,password}=user;
    const navigate=useNavigate();
    const [register,{error,isSuccess,isLoading}]=useRegisterMutation();
    const {isAuthenticated}=useSelector((state)=>state.user);
    useEffect(()=>{
        if(isAuthenticated){
            navigate("/");
        }
        if(error){
            toast.error(error?.data?.message)
        }if(isSuccess){
            toast.success("Registered Successfully")
            navigate("/login");
        }
    },[error,navigate,isAuthenticated,isSuccess])
    const submitHandler=(e)=>{
        e.preventDefault();
        const signUpData={
            first,last,email,password
        }
        register(signUpData);
    }
     const onChange =(e)=>{
           setUser({...user,[e.target.name]:e.target.value})
    }   
    if(isLoading) return <Loader/>;
    return(
        <>
     <div id="register">
        <form onSubmit={submitHandler}>
    <h2 class="text-center">Create Your Account</h2>
     <p id="o1">
            <label class="mx-1">First Name</label><br />
            <input 
            type="text" 
            id="p8"
            name="first"
            value={first}
            onChange={onChange}
            />
            </p>
            <p id="o2">
            <label class="mx-1">Last Name</label><br />
            <input 
            type="text" 
            id="p8"
            name="last"
            value={last}
            onChange={onChange}
            />
            </p>
 <p>
    <label class="mx-1">Email</label>
    <input 
    type="email" 
    id="p8"
    name="email"
    value={email}
    onChange={onChange}
    />
 </p>
 <p>
     <label class="mx-1">Password</label>
    <input 
    type="password" 
    id="p8"
    name="password"
    value={password}
    onChange={onChange}
    />
 </p>
            <button id="date" disabled={isLoading}><b>{isLoading ? "Processing..." : "Sign Up"}</b></button>
       </form>
        </div>
        </>
    )
}
export default Register;