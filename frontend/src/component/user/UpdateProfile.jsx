import React, { useEffect, useState } from 'react';
import UserLayout from '../layout/UserLayout';
import { useNavigate } from 'react-router-dom';
import {useUpdateProfileMutation, useUploadAvatarMutation} from '../redux/api/userApi.js';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader.jsx';

const UpdateProfile=()=>{
    const [first,setFirst]=useState('');
    const [last,setLast]=useState('');
    const navigate=useNavigate();
    const [updateProfile,{isLoading,error,isSuccess}]=useUpdateProfileMutation();
    const {user}=useSelector((state)=>state.user);

    const [avatar,setAvatar]=useState("");
    const [avatarPreview,setAvatarPreview]=useState(user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg")
    const [uploadAvatar,{error:avatarError}] = useUploadAvatarMutation();
    useEffect(()=>{
        if(avatarError){
            toast.error(error?.data?.message || "Error Uploading Avatar");
        }
    },[avatarError])

    useEffect(()=>{
        if(user){
            setFirst(user?.first);
            setLast(user?.last);
        };
        if(error){
            toast.error(error?.data?.message || "Error Occured");
        }if(isSuccess){
            toast.success('Successfully Done');
            navigate("/me/profile");
        }
    },[user,isSuccess,error,navigate]);
     const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Always update the profile first
    const profileRes = await updateProfile({ first, last }).unwrap();

    // Then try to upload avatar (if selected)
    let avatarRes;
    if (avatar) {
      try {
        avatarRes = await uploadAvatar({ avatar }).unwrap();
      } catch (avatarErr) {
        console.error("Avatar upload failed:", avatarErr);
        toast.error(avatarErr?.data?.message || "Error uploading avatar");
      }
    }

    // ✅ Show success only if BOTH succeeded (or no avatar uploaded)
    if (profileRes && (!avatar || avatarRes)) {
      toast.success("Profile updated successfully!");
      navigate("/me/profile");
    }
  } catch (profileErr) {
    console.error("Profile update failed:", profileErr);
    toast.error(profileErr?.data?.message || "Error updating profile");
  }
};

    const onChange =(e)=>{
    const reader = new FileReader();
    reader.onload=()=>{
        if(reader.readyState===2){
            setAvatarPreview(reader.result);
            setAvatar(reader.result);
        }
    }
    
    reader.readAsDataURL(e.target.files[0]);
  }

    if(isLoading) return <Loader />;
    return<UserLayout>
 <div class="update">
    <form onSubmit={handleSubmit}>
    <h2>Update Profile</h2>
    <p id="o1">
            <label class="mx-1">First Name</label><br />
            <input 
            type="text" 
            id="p8"
            name="first"
            value={first}
            onChange={(e)=>setFirst(e.target.value)}
            />
            </p>
            <p id="o2">
            <label class="mx-1">Last Name</label><br />
            <input 
            type="text" 
            id="p8"
            name="last"
            value={last}
            onChange={(e)=>setLast(e.target.value)}
            />
            </p><br/><br /><br />

            <p id="o3"><img 
            src={avatarPreview} className="rounded-circle" 
            alt="" 
            id="ene"
            /></p>
           <p id="o4"> <label class="mx-1" htmlFor="customFile">Choose Avatar</label><br />
            <input 
            type="file"
            name="avatar"
            id="customFile"
            accept="image/*"
            onChange={onChange}
            />
            </p>
            <button id="date" disabled={isLoading}><b>{isLoading ? "Updating..." : "Update"}</b></button>
            </form>
        </div>
        </UserLayout>
        
}
export default UpdateProfile;