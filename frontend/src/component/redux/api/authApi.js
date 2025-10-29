import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {userApi} from "../api/userApi.js";

export const authApi =createApi({
    reducerPath:"authApi",
    baseQuery: fetchBaseQuery({
  baseUrl: "/api",
}),
    endpoints:(builder) => ({
    
        login:builder.mutation({
            query(body){
                return{
                    url:"/login",
                    method:"POST",
                    body
                }
            },
            async onQueryStarted(args,{dispatch,queryFulfilled}){
    try {
        await queryFulfilled;
        await dispatch(userApi.endpoints.getMe.initiate(null));
    } catch (error) {
        console.log(error);
    }
}
        }),
        register:builder.mutation({
            query(body){
                return{
                    url:"/register",
                    method:"POST",
                    body
                }
            }
        }),
        verifyRegistration:builder.mutation({
            query(body){
                return{
                    url:"/verify-email",
                    method:"POST",
                    body
                }
            }
        }),
     logout:builder.mutation({
            query:()=>({
                    url:"/logout",
                    method:"GET",
                    credentials:"include"
            })
        }),
         
        
    })
})
export const {useLoginMutation,useRegisterMutation,useLogoutMutation,useVerifyRegistrationMutation}=authApi;