import React, { useEffect, useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import { useCanUserReviewQuery, useSubmitReviewsMutation } from '../redux/api/productApi';
import toast from 'react-hot-toast';

const NewReviews=({productId})=>{
    const [rating,setRating]=useState(0);
    const [comment,setComment]=useState('');
    const [submitReviews,{error,isSuccess}]=useSubmitReviewsMutation();
    const {data}= useCanUserReviewQuery(productId);
    const canReview=data?.canReview;
    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message || "Error Ocurred");
        }
        if(isSuccess){
            toast.success("Review Posted");
        }
    },[error,isSuccess])
    const submitHandler=()=>{
        const reviewData={rating,comment,productId};
        submitReviews(reviewData);
    }
    return(
         <div>
          {canReview && (
<button
        id="review_btn"
        type="button"
        className="btn btn-primary mt-4"
        data-bs-toggle="modal"
        data-bs-target="#ratingModal"
      >
        Submit Your Review
      </button>
          )}
      

      <div className="row  mb-1">
        <div className="rating w-50">
          <div
            className="modal fade"
            id="ratingModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="ratingModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="ratingModalLabel">
                    Submit Review
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                 <ReactStars
                           count={5}
                           rating={rating}
                           edit={true}
                           onChange={(e) => setRating(e)}
                           size={24}
                           changeRating={(e)=>setRating(e)}
                           activeColor="#ffd700"
                           isHalf={true}
                           emptyIcon={<i className="far fa-star" style={{ marginRight: '4px' }} />}
                           halfIcon={<i className="fa fa-star-half-alt" style={{ marginRight: '4px' }} />}
                           filledIcon={<i className="fa fa-star" style={{ marginRight: '4px' }} />}
                         />

                  <textarea
                    name="review"
                    id="review"
                    className="form-control mt-4"
                    placeholder="Enter your comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                  ></textarea>

                  <button
                    id="new_review_btn"
                    className="btn w-100 my-4 px-4"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={submitHandler}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
}
export default NewReviews;