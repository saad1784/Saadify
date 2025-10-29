import { configureStore} from "@reduxjs/toolkit";
import  userReducer from "./features/userSlice.js";
import cartReducer from "./features/cartSlice.js";
import wishListReducer from "./features/wishlistSlice.js";
import { authApi } from "./api/authApi.js";
import { userApi } from "./api/userApi.js";
import { productApi } from "./api/productApi.js";
import { orderApi } from "./api/orderApi.js";

const store = configureStore({
  reducer: {
    user:userReducer,
    cart:cartReducer,
    wishList:wishListReducer,
    [authApi.reducerPath]:authApi.reducer,
    [userApi.reducerPath]:userApi.reducer,
    [productApi.reducerPath]:productApi.reducer,
    [orderApi.reducerPath]:orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,
      userApi.middleware,productApi.middleware,
      orderApi.middleware
    ),
});

export default store;