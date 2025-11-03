import React, { useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useOrderDetailsQuery } from "../redux/api/orderApi.js";
import Loader from "../layout/Loader.jsx";
import toast from "react-hot-toast";

const ThankYou = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");

  const { data, error, isLoading } = useOrderDetailsQuery({ id, token });

  useEffect(() => {
    if (error) {
      toast.error("Invalid or expired link. Please check your order history.");
    }
  }, [error]);

 useEffect(() => {
  if (data?.order && window.fbq) {
    const order = data.order;
    const purchaseKey = `purchase_${order._id}`;
    if (!sessionStorage.getItem(purchaseKey)) {
      window.fbq("track", "Purchase", {
        content_ids: [order._id],
        content_type: "product",
        value: order.totalAmount || 0,
        currency: "PKR",
      });
      sessionStorage.setItem(purchaseKey, "true");
    }
  }
}, [data]);

  if (isLoading) return <Loader />;

  if (!data?.order) {
    return (
      <div className="text-center my-5">
        <h2>Order not found or link expired.</h2>
        <Link to="/">Go Back to Home</Link>
      </div>
    );
  }

  const order = data.order;

  return (
    <div className="container text-center mt-4" style={{ maxWidth: "600px" }}>
      <div className="card shadow p-4 rounded-3">
        <img
          src="/images/order_success.png"
          alt="Success"
          style={{ width: "60px", margin: "0 auto" }}
        />
        <h2 className="mt-3">Thank You for Your Purchase!</h2>
        <p>Your order has been placed successfully.</p>

        <hr />

        <div className="text-start">
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Total Amount:</b> Rs {order.totalAmount}</p>
          <p><b>Payment Method:</b> {order.paymentMethod}</p>
          <p><b>Status:</b> {order.orderStatus}</p>
          <p><b>City:</b> {order.shippingInfo.city}</p>
        </div>

        <hr />

        <Link to="/me/orders" className="btn btn-primary w-100 mt-2">
          Review Order
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;