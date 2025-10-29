import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import {Link, useParams} from 'react-router-dom';
import {useOnlyOrderDetailQuery, useUpdateOrderMutation} from '../redux/api/orderApi.js';
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';

const UpdateOrder=()=>{
    const [status,setStatus]=useState();
      const params=useParams();
        const {data}=useOnlyOrderDetailQuery(params?.id);
        const [updateOrder,{error,isSuccess,isLoading}]=useUpdateOrderMutation();
        const order=data?.order || {};
        const {user} =useSelector((state)=>state.user);

        useEffect(()=>{
            if(error){
                toast.error(error?.data?.message);
            }
            if(isSuccess){
                toast.success("Order Updated");
            }
        },[error,isSuccess]);
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            totalAmount,
            orderStatus
        }=order;
        
        useEffect(()=>{
            if(orderStatus){
                setStatus(orderStatus)
            }
        },[orderStatus]);

        const isPaid=paymentInfo?.status === "Paid" ? true : false;
        const updateOrderHandle=(id)=>{
        const data={status};
        updateOrder({id,body:data});
       }
    return(
        <>
        <AdminLayout>
            <div id="orderDetail">
                <h2 class="my-4 mx-2">Status</h2>
                <select 
                className="form-select" 
                name="status" 
                value={status} 
                onChange={(e)=>setStatus(e.target.value)}
                >
                       <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
                        </select>
                        <button id="order11" onClick={()=>updateOrderHandle(order?._id)} disabled={isLoading}>{isLoading ? "Updating..." : "Update Status"}</button>
            <h2 class="my-4 mx-2">Order Invoice</h2>
                        <Link to={`/invoice/order/${order?._id}`}><button id="order12"><i className="fa fa-print"></i> Generate Invoice</button></Link>
            <h2 class="my-4 mx-2">Order Details</h2>
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
            {orderItems?.map((item)=>(
                <>
            <hr />
            <div class="row" id="item11">
                <div class="col col-md-3" id="l23">
                <img src={item?.image || "/images/default_product.png"} alt={item?.name} id="i9"/>
                </div>
                <div class="col col-md-3"  id="l23">
           <Link to={`/product/${item?.product}`}> <p id="ij">{item?.name} </p></Link>
           {item?.color && (
                    <>
                    <br/>
                   <p style={{float:"left"}}>Color:</p>
                    <p style={{width:"20px",marginTop:"3px",height:"16px",backgroundColor:item?.color,float:"left"}}></p>
                   </>
                  )}
            
                </div>
                 <div class="col col-md-3" id="o7">
                    <p>Rs {item?.price}</p>
                </div>
                 <div class="col col-md-3" id="o7">
                    {item?.quantity} Pieces
                </div>
            </div>
            <hr/>
            </>
            ))}
        </div>
        </AdminLayout>
        </>
    )
}
export default UpdateOrder;