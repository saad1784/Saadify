import React from 'react';
import SlideMenu from './SlideMenu';

const UserLayout=({children})=>{
    const menuItems = [
        {
            name:"Profile",
            url:"/me/profile",
            icon:"fa fa-user"
        },
        {
            name:"Update Profile",
            url:"/me/update_profile",
            icon:"fa fa-user-circle"
        },
        {
            name:"Update Password",
            url:"/me/password",
            icon:"fa fa-lock"
        }
    ]
    return(
        <>
        <div className="mt-2 mb-4 py-4">
    <h2 className="text-center fw-bolder">User Settings</h2>
</div>
<div className="container">
    <div className="row justify-content-center">
        <div className="col-12 col-lg-3">
         <SlideMenu menuItems={menuItems}/>
            </div> 
<div className="col-12 col-lg-8 user-dashboard">
    {children}
</div>
</div>
</div>
        </>
    )
}
export default UserLayout;