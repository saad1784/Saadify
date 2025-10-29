import React, { useEffect } from 'react';
import { useMyOrdersQuery } from '../redux/api/orderApi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';

const MyOrders=()=>{
    const {data,isLoading,error}=useMyOrdersQuery();
    const dispatch=useDispatch();
    const navigate=useNavigate();

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message || "Failed to fetch orders.");
        }
    },[error,navigate,dispatch]);
    const orders=data?.orders;
    if (isLoading) return <Loader />;
    return(
        <>
        <div id="myOrder">
            <h2 class="mx-2">{orders.length} Orders</h2>
      <table class="table table-striped table-bordered table-hover shadow-sm align-middle my-2">
         <thead class="table-primary">
             <tr id="kkk">
                 <th>ID</th>
                  <th>Amount (Rs)</th>
                   <th>Status</th> <th>Order Status</th>
                    <th class="text-center">Actions</th> 
                    </tr> 
                    </thead> 
                    <tbody> 
                        {[...orders].reverse().map((order)=>(
                            <>
                            <tr key={order._id} id="kkk"> 
                            <td>{order._id}</td> 
                            <td>Rs {order.totalAmount}</td> 
                                <td><span>{order.paymentInfo?.status }</span></td>
                                 <td class={String(order.orderStatus).includes("Delivered") ? "greenColor" : "redColor"}><span>{order.orderStatus}</span></td> 
                                 <td class="text-center"> 
                                    <div class="btn-group btn-group-sm">
                                        <Link to={`/order/${order._id}`}><button class="mx-2" id="d1"><i class="bi bi-search"></i></button></Link> 
                                     <Link to={`/invoice/order/${order._id}`}><button class="mx-2" id="d2"><i class="fa fa-print"></i></button> </Link>
                                     </div> 
                                     </td> 
                                     </tr> 
                                     </>
                        ))}
                                     </tbody> 
                                     </table>
  </div>
        </>
    )
}
export default MyOrders;