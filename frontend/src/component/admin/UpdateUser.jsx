import React, { useEffect, useState } from 'react';
import AdminLayout from "../layout/AdminLayout.jsx";
import {useGetUserDetailQuery, useUpdateUserMutation} from "../redux/api/userApi.js";
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";

const UpdateUser=()=>{
    const [first,setFirst]=useState('');
    const [last,setLast]=useState('');
    const [email,setEmail]=useState('');
    const [role,setRole]=useState('');
    const navigate=useNavigate();
    const params=useParams();
    const {data} = useGetUserDetailQuery(params?.id);
    const [updateUser,{error,isSuccess,isLoading}]=useUpdateUserMutation();

    useEffect(()=>{
        if(data?.user){
            setFirst(data?.user?.first);
            setLast(data?.user?.last);
            setEmail(data?.user?.email);
            setRole(data?.user?.role);
        };
    },[data])

   useEffect(()=>{
        
        if(error){
    toast.error(error?.data?.message || 'Error Occured');
        };
        if(isSuccess){
    toast.success('User Updated');
    navigate("/admin/users");
        }
    },[error,isSuccess,navigate]);

        const submitHandler=(e)=>{
            e.preventDefault();
            updateUser({id:params?.id,body:{first,last,email,role}});
        }
         return(
        <>
        <AdminLayout>
            <div class="update">
    <form onSubmit={submitHandler}>
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
            </p>
            <p>
    <label class="mx-1 mt-4">Email</label>
    <input 
    type="text"
    id="p8"
    name="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
 </p>
  <p>
             <label class="mx-1 mt-4">Role</label>
             <select
             className="form-select"
             id="category_field"
             name="role"
             value={role}
             onChange={(e)=>setRole(e.target.value)}
             >
       <option value="user">
        user
       </option>
       <option value="admin">
        admin
       </option>
         </select>
         </p>
            <button id="date" type="submit" disabled={isLoading}><b>{isLoading ? "Updating..." : "Update"}</b></button>
            </form>
        </div>
        </AdminLayout>
        </>
    )
}
export default UpdateUser;