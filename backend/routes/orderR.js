import express from 'express';
import { authorizedRoles, isAuthenticatedUser } from '../middlewear/authen.js';
import { allOrders, deleteOrder, getOnlyOrderDetail, getOrderDetails, getOrders, getSales, newOrder, updateOrder } from '../controller/orderC.js';

const routerO =express.Router();

routerO.route("/order/me").post(isAuthenticatedUser, newOrder);
routerO.route("/order/:id").get(isAuthenticatedUser, getOrderDetails);
routerO.route("/order_detail/:id").get(isAuthenticatedUser, getOnlyOrderDetail);
routerO.route("/me/orders").get(isAuthenticatedUser,getOrders);
routerO.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("admin"),allOrders);
routerO.route("/admin/orders/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateOrder);
routerO.route("/admin/orders/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteOrder);
routerO.route("/admin/get_sales").get(isAuthenticatedUser,authorizedRoles("admin"),getSales);

export default routerO;