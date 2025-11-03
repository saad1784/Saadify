import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {removeCartItem, setUserCart} from '../redux/features/cartSlice.js';

const Cart=()=>{
    const {cartItems}=useSelector((state)=>state.cart);
    const dispatch=useDispatch();
    const navigate=useNavigate();

        const increaseQty = (item,quantity) => {
    const newQty=quantity+1;
    if (newQty > item?.stock) return;
    setItemToCart(item,newQty);
  };
    const decreaseQty = (item,quantity) => {
    const newQty=quantity-1;
    if (newQty <= 0) return;
    setItemToCart(item,newQty);
  };
const handleCheckoutClick = () => {
  navigate('/checkout');
};
  const setItemToCart=(item,newQty)=>{
    const cartItem={
      product:item?.product,
      name:item?.name,
      price:item?.price,
      image:item?.image,
      stock:item?.stock,
      color: item?.color || null,
      quantity:newQty
    };
    dispatch(setUserCart(cartItem));
  };
  const removeCartItemHandler =(id) => {
    dispatch(removeCartItem(id));
  }
    return(
        <>
        <div id="cartItems">
        <div class="row" id="c0">
            
                {cartItems.length === 0 ? (
                    <span id="v1">Your Cart is Empty</span>
                ) : (
                    <>
                    <div class="col-12 col-md-8" id="c1">
                      
                <span id="v1">Your Cart: <b>{cartItems.length} item,</b></span><br />
                {cartItems?.map((item)=>(
                    <>
                    <hr />
                    <div class="row" id="v2">
                      <div class="col-12 col-sm-6">
                        <div class="row" id="v2">
                        <div class="col-6">
                        <p id="l1"><img 
                src={item?.image || "/images/default_product.png"}
                alt={item?.name}
                id="i4" 
                /></p>
                        </div>
                         <div class="col-6">
                <Link to={`/product/${item?.product}`}>
                <span id="name">{item?.name}
                  
                 </span></Link>


                 {item?.color && (
                    <>
                    <br/>
                   <p style={{float:"left"}}>Color:</p>
                    <p style={{width:"16px",marginTop:"3px",height:"16px",marginLeft:"1vw",backgroundColor:item?.color,float:"left"}}></p>
                   </>
                  )}
                        </div>
                        </div>
                        </div>
                        <div class="col-12 col-sm-6">
                          <div class="row">
                         <div class="col-5">
                          <p id="l3"><b>{item?.price}</b></p>
                        </div>
                         <div class="col-5">
                          <p><Link><span 
                id="minus" 
                onClick={()=>decreaseQty(item,item.quantity)}>
                    <b>-</b></span></Link>
              <input 
              type="number" 
              id="inter"
              value={item?.quantity}
              readOnly
              />
              <Link><span 
              id="plus" 
              onClick={()=>increaseQty(item,item.quantity)}>
                <b>+</b></span></Link></p>
                        </div>
                         <div class="col-2">
                <Link><p id="l5"><i class="bi bi-trash-fill fs-4" onClick={()=>removeCartItemHandler(item?.product)}></i></p></Link>
                        </div>
                      </div>
                      </div>
                      </div>
              <hr />
               </>
                ))}
                
                </div>
            <div class="col-12 col-md-4" id="c2">
               <div id="v3">
                <h3>Order Summary</h3><hr />
                <p>Subtotal:<span class="s1">
                    <b>{cartItems?.reduce((acc,item)=> acc+ item?.quantity,0)}{""} (units)</b></span></p>
                <p>Est. total:<span class="s1"><b>Rs {cartItems?.reduce((acc,item)=> acc+ item?.quantity*item.price,0).toFixed(2)}</b></span></p><hr />
                <button id="out" onClick={handleCheckoutClick}><b>Checkout</b></button>
              </div>
            </div>
        
                 </>
                )}
                
               </div>
    </div>
            
        </>
    )
}
export default Cart;