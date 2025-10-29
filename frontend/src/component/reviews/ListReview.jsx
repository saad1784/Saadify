import React from 'react';
import ReactStars from 'react-rating-stars-component';
import { useLazyGetProductReviewsQuery } from '../redux/api/productApi';

const ListReview=({reviews})=>{

    return(
         <div className="reviews">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews?.map((review)=>{
        return(
<div key={review?._id} className="review-card my-3">
        <div className="row">
          <div className="col-2 col-md-1">
            <img
  src={review?.user?.avatar?.url || "/images/default_avatar.jpg"}
  alt={`${review?.user?.first || "User"} ${review?.user?.last || ""}`}
  width="50"
  height="50"
  className="rounded-circle"
/>
          </div>
          <div className="col-10 col-md-11">
            <ReactStars
                     count={5}
                     value={review?.rating}
                     edit={false}
                     size={14}
                     activeColor="#ffd700"
                     isHalf={true}
                     emptyIcon={<i className="far fa-star" style={{ marginRight: '4px' }} />}
                     halfIcon={<i className="fa fa-star-half-alt" style={{ marginRight: '4px' }} />}
                     filledIcon={<i className="fa fa-star" style={{ marginRight: '4px' }} />}
                   />
            <span className="review_user"><b>{review?.user?.first} {review?.user?.last}</b></span><br/>
            <span className="review_comment">{review?.comment}</span>
          </div>
        </div>
        <hr />
      </div>
        )
      })}
      
    </div>
    )
}
export default ListReview;