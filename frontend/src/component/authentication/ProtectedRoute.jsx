import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../layout/Loader.jsx";

const ProtectedRoute = ({ admin, children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if(loading) return <Loader />
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (admin && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;