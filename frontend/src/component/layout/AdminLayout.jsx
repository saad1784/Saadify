import React from 'react';
import SlideMenu from "./SlideMenu.jsx";

const AdminLayout=({children})=>{
    const menuItems = [
        {
            name:"Dashboard",
            url:"/admin/dashboard",
            icon:"bi bi-speedometer2"
        },
        {
            name:"New Product",
            url:"/admin/create/product",
            icon:"fa fa-plus"
        },
        {
            name:"Products",
            url:"/admin/products",
            icon:"bi bi-box-seam-fill"
        },
        {
            name:"Order",
            url:"/admin/orders",
            icon:"fa fa-receipt"
        },
        {
            name:"Users",
            url:"/admin/users",
            icon:"fa fa-user"
        },
        {
            name:"Reviews",
            url:"/admin/reviews",
            icon:"fa fa-star"
        }
    ]
    return(
        <>
        <div className="mt-2 mb-2 py-4">
    <h2 className="text-center fw-bolder">Admin Settings</h2>
</div>
    <div className="row  justify-content-center">
        <div className="col-12 col-lg-3">
         <SlideMenu menuItems={menuItems}/>
            </div> 
<div className="col-12 col-lg-8 user-dashboard">
    {children}
</div>
</div>
        </>
    )
}
export default AdminLayout;