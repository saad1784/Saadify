import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import {useNewProductsMutation} from '../redux/api/productApi.js';
import toast from "react-hot-toast";
import {PRODUCT_CATEGORIES} from "../constant/constant.js";

const CreateProduct=()=>{
    const navigate=useNavigate();
    const [product,setProduct]=useState({
        name:"",
        description:"",
        price:"",
        realPrice:"",
        discount:"",
        category:"",
        color:"",
        stock:""
    })
    const {name,description,price,realPrice,discount,category,color,stock}=product;

    const onChange = (e) => {
  setProduct({
    ...product,
    [e.target.name]: e.target.value,
  });
};
    const [createProduct,{isLoading,error,isSuccess}] =useNewProductsMutation();

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message || "Error creating product");
        }
        if(isSuccess){
            toast.success("Product Created");
            navigate("/admin/products");
        }
    },[error,isSuccess,navigate])

    const submitHandler=(e)=>{
        e.preventDefault();
           if(!name || !description || !price || !category || !stock ){
        return toast.error("All fields are required");
    }
    const formattedProduct = {
      ...product,
      color: color.trim()
        ? color.split(",").map((c) => c.trim()) // e.g. "red, blue" → ["red", "blue"]
        : undefined, // send nothing if empty
    };
    createProduct(formattedProduct);
    }
    return(
        <>
        <AdminLayout>
             <div class="update">
    <form onSubmit={submitHandler}>
    <h2>Create Product</h2>
 <p>
    <label class="mx-1 mt-4">Name</label>
    <input 
    type="text"
    id="p8"
    name="name"
    value={name}
    onChange={onChange}
    />
 </p>
 <p>
     <label class="mx-1">Description</label><br />
   <textarea 
   id="t1"
   name="description"
    value={description}
    onChange={onChange}
   />
 </p>
            <p id="o1">
            <label class="mx-1">Price</label><br />
            <input 
            type="number" 
            id="p8"
            name="price"
    value={price}
    onChange={onChange}
            />
            </p>
            <p id="o2">
            <label class="mx-1">Real Price (optional)</label><br />
            <input 
            type="number" 
            id="p8"
            name="realPrice"
    value={realPrice}
    onChange={onChange}
            />
            </p>
            <p id="o1">
            <label class="mx-1">Discount (optional)</label><br />
            <input 
            type="number" 
            id="p8"
            name="discount"
    value={discount}
    onChange={onChange}
            />
            </p>
            <p id="o2">
            <label class="mx-1">Stock</label><br />
            <input 
            type="number"
            id="p8"
            name="stock"
    value={stock}
    onChange={onChange}
            />
            </p>
                    <p>
            <label class="mx-1 mt-4">Category</label>
            <select
            className="form-select"
            id="category_field"
            name="category"
    value={category}
    onChange={onChange}
            >
            {PRODUCT_CATEGORIES?.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
        </select>
        </p>
        <p>
    <label class="mx-1 mt-4">Color (optional)</label>
    <input 
    type="text"
    id="p8"
    placeholder="e.g. red, blue, #F0F0F0"
    name="color"
    value={color}
    onChange={onChange}
    />
 </p>
                    <button id="date" disabled={isLoading}><b>{isLoading ? "Creating..." : "Create Product"}</b></button>
            </form>
        </div>
        </AdminLayout>
        </>
    )
}
export default CreateProduct;