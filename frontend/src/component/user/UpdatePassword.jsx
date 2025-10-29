import React, { useEffect, useState } from 'react';
import UserLayout from '../layout/UserLayout';
import { useNavigate } from 'react-router-dom';
import { useUpdatePasswordMutation } from '../redux/api/userApi';
import toast from 'react-hot-toast';

const UpdatePassword=()=>{
    const [oldPassword,setOldPassword]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();
    const [updatePassword,{isLoading,error,isSuccess}]=useUpdatePasswordMutation();

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message || 'Error Occured');
        }
        if(isSuccess){
            toast.success("Password Updated");
            navigate("/me/profile");
        }
    },[error,isSuccess,navigate])
    const submitHandler = (e) => {
        e.preventDefault();
        const userData={
            oldPassword,
            password
        }
        updatePassword(userData);
    };

    return<UserLayout>
      <div class="update">
    <form onSubmit={submitHandler}>
    <h2>Update Profile</h2>
 <p>
    <label class="mx-1 mt-4">Old Password</label>
    <input 
    type="password" 
    id="p8"
    value={oldPassword}
    onChange={(e)=>setOldPassword(e.target.value)}
    />
 </p>
 <p>
     <label class="mx-1">New Password</label>
    <input 
    type="password" 
    id="p8"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
 </p>
            <button id="date" disabled={isLoading}><b>{isLoading ? "Updating..." : "Update Password"}</b></button>
            </form>
        </div>
        </UserLayout>
        
}
export default UpdatePassword;