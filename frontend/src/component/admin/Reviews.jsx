import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { useDeleteReviewMutation, useLazyGetProductReviewsQuery } from '../redux/api/productApi';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader.jsx';

const Reviews=()=>{
     const [productId,setProductId]=useState("");

     const [getProductReviews,{data,isLoading,error}] = useLazyGetProductReviewsQuery();
   const [deleteReview,{error:deleteError,isLoading:deleteIsLoading,isSuccess}] = useDeleteReviewMutation();
   
   useEffect(()=>{
    if(error){
    toast.error(error?.data?.message || "Error Occured");
    }
    if(deleteError){
        toast.error(deleteError?.data?.message || "Deleting Review Error Occured")
    }
     if(isSuccess){
        toast.success("Review Deleted")
    }
   },[isSuccess,deleteError,error]);
      const submitHandler=(e)=>{
        e.preventDefault();
    getProductReviews(productId)
    }

    const deleteReviewHandler=(id)=>{
        deleteReview({ productId, id });
    }

      if (isLoading) return <Loader />;
const reviews = data?.reviews || [];
   return(
        <>
        <AdminLayout>
            <div className="row justify-content-center my-5">
      <div className="col-6">
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="productId_field" className="form-label">
              Enter Product ID
            </label>
            <input
              type="text"
              id="productId_field"
              className="form-control"
              value={productId}
              onChange={(e)=>setProductId(e.target.value)}
            />
          </div>

          <button
            id="search_button"
            type="submit"
            className="btn btn-primary w-100 py-2"
          >
            SEARCH
          </button>
        </form>
      </div>
    </div>
    <div id="myOrder">
          <table class="table table-striped table-bordered table-hover shadow-sm align-middle my-2">
             <thead class="table-primary">
                 <tr id="kkk">
                     <th>Review ID</th>
                      <th>Rating</th>
                       <th>Comment</th> <th>User</th>
                        <th class="text-center">Actions</th> 
                        </tr> 
                        </thead> 
                        <tbody> 
                                <>
                                {reviews?.map((review)=>(
                                    <tr key={review._id} id="kkk"> 
                                <td>{review._id}</td> 
                                <td>{review?.rating}</td> 
                                    <td><span>{review?.comment}</span></td>
                                     <td><span>{review?.user?.first}</span></td> 
                                     <td class="text-center"> 
                                        <div class="btn-group btn-group-sm">
                                            <button class="mx-2" id="d11" onClick={()=>deleteReviewHandler(review?._id)} disabled={deleteIsLoading}><i class="bi bi-trash"></i></button>
                                         </div> 
                                         </td> 
                                         </tr> 
                                ))}
                                         </>
                                         </tbody> 
                                         </table>
      </div>
        </AdminLayout>
        </>
    )
}
export default Reviews;