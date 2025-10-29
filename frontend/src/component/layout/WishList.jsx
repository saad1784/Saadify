import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../redux/features/wishlistSlice';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { setUserCart } from '../redux/features/cartSlice';
import toast from 'react-hot-toast';

const WishList = () => {
  const dispatch = useDispatch();
  const { wishlistItems} = useSelector((state) => state.wishList);

  const setItemToCart = (item) => {
    const cartItem = {
      product: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: item.stock,
      quantity: 1,
    };
    dispatch(setUserCart(cartItem));
    toast.success("Item Added to Cart Successfully");
  };

  const removeWishListItems = (id) => {
    dispatch(removeFromWishlist(id));
  };

  if (!wishlistItems) return <Loader />;

  return (
    <div class="text-center mt-4">
    {wishlistItems.length > 0 && (
        <h4 class="mt-4"><b>Your Wished Product.</b></h4>

    )}
    <div className="center-div">
      {wishlistItems.length === 0 ? (
        <h4 class="mt-4"><b>No items in your wishlist.</b></h4>
      ) : (
        wishlistItems.map((item) => (
          <div id="product"  key={item.product}>
            <Link to={`/product/${item.product}`}>
              <img src={item.image || "/images/default_product.png"} alt={item.name} id="smal" />
            </Link>
            <br />
            <button
              id="atc"
              disabled={item.stock <= 0}
              onClick={() => setItemToCart(item)}
            >
              Add To Cart
            </button>
            <p id="p0">
              <b>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
              </b>
            </p>

            <div id="container">
              <div id="left">
                <span>Rs {item.price}</span><br />
                {item.realPrice && <span id="cutt">Rs {item.realPrice}</span>}
              </div>
              <div id="right">
                {item.discount && <span>{item.discount}% OFF<br /></span>}
                <span>
                  <b>
                   <Link><i
                      className="bi bi-trash-fill fs-5"
                      onClick={() => removeWishListItems(item.product)}
                      id="yee"
                    ></i></Link> 
                  </b>
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default WishList;
