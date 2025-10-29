import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { useGetMeQuery } from '../redux/api/userApi';
import { useLogoutMutation } from '../redux/api/authApi';
import Loader from './Loader';
import { logoutUser } from '../redux/features/userSlice';
import toast from 'react-hot-toast';
import Search from './Search';

const Header=()=>{
  const {user}=useSelector((state)=>state.user);
  const {cartItems} =useSelector((state)=>state.cart);
  const {isLoading}=useGetMeQuery();
  const [logout,{isSuccess}]=useLogoutMutation();
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishList);
  const logoutHandler=async () =>{
     try {
    await logout().unwrap();     
    dispatch(logoutUser());      
      navigate("/");
  } catch (err) {
    console.error("Logout failed:", err);
  }
  }
  useEffect(()=>{
    if(isSuccess){
      toast.success("Logout SuccessFully");
    }
  },[isSuccess]);
  const closeNavbar = () => {
  const navbar = document.getElementById('navContent');
  if (navbar && navbar.classList.contains('show')) {
    const bsCollapse = window.bootstrap.Collapse.getInstance(navbar);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  }
};
  if (isLoading) return <Loader />
    return(
        <>
         <div class="nav navbar navbar-expand-lg">
      <Link class="navbar-brand" to="/">
        <img src="/images/logo.png" id="logo" alt="Logo" />
      </Link>

      
        <Search />

      <button class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navContent"
              aria-controls="navContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse custom-collapse" id="navContent">
        <button type="button"
                class="btn-close d-lg-none"
                data-bs-toggle="collapse"
                data-bs-target="#navContent"
                aria-label="Close"></button>

        <ul class="navbar-nav d-none d-lg-flex" id="ul">
          <li class="nav-item" id="li">
            <Link class="nav-link" id="clr" to="/wishlist">
            <i class="bi bi-heart fs-4" ></i>
            <span className="position-absolute top-8 start-80 translate-middle badge rounded-circle bg-danger"
  style={{ fontSize: "0.7rem", minWidth: "18px" }}
>
  {wishlistItems?.length}
</span></Link>
          </li>
          <li className="nav-item position-relative" id="li">
  <Link className="nav-link" id="clr" to="/cart">
    <i className="bi bi-cart fs-4"></i>
      <span 
        className="position-absolute top-8 start-80 translate-middle badge rounded-circle bg-danger"
        style={{ fontSize: "0.7rem", minWidth: "18px", top:"10px" }}
      >{cartItems.length}
      </span>
  </Link>
</li>

          <li class="nav-item" id="li">
            {user ? (<Link class="nav-link" id="clr" href="#"><div class="dropdown">
  <button id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" class="d-flex align-items-center">
<img src={user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"} id="general"/><i class="bi bi-caret-down-fill fs-6" id="loat"></i>
  </button>
  {user?.role === "user" && (
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><Link class="dropdown-item" to="/me/profile"> <i class="bi bi-person"></i> Profile</Link></li>
    <li><Link class="dropdown-item" to="/me/orders"><i class="bi bi-receipt"></i> Order</Link></li>
    <li><Link class="dropdown-item" onClick={logoutHandler}><i class="bi bi-box-arrow-left"></i> Logout</Link></li>
  </ul>
)}
{user?.role === "admin" && (
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><Link class="dropdown-item" to="/admin/dashboard" onClick={closeNavbar}> <i class="bi bi-speedometer2"></i> Dashboard</Link></li>
    <li><Link class="dropdown-item" to="/me/profile" onClick={closeNavbar}> <i class="bi bi-person"></i> Profile</Link></li>
    <li><Link class="dropdown-item" to="/me/orders" onClick={closeNavbar}><i class="bi bi-receipt"></i> Order</Link></li>
    <li><Link class="dropdown-item" onClick={logoutHandler}><i class="bi bi-box-arrow-left"></i> Logout</Link></li>
  </ul>
)}
    
</div></Link>) 
: (!isLoading && (<span class="nav-link" id="clrr"><Link to="/register">Sign Up</Link> / <Link to="/login">Sign In</Link></span>

)) }

         
          </li>

        </ul>

        <ul class="navbar-nav d-lg-none" id="ul">
          <li class="nav-item" id="li">
            {user?.role === "admin" &&
             (<Link class="nav-link" id="colour" to="/admin/dashboard" onClick={closeNavbar}><i class="bi bi bi-speedometer2 fs-4" id="space"></i> Dashboard</Link>) }
          </li>
          <li class="nav-item" id="li">
            {user ?
             (<Link class="nav-link" id="colour" to="/me/profile" onClick={closeNavbar}><img src={user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"} id="generall"/>{user?.first}</Link>) 
             : (<Link class="nav-link" id="colour" to="/register" onClick={closeNavbar}><i class="bi bi-person-plus fs-4" id="space"></i> Sign Up</Link>)}
          </li>
          <li class="nav-item  position-relative" id="li">
            {user 
            ? (<Link className="nav-link" id="colour" to="/cart" onClick={closeNavbar}><i class="bi bi-cart fs-4" id="space"></i>
            <span 
  className="position-absolute  translate-middle badge rounded-circle bg-danger"
  style={{ fontSize: "0.7rem", minWidth: "18px" }}
>
  {cartItems.length}
</span> Cart</Link>) 
            : (<Link class="nav-link" id="colour" to="/login" onClick={closeNavbar}><i class="bi bi-door-open" id="space"></i> Sign In</Link>)}
          </li>
           <li class="nav-item" id="li">
            {user 
            ? (<Link class="nav-link" id="colour" to="/me/orders" onClick={closeNavbar}><i class="bi bi-receipt fs-4" id="space"></i> Order</Link>) 
            : (<Link className="nav-link" id="colour" to="/cart" onClick={closeNavbar}><i class="bi bi-cart fs-4" id="space"></i>
            <span 
  className="position-absolute  translate-middle badge rounded-circle bg-danger"
  style={{ fontSize: "0.7rem", minWidth: "18px" }}
>
  {cartItems.length}
</span> Cart</Link>)}
          </li>
          <li class="nav-item" id="li">
            <Link class="nav-link" id="colour" to="/wishlist" onClick={closeNavbar}><i class="bi bi-heart fs-4" id="space"></i><span 
  className="position-absolute  translate-middle badge rounded-circle bg-danger"
  style={{ fontSize: "0.7rem", minWidth: "18px" }}
>
  {wishlistItems?.length}
</span> Wishlist</Link>
          </li>
           <li class="nav-item" id="li">
            <Link class="nav-link" id="colour" to="" onClick={logoutHandler}><i class="bi bi-box-arrow-left fs-4"  id="space"></i> Logout</Link>
          </li>
        </ul>
      </div>
    </div>
        </>
    )
}
export default Header;