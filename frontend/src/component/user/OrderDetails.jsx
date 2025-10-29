import React, { useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import {useOnlyOrderDetailQuery, useOrderDetailsQuery} from '../redux/api/orderApi.js';
import Loader from '../layout/Loader.jsx';
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';

const OrderDetails=()=>{
    const params = useParams();
    const {data,isLoading,error}=useOnlyOrderDetailQuery(params?.id);
    const order=data?.order || {};
    const {user} =useSelector((state)=>state.user);

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }
    },[error]);
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalAmount,
        orderStatus
    }=order;
    const isPaid=paymentInfo?.status === "Paid" ? true : false;

       if (isLoading) return <Loader />;
    return(
        <>
        <div id="orderDetail">
            <h2 class="my-4 mx-2">Your Order Details</h2>
            <div class="table">
                <div class="row">
                    <div class="col-5" id="jjj">
                    <b>ID</b>
                    </div>
                    <div  class="col-7" id="jjj">
                    {order?._id}
                    </div>
                    <div class="col-5" id="jjj">
                    <b>Status</b>
                    </div>
                    <div className={`col-7 ${String(orderStatus).includes("Delivered") ? "greenColor" : "redColor"}`}  id="jjj">
                    {orderStatus}
                    </div>
                    <div class="col-5" id="jjj">
                    <b>Date</b>
                    </div>
                    <div class="col-7" id="jjj">
                    {new Date(order?.createdAt).toLocaleString("en-US")}
                    </div>
                </div>
            </div>
            <h2 class="my-4 mx-2">Shipping Info</h2>
            <div class="table">
                <div class="row">
                    <div class="col-5" id="jjj">
                    <b>Name</b>
                    </div>
                    <div class="col-7" id="jjj">
                    {user?.first} {user?.last}
                    </div>
                    <div class="col-5" id="jjj">
                    <b>Phone No</b>
                    </div>
                    <div class="col-7" id="jjj">
                    {shippingInfo?.phoneNo}
                    </div>
                    <div class="col-5" id="jjj">
                    <b>Address</b>
                    </div>
                    <div class="col-7" id="jjj">
                    {shippingInfo?.address},{shippingInfo?.city}
                    </div>
                </div>
            </div>
            <h2 class="my-4 mx-2">Payment Info</h2>
            <div class="table">
                <div class="row">
                    <div class="col-5" id="jjj">
                    <b>Status</b>
                    </div>
                    <div className={`col-7 ${isPaid ? "greenColor" : "redColor"}`} id="jjj">
                    {paymentInfo?.status}
                    </div>
                    <div class="col-5" id="jjj">
                    <b>Method</b>
                    </div>
                    <div class="col-7" id="jjj">
                    {order?.paymentMethod}
                    </div>
                    <div class="col-5" id="jjj">
                    <b>Amount Paid</b>
                    </div>
                    <div class="col-7" id="jjj">
                    Rs {totalAmount}
                    </div>
                </div>
            </div>
            {shippingInfo?.instructions && (
                <>
                    <h2 class="my-4 mx-2">Instruction</h2>
            <div class="table">
                <div class="row">
                    <div class="col-5" id="jjj">
                    <b>Instruction</b>
                    </div>
                    <div className="col-7" id="jjj">
                    {shippingInfo?.instructions}
                    </div>
                    
                </div>
            </div>
            </>
            )}
            <h2 class="my-4 mx-2">Order Items:</h2>
            {orderItems.map((item)=>(
                <>
            <hr />
            <div class="row" id="item11">
                <div class="col col-md-3" id="l23">
                <img src={item?.image || "/images/default_product.png"} alt={item?.name} id="i9"/>
                </div>
                <div class="col col-md-3"  id="l23">
           <Link to={`/product/${item?.product}`}>
            <span id="ij">{item?.name}</span></Link>
                </div>
                 <div class="col col-md-3" id="o7">
                    <p>Rs {item?.price}</p>
                </div>
                 <div class="col col-md-3" id="o7">
                    <b>{item?.quantity} Pieces</b>
                </div>
            </div>
            <hr/>
            </>
            ))}
            

           
        </div>
        </>
    )
}
export default OrderDetails;