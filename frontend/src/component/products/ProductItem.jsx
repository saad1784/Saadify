import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setUserCart } from "../redux/features/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/features/wishlistSlice";

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishList);
  const isInWishlist = wishlistItems.some((item) => item.product === product._id);

  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAddToCart = () => {
    if (product?.color?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity: 1,
      color: selectedColor || undefined,
    };

    dispatch(setUserCart(cartItem));
    toast.success("Item Added to Cart Successfully");
    setShowModal(false);
    setSelectedColor(null);
  };

  const setItemToCart = () => {
  if (product?.color?.length > 0) {
    setShowModal(true);
  } else {
    handleAddToCart();
    const productCartKey = `addToCart_${product._id}`;
    if (window.fbq && !sessionStorage.getItem(productCartKey)) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [product._id],
        content_type: 'product',
        value: product.price,
        currency: 'PKR',
      });
      sessionStorage.setItem(productCartKey, 'true');
    }
  }
};

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.error("Item Removed from Wishlist");
    } else {
      const wishListItem = {
        product: product?._id,
        name: product?.name,
        price: product?.price,
        image: product?.images[0]?.url,
        realPrice: product?.realPrice,
        discount: product?.discount,
      };
      dispatch(addToWishlist(wishListItem));
      toast.success("Item Added to Wishlist Successfully");
    }
  };

  return (
    <>
      <div id="product">
        <Link to={`/product/${product?._id}`}>
          <img
            src={product?.images?.[0]?.url || "/images/default_product.png"}
            alt={product?.name}
            id="smal"
          />
        </Link>
        <br />

        {product?.discount && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#ff3b30",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {product.discount}% OFF
          </span>
        )}

        <div className="wishlist-icon">
  <i
    className="bi bi-heart-fill fs-5"
    style={{
      fontSize: "20px",
      color: isInWishlist ? "#0041DC" : "white",
      textShadow: "0 0 4px rgba(0,0,0,0.6)",
      cursor: "pointer",
    }}
    onClick={toggleWishlist}
  ></i>
  <span className="tooltip-text">
    {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
  </span>
</div>

        <button
          id="atc"
          disabled={product?.stock <= 0}
          onClick={setItemToCart}
        >
          Add to Cart
        </button>

        <p id="p0">
          <b>
            <Link to={`/product/${product?._id}`}>{product?.name}</Link>
          </b>
        </p>

        <div id="container">
          <div id="left">
            <span>Rs {product?.price}</span>
          </div>
          <div id="right">
            {product?.realPrice && <span id="cutt">Rs {product.realPrice}</span>}
          </div>
        </div>
      </div>

      {/* Color selection modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "320px",
              textAlign: "center",
            }}
          >
            <h5>Select Color</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {product.color?.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: selectedColor === color ? "30px" : "30px",
                    height: selectedColor === color ? "30px" : "30px",
                    backgroundColor: color,
                    border: selectedColor === color ? "3px solid black" : "1px solid gray",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  backgroundColor: "#0041DC",
                  color: "white",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                disabled={!selectedColor}
                onClick={handleAddToCart}
              >
                Confirm
              </button>
              <button
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowModal(false);
                  setSelectedColor(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductItem;
