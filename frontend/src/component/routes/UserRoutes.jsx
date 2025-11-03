import React from 'react';
import {Route} from 'react-router-dom';
import Home from '../layout/Home.jsx';
import Register from '../authentication/Register.jsx';
import Login from '../authentication/Login.jsx';
import ProductDetail from '../products/ProductDetail.jsx';
import Cart from '../cart/Cart.jsx';
import Profile from '../user/Profile.jsx';
import UpdateProfile from '../user/UpdateProfile.jsx';
import UpdatePassword from '../user/UpdatePassword.jsx';
import WishList from '../layout/WishList.jsx';
import ProtectedRoute from '../authentication/ProtectedRoute.jsx';
import MyOrders from '../user/MyOrders.jsx';
import OrderDetails from '../user/OrderDetails.jsx';
import Invoice from '../invoice/Invoice.jsx';
import ThankYou from '../cart/ThankYou.jsx';
import Checkout from '../cart/Checkout.jsx';

const UserRoutes=()=>{
    return(
        <>
        <Route path="/" element={<Home />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/cart" element={<Cart />}/>
        <Route path="/wishlist" element={<WishList />}/>
        <Route path="/product/:id" element={<ProductDetail />}/>
        <Route path="/me/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/me/update_profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}/>
        <Route path="/me/Password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}/>
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}/>
        <Route path="/me/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>}/>
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}/>
        <Route path="/invoice/order/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>}/>
        <Route path="/thankyou/:id" element={<ThankYou />} />
        </>
    )
}
export default UserRoutes;