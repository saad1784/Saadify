import React, { useState, useEffect } from 'react';
import { useGetProductsQuery } from '../redux/api/productApi';
import Loader from './Loader.jsx';
import ProductItem from '../products/ProductItem.jsx';
import { useSearchParams } from 'react-router-dom';
import Filter from './Filter.jsx';

const Home = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const cleanCategory = category && category !== "null" ? category : undefined;
  const queryParams = {
    keyword,
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
    category: cleanCategory,
  };

  const { data, isLoading } = useGetProductsQuery(queryParams);
  const products = data?.products;

  const [showModal, setShowModal] = useState(false);

  // Show modal only once per browser
  useEffect(() => {
    const modalShown = localStorage.getItem("homeModalShown");
    if (!modalShown) {
      setShowModal(true);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("homeModalShown", "true");
  };

  if (isLoading) return <Loader />;

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div 
            style={{
              position: "relative",
              backgroundColor: "black",
              color: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "500px",
              textAlign: "center"
            }}
          >
            <button 
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}
            >
              &times;
            </button>
            <h2>Welcome to Our Store!</h2><br />
            <p>This store is not for Shopping yet.</p>
          </div>
        </div>
      )}

      <div className="row">
        {keyword && (
          <div className="col-11 col-sm-7 col-md-4 mt-5">
            <Filter />
          </div>
        )}
        {products.length === 0 && (
          <h1 className=" col-12 col-sm-5 col-md-8 text-center text-muted my-5">
            No products found
          </h1>
        )}
        <div className={keyword ? "col-12 col-sm-5 col-md-8" : "col-12 col-sm-6 col-md-12"}>
          <div className="center-div">
            {products.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
