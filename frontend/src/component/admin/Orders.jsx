import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Link } from 'react-router-dom';
import { useAdminGetOrdersQuery, useDeleteOrderMutation } from '../redux/api/orderApi.js';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader.jsx';

const Orders = () => {
  const { data, isLoading, error } = useAdminGetOrdersQuery();
  const [deleteOrder, { error: deleteError, isSuccess, isLoading: deleteIsLoading }] =
    useDeleteOrderMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(deleteError?.data?.message);
    if (isSuccess) toast.success('Order Deleted');
  }, [error, deleteError, isSuccess]);

  const deleteOrderHandler = (id) => {
    deleteOrder(id);
  };

  const orders = data?.orders || [];

  // 🔍 Search button click handler
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders); // show all if empty
    } else {
      const result = orders.filter((order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(result);
    }
  };

  // Show all orders initially when data changes
  useEffect(() => {
    setFilteredOrders(orders);
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <p className="mx-4" id="aqua1">
            <h1>{orders.length} Orders</h1>
          </p>

          {/* Search Bar */}
          <p className="mx-2" id="aqua2">
            <div className="input-group" id="aqua5">
              <input
                type="text"
                className="form-control"
                id="aqua3"
                placeholder="Search by Order ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="input-group-text"
                id="aqua4"
                onClick={handleSearch}
                disabled={isLoading}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </p>

          {/* Orders Table */}
          <div className="tableIn">
            <div className="row" id="in7">
              <div className="col" id="in8">Id</div>
              <div className="col" id="in6">Payment Status</div>
              <div className="col" id="in6">Order Status</div>
              <div className="col" id="in6">Actions</div>
            </div>

            {filteredOrders.length > 0 ? (
              [...filteredOrders].reverse().map((order)=>(
                <div className="row" key={order._id}>
                  <div className="col" id="in12">{order._id}</div>
                  <div className="col" id="in6">{order?.paymentInfo?.status}</div>
                  <div
                    className={`col ${
                      String(order?.orderStatus).includes('Delivered')
                        ? 'greenColor'
                        : 'redColor'
                    }`}
                    id="in14"
                  >
                    {order?.orderStatus}
                  </div>
                  <div className="col" id="in6">
                    <Link to={`/admin/orders/${order?._id}`}>
                      <p id="q11">
                        <i className="bi bi-pencil-fill"></i>
                      </p>
                    </Link>
                    <button
                      id="q13"
                      onClick={() => deleteOrderHandler(order._id)}
                      disabled={deleteIsLoading}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center mt-3 text-muted">No orders found.</p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Orders;
