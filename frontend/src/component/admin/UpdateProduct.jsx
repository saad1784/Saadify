import React, { useEffect, useState } from 'react';
import AdminLayout from "../layout/AdminLayout.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import {useGetOneProductQuery, useUpdateProductsMutation} from "../redux/api/productApi.js";
import toast from "react-hot-toast";
import {PRODUCT_CATEGORIES} from "../constant/constant.js";

const UpdateProduct=()=>{
    const navigate=useNavigate();
    const params=useParams();
    const [product,setProduct]=useState({
        name:"",
        description:"",
        price:"",
        realPrice:"",
        discount:"",
        stock:"",
        category:"",
        color:"",
    })
    const {name,description,price,realPrice,discount,stock,category,color}=product;

    const onChange =(e)=>{
        setProduct({...product,[e.target.name]:e.target.value})
    };
    const [updateProducts,{isLoading,error,isSuccess}] =useUpdateProductsMutation();
    const {data}=useGetOneProductQuery(params?.id)

    useEffect(()=>{
        if(data?.product){
            setProduct({
                name:data?.product?.name,
                description:data?.product?.description,
                price:data?.product?.price,
                realPrice:data?.product?.realPrice,
                category:data?.product?.category,
                discount:data?.product?.discount,
                stock:data?.product?.stock,
                color:data?.product?.color,
            })
        }
        if(error){
            toast.error(error?.data?.message || "Error Updating Product");
        }
        if(isSuccess){
            toast.success("Product Updated");
            navigate("/admin/products");
        }
    },[error,isSuccess,data,navigate]);

    const submitHandler = (e) => {
  e.preventDefault();

  if (!name || !description || !price || !category || !stock) {
    return toast.error("All required fields must be filled");
  }

  const formattedProduct = {
  ...product,
  price: Number(price),
  stock: Number(stock),
  realPrice: String(realPrice).trim() ? Number(realPrice) : undefined,
  discount: String(discount).trim() ? Number(discount) : undefined,
  color: String(color).trim()
    ? String(color)
        .split(",")
        .map((c) => c.trim())
    : [],
};

  updateProducts({ id: params.id, body: formattedProduct });
};

    return(
        <>
        <AdminLayout>
            <div class="update">
    <form onSubmit={submitHandler}>
    <h2>Update Product</h2>
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
                    <button id="date" disabled={isLoading}><b>{isLoading ? "Updating..." : "Update Product"}</b></button>
            </form>
        </div>
        </AdminLayout>
        </>
    )
}
export default UpdateProduct;