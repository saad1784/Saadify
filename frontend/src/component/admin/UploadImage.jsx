import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {useDeleteProductImageMutation, useGetOneProductQuery, useUploadProductImagesMutation} from "../redux/api/productApi.js";
import toast from "react-hot-toast";

const UploadImage=()=>{
       const fileInputRef=useRef(null);
    const params=useParams();
    const navigate=useNavigate();

    const [images,setImages]=useState([]);
    const [imagesPreview,setImagesPreview]=useState([]);
    const [uploadImages,setUploadImages]=useState([]);

    const {data}=useGetOneProductQuery(params?.id);
    const [uploadProductImages,{isLoading,error,isSuccess}]=useUploadProductImagesMutation();
    const [deleteProductImage,{isLoading:isDeleteLoading,error:deleteError}]=useDeleteProductImageMutation();
    useEffect(() => {
  if (data?.product) {
    setUploadImages(data?.product?.images); // ✅ correct spelling
  }

  if (error) {
    toast.error(error?.data?.message || "Error Uploading Image");
  }

  if (deleteError) {
    toast.error(deleteError?.data?.message || "Error Deleting Image");
  }

  if (isSuccess) {
    setImagesPreview([]); // ✅ correct spelling
    toast.success("Product Updated");
    navigate("/admin/products");
  }
}, [data, isSuccess, error, navigate, deleteError]);

    const onChange =(e)=>{
        const files=Array.from(e.target.files);
        files.forEach((file)=>{
const reader = new FileReader();
    reader.onload=()=>{
        if(reader.readyState===2){
           setImagesPreview((oldArray)=>[...oldArray,reader.result])
           setImages((oldArray)=>[...oldArray,reader.result])
        }
    }
    reader.readAsDataURL(file);
        })
  };

  const handleImagesPreviewDelete=(image)=>{
    const filterImagesPreview=imagesPreview.filter(
        img => img !== image
    )
    setImages(filterImagesPreview);
    setImagesPreview(filterImagesPreview);
  }
  const handleInputResetFile = () => {
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  const submitHandler=(e)=>{
    e.preventDefault();
uploadProductImages({ id: params?.id , body: {images} });
  }
  const deleteImage = (imgId) => {
  deleteProductImage({ id: params?.id, body: { imgId } });
};
        return(
        <AdminLayout>
        <div class="update">
    <form onSubmit={submitHandler}>
    <h2>Upload Image</h2>

           <p id="o5"> <label class="mx-1" htmlFor="customFile">Choose Avatar</label><br />
            <input 
            ref={fileInputRef}
            type="file"
            name="avatar"
            id="customFile"
            multiple
                onChange={onChange}
                onClick={handleInputResetFile}
            />
            </p>
            {imagesPreview?.length > 0 && (
                <div class=" mt-4">
                <p id="c99">New Images:</p>
                <div class="row">
                    {imagesPreview?.map((img)=>(
                        <div class="col" id="mTop">
                        <img 
                        src={img}
                        id="z1"/>
                        <br /><button id="z2" onClick={()=>handleImagesPreviewDelete(img)}><i class="fa fa-times fs-5 mt-1" id="z3"></i></button>
                    </div>
                    ))}     
            </div>
            </div>
            )}
            {uploadImages?.length > 0 && (
                <div class=" mt-4">
                <p id="c99">Product Upload Images:</p>
                <div class="row">
                    {uploadImages?.map((img)=>(
                        <div class="col" id="mTop">
                        <img src={img?.url} id="z1"/><br /><Link>
  <button
    id="z2"
    disabled={isLoading || isDeleteLoading}
    type="button"
    onClick={() => deleteImage(img?.public_id)}
  >
    <i class="fa fa-trash fs-5 mt-1" id="z3"></i>
  </button>
</Link>
                    </div>
                    ))}
        </div>
    </div>
            )}
            
            <button id="date" disabled={isLoading || isDeleteLoading}><b>{isLoading ? "Uploading..." : "Upload"}</b></button>
            </form>
        </div>
        </AdminLayout>
    )
}
export default UploadImage;