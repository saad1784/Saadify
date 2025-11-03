import React, { useEffect, useState } from 'react';
import { useGetOneProductQuery } from '../redux/api/productApi';
import Loader from '../layout/Loader.jsx';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserCart } from '../redux/features/cartSlice.js';
import toast from 'react-hot-toast';
import NewReviews from '../reviews/NewReviews.jsx';
import ListReview from '../reviews/ListReview.jsx';

const ProductDetail = ({ onColorSelect }) => {
  const params = useParams();
  const { data, isLoading } = useGetOneProductQuery(params?.id);
  const product = data?.product;
  const [activeImage, setActiveImage] = useState("/images/default_product.png");
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state) => state.user);
  const [selectedColor, setSelectedColor] = useState(null);

  const increaseQty = () => {
    if (quantity >= product?.stock) return;
    setQuantity(prev => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(prev => prev - 1);
  };

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product?.images?.[0]?.url || "/images/default_product.png");
    }
  }, [product]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    if (onColorSelect) onColorSelect(color);
  };

  const setItemToCart = () => {
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
    color: selectedColor || null,
    quantity,
  };
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product?._id],
      content_name: product?.name,
      content_type: "product",
      value: product?.price || 0,
      currency: "PKR",
      quantity: quantity,
    });
    dispatch(setUserCart(cartItem));
    toast.success("Item Added to Cart Successfully");
  }
};


  if (isLoading) return <Loader />;

  return (
    <>
      <div id="productDetail">
        <div className="row">
          <div className="col-12 col-md-6" id="s1">
            <div className="row">
              <div className="col-12 col-md-3 order-1 order-md-1" id="giv">
                {product?.images.map((img, index) => (
                  <div id="im2" key={index} style={img.url === activeImage ? { border: "2px solid black" } : {}}>
                    <img
                      src={img?.url || "/images/default_product.png"}
                      id="small"
                      onClick={() => setActiveImage(img.url)}
                      style={img.url === activeImage ? { filter: "none" } : {}}
                    />
                  </div>
                ))}
              </div>
              <div className="col-12 col-md-9 order-2 order-md-2" id="giv">
                <div id="im1">
                  <img src={activeImage} id="big" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6" id="s2">
            <p>Product # {product?._id}</p>
            <h2>{product?.name}</h2>
            <span>({product?.numOfReviews} reviews)</span>
            <hr />

            {product?.color?.length > 0 && (
              <div id="v11">
                <h3>Available Colors</h3>
                <div className="colors">
                  {product.color.map((color, index) => (
                    <span
                      key={index}
                      className="c1"
                      style={{
                        backgroundColor: color,
                        border: selectedColor === color ? "3px solid black" : "",
                        width: selectedColor === color ? "30px" : "25px",
                        height: selectedColor === color ? "30px" : "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleColorClick(color)}
                    ></span>
                  ))}
                </div>
                <hr />
              </div>
            )}

            <div className="row text-center" id="p1">
              <div className="col"><b>Rs {product?.price}</b></div>
              {product?.realPrice && <div className="col" id="p2">Rs {product?.realPrice}</div>}
              {product?.discount && <div className="col">{product?.discount}% OFF</div>}
            </div>

            <div className="row text-center">
              <div className="col mt-3">
                <Link>
                  <span id="minus" onClick={decreaseQty}><b>-</b></span>
                </Link>
                <input type="number" id="inter" value={quantity} readOnly />
                <Link>
                  <span id="plus" onClick={increaseQty}><b>+</b></span>
                </Link>
              </div>
              <div className="col mt-2">
                <button id="carttt" disabled={product?.stock <= 0} onClick={setItemToCart}>
                  <b>Add To Cart</b>
                </button>
              </div>
            </div>

            <hr />
            <>
              Status:{' '}
              <span
                id="stock_status"
                className={
                  product?.stock === 0
                    ? 'redColor'
                    : product?.stock <= 3
                    ? 'orangeColor'
                    : 'greenColor'
                }
              >
                {product?.stock === 0
                  ? 'Out Of Stock'
                  : product?.stock <= 3
                  ? `Only ${product.stock} left`
                  : 'In Stock'}
              </span>
              <hr />
            </>

            <h3>Description:</h3>
            <p>{product?.description}</p>
            <hr />

            {user ? <NewReviews productId={product?._id}/> : (<div id="red">Login to post your review</div>)}
          </div>
        </div>
      </div>

      <div className="container">
        {product?.reviews?.length > 0 && (
          <ListReview reviews={product?.reviews}/>
        )}
      </div>
    </>
  );
};

export default ProductDetail;