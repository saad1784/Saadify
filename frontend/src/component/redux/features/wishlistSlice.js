import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;

      // check if product already exists in wishlist
      const isItemExist = state.wishlistItems.find(
        (i) => i.product === item.product
      );

      if (!isItemExist) {
        state.wishlistItems.push(item);
      }

      localStorage.setItem(
        "wishlistItems",
        JSON.stringify(state.wishlistItems)
      );
    },

    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (i) => i.product !== action.payload
      );

      localStorage.setItem(
        "wishlistItems",
        JSON.stringify(state.wishlistItems)
      );
    },

    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem("wishlistItems");
    },
  },
});

export default wishlistSlice.reducer;
export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
