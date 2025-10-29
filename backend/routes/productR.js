import express from 'express';
import { canUserReview, createProduct, createProductReviews, deleteProduct, deleteProductImage, deleteReview, getAdminProducts, getOneProduct, getProducts, getReviews, updateProduct, uploadProductImages } from '../controller/productC.js';
import { authorizedRoles, isAuthenticatedUser } from '../middlewear/authen.js';

const routerP =express.Router();

routerP.route("/products").get(getProducts);
routerP.route("/admin/products").post(isAuthenticatedUser,authorizedRoles("admin"),createProduct);
routerP.route("/product/:id").get(getOneProduct);
routerP.route("/admin/products").get(isAuthenticatedUser,authorizedRoles("admin"),getAdminProducts);
routerP.route("/admin/products/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct);
routerP.route("/admin/products/:id/upload_images").put(isAuthenticatedUser,authorizedRoles("admin"),uploadProductImages);
routerP.route("/admin/products/:id/delete_image").put(isAuthenticatedUser,authorizedRoles("admin"),deleteProductImage);
routerP.route("/admin/products/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct);
routerP.route("/create/review").put(isAuthenticatedUser,createProductReviews);
routerP.route("/reviews").get(isAuthenticatedUser,getReviews);
routerP.route("/admin/review").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteReview);
routerP.route("/can_review").get(isAuthenticatedUser,canUserReview);

export default routerP;