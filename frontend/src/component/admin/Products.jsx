import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { useDeleteProductMutation, useGetAdminProductsQuery } from '../redux/api/productApi';
import toast from "react-hot-toast";
import Loader from "../layout/Loader.jsx";
import { Link } from 'react-router-dom';

const Products = () => {
  const { data, isLoading, error } = useGetAdminProductsQuery();
  const products = data?.products || [];

  const [deleteProduct, { isLoading: isDeleteLoading, error: isDeleteError, isSuccess }] =
    useDeleteProductMutation();

  // 🔍 Add local states for search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isDeleteError) {
      toast.error(isDeleteError?.data?.message);
    }
    if (isSuccess) {
      toast.success("Product Deleted");
    }
  }, [error, isDeleteError, isSuccess]);

  useEffect(() => {
    // when data changes, show all products again
    setFilteredProducts(products);
  }, [data]);

  const deleteProductHandler = async (id) => {
    deleteProduct(id);
  };

  // 🔍 Search button click handler
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const result = products.filter((p) =>
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(result);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <AdminLayout>
        <h1 class="text-center">{products?.length} Products</h1>

        <div className="input-group" id="aqua5">
          <input
            type="text"
            className="form-control"
            id="aqua3"
            placeholder="Search by Product ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="input-group-text"
            id="aqua4"
            onClick={handleSearch}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>

        <>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div id="productItem" key={product._id}>
                <div class="row">
                  <div class="col-12 col-lg-5 col-md-4 col-sm-5">
                    <p>Id #{product?._id}</p>
                    <p id="name">
                      <Link to={`/product/${product?._id}`}>{product?.name}</Link>
                    </p>
                    <span>
                      (Remaining Stock <b>{product?.stock}</b>)
                    </span>
                  </div>
                  <div class="col-6 col-lg-4 col-md-4 col-sm-4">
                    <img
                      src={product?.images?.[0]?.url || "/images/default_product.png"}
                      alt={product?.name || "Product"}
                      id="ki1"
                    />
                  </div>
                  <div class="col-6 col-lg-3 col-md-4 col-sm-3">
                    <Link to={`/admin/products/${product?._id}`}>
                      <p id="q1">
                        <i class="bi bi-pencil-fill"></i>
                      </p>
                    </Link>
                    <Link to={`/admin/products/${product?._id}/upload_images`}>
                      <p id="q2">
                        <i class="bi bi-image-fill"></i>
                      </p>
                    </Link>
                    <Link>
                      <button
                        id="q3"
                        onClick={() => deleteProductHandler(product?._id)}
                        disabled={isDeleteLoading}
                      >
                        <i class="bi bi-trash-fill"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-3 text-muted">No products found.</p>
          )}
        </>
      </AdminLayout>
    </>
  );
};

export default Products;
