import express from 'express';
import { deleteUser, forgotPassword, getUser, getUserDetails, getUserProfile, loginUser, logOut, registerUser, resetPassword,
     updatePassword, 
     updateProfile,
     updateUser,
     uploadAvatar,
     } from '../controller/userC.js';
import { authorizedRoles, isAuthenticatedUser } from '../middlewear/authen.js';
const router =express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser,getUserProfile);
router.route("/me/update_password").put(isAuthenticatedUser,updatePassword);
router.route("/me/update_profile").put(isAuthenticatedUser,updateProfile);
router.route("/me/update_avatar").put(isAuthenticatedUser,uploadAvatar);


router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("admin"),getUser);
router.route("/admin/users/:id")
.get(isAuthenticatedUser, authorizedRoles("admin"),getUserDetails)
.put(isAuthenticatedUser, authorizedRoles("admin"),updateUser)
.delete(isAuthenticatedUser, authorizedRoles("admin"),deleteUser)




export default router;