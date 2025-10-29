import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useNavigate} from "react-router-dom";
import { useCreateNewOrderMutation } from '../redux/api/orderApi.js';
import toast from "react-hot-toast";
import {clearCart, saveShippingInfo} from "../redux/features/cartSlice.js";
import {calculateOrderCost} from "../helping/helping.js";

const Checkout=()=>{
  const navigate=useNavigate();
  const [address,setAddress]=useState('');
  const [city,setCity]=useState('');
  const [phoneNo,setPhoneNo]=useState('');
  const [instruction,setInstruction]=useState('');
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const dispatch=useDispatch();
  const {cartItems ,shippingInfo}=useSelector((state)=>state.cart);
  const { itemsPrice,shippingPrice,totalPrice } = calculateOrderCost(cartItems);
 const [createNewOrder, { data, error, isSuccess, isLoading }] = useCreateNewOrderMutation();

useEffect(() => {
  if (shippingInfo) {
    setAddress(shippingInfo?.address || "");
    setCity(shippingInfo?.city || "");
    setPhoneNo(shippingInfo?.phoneNo || "");
  }
}, [shippingInfo]);

useEffect(() => {
  if (error) {
    toast.error(error?.data?.message || "Some Error Occurred");
  }

  if (isSuccess && data?.order && data?.token) {
    toast.success("Order Placed Successfully!");
    dispatch(clearCart());

    navigate(`/thankyou/${data.order._id}?t=${data.token}`);
  }
}, [error, isSuccess, data, navigate, dispatch]);


    const handleSubmit=(e)=>{
      e.preventDefault();
      if (!address || !city || !phoneNo) {
      return toast.error("Please fill all shipping fields.");
    }
    if (!cartItems || cartItems.length === 0) {
      return toast.error("Your cart is empty! Please add items before placing an order.");
    }
    dispatch(saveShippingInfo({ address, city,phoneNo}));

     const orderData = {
      shippingInfo: { address, city, phoneNo,instructions: instruction },
      orderItems: cartItems,
      itemPrice: Number(itemsPrice),
      deliveryCharges: shippingPrice,
      totalAmount: Number(totalPrice),
      paymentMethod,
      paymentInfo: {  status: paymentMethod === "BANK" ? "Paid" : "Not Paid" },
    };
    createNewOrder(orderData);
    console.log("cartItems before order:", cartItems);
    }
    return(
        <>
          <form onSubmit={handleSubmit}>
        <div class="row" id="y0">
            <div class="col-12 col-md-6" id="y1">
        <h1>Delivery</h1>
        <label class="mx-1 mt-1"><b>Address</b></label>
    <input 
    type="text" 
    name="address" 
    id="p8"
    value={address}
    onChange={(e)=>setAddress(e.target.value)}
    />
    <label class="mx-1 mt-1"><b>City</b></label>
    <input 
    type="text" 
    name="city"
    id="p8"
    value={city}
    onChange={(e)=>setCity(e.target.value)}
    />
    <label class="mx-1 mt-1"><b>Phone No</b></label>
    <input 
    type="tel" 
    name="phone"
    id="p8"
    value={phoneNo}
    onChange={(e)=>setPhoneNo(e.target.value)}
    />
    <p>
     <label class="mx-1 mt-1"><b>Instruction (optional)</b></label><br />
   <textarea 
   id="t1"
   name="description"
   value={instruction}
    onChange={(e)=>setInstruction(e.target.value)}
   />
 </p>
 <h1>Payment</h1>
 <div id="infoGroup">

  <div class="form-check" id="ee">
    <input 
    class="form-check-input" 
    type="radio" 
    name="optionGroup" 
    id="option1"
    defaultChecked 
    value="COD"
    onChange={()=>setPaymentMethod("COD")}
           data-bs-toggle="collapse" data-bs-target="#info1"aria-controls="info1" />
    <label class="form-check-label" for="option1">Cash On Delivery</label>
  </div>

  <div class="form-check" id="ee">
    <input 
    class="form-check-input" 
    type="radio" 
    name="optionGroup"
     id="option2"
     value="Bank"
     onChange={()=>setPaymentMethod("BANK")}
           data-bs-toggle="collapse" data-bs-target="#info2"aria-controls="info2" />
    <label class="form-check-label" for="option2">Bank Transfer</label>
  </div>
  {paymentMethod === "BANK" && (
<div class="alert alert-success">
        <p>If you want to pay in Online via wire transfer, details are as under: -</p>
        <span>Bank: </span><br/>
        <span>Account Title: </span><br/>
        <span>Account Number: </span><br/>
        <span>IBAN: </span><br/><br/>
        <span>Send Transfer Receipt at: 03 (Whatsapp)</span><br/>
        <span>Thank you!</span>
</div>
  )}
    

  <button id="y3" disabled={isLoading}>{isLoading ? "Processing..." : "Place Order"}</button>

</div>
            </div>
            <div class="col-12 col-md-6" id="y2">
              <h1>Order Summary</h1>
                {cartItems?.map((item)=>(
<div class="mt-4" id="check11">
<img src={item?.image || "/images/default.product.png"} id="i56"/> 
<Link to={`/product/${item?.product}`}><span id="s87">{item?.name}</span></Link>
<span id="s88">Rs {item?.quantity * item?.price.toFixed(2)}</span>
</div>    
                ))}<hr />
<div id="check12">
  <span>Subtotal</span><span id="s88">Rs {itemsPrice}</span><br/>
  <span>Shipping</span><span id="s88">Rs {shippingPrice}</span><hr/>
  <span><b>Total</b></span><span id="s88"><b>Rs {totalPrice}</b></span><hr/>
  <button id="y4" disabled={isLoading}>{isLoading ? "Processing..." : "Place Order"}</button>
</div>


            </div>
        </div>
            </form>
        </>
    )
}
export default Checkout;


   