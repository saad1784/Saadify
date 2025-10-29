import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../admin/Dashboard';
import ProtectedRoute from '../authentication/ProtectedRoute';
import CreateProduct from '../admin/CreateProduct.jsx';
import Products from '../admin/Products.jsx';
import Orders from '../admin/Orders.jsx';
import Users from '../admin/Users.jsx';
import Reviews from '../admin/Reviews.jsx';
import UpdateProduct from '../admin/UpdateProduct.jsx';
import UploadImage from '../admin/UploadImage.jsx';
import UpdateUser from '../admin/UpdateUser.jsx';
import UpdateOrder from '../admin/UpdateOrder.jsx';

const AdminRoute=()=>{
    return(
        <>
        <Route path="/admin/dashboard"  element={<ProtectedRoute admin={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/create/product"  element={<ProtectedRoute admin={true}><CreateProduct /></ProtectedRoute>} />
        <Route path="/admin/products"  element={<ProtectedRoute admin={true}><Products /></ProtectedRoute>} />
        <Route path="/admin/products/:id"  element={<ProtectedRoute admin={true}><UpdateProduct /></ProtectedRoute>} />
        <Route path="/admin/products/:id/upload_images"  element={<ProtectedRoute admin={true}><UploadImage /></ProtectedRoute>} />
        <Route path="/admin/orders"  element={<ProtectedRoute admin={true}><Orders /></ProtectedRoute>} />
        <Route path="/admin/orders/:id"  element={<ProtectedRoute admin={true}><UpdateOrder /></ProtectedRoute>} />
        <Route path="/admin/users"  element={<ProtectedRoute admin={true}><Users /></ProtectedRoute>} />
        <Route path="/admin/users/:id"  element={<ProtectedRoute admin={true}><UpdateUser /></ProtectedRoute>} />
        <Route path="/admin/reviews"  element={<ProtectedRoute admin={true}><Reviews /></ProtectedRoute>} />
        </>
    )
}
export default AdminRoute;