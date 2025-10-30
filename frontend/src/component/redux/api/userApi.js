import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
 import {setUser,setIsAuthenticated, setLoading} from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
baseQuery: fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: "include",
}),
  keepUnusedDataFor: 30,
  tagTypes:["User","AdminUsers","AdminUser"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/me",
      transformResponse: (result) => result.user,
  async onQueryStarted(args, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled; 
      dispatch(setUser(data));
      dispatch(setIsAuthenticated(true));
      dispatch(setLoading(false));
    } catch (error) {
      console.log('Error in getMe:', error);
    }
  },
      providesTags:["User"]
    }),
     updateProfile:builder.mutation({
      query(body){
        return{
          url:"/me/update_profile",
          method:"PUT",
          body
        }
      },
      invalidatesTags:["User"],
    }),
    uploadAvatar: builder.mutation({
  query: (body) => ({
    url: "/me/update_avatar",
    method: "PUT",
    body,
  }),
      invalidatesTags:["User"],

    }),
    updatePassword: builder.mutation({
  query: (body) => ({
    url: "/me/update_password",
    method: "PUT",
    body,
  }),
      invalidatesTags:["User"],

    }),
    forgotPassword: builder.mutation({
  query: (body) => ({
    url: "/password/forgot",
    method: "POST",
    body,
  }),
      invalidatesTags:["User"],
    }),
    resetPassword: builder.mutation({
  query: ({token,body}) => ({
    url: `/password/reset/${token}`,
    method: "PUT",
    body,
  }),
      invalidatesTags:["User"],
    }),
     getAdminUsers:builder.query({
        query:()=>`/admin/users`,
        providesTags:["AdminUsers"]
    }),
    getUserDetail:builder.query({
        query:(id)=>`/admin/users/${id}`,
        providesTags:["AdminUser"]
    }), 
    updateUser: builder.mutation({
  query: ({id,body}) => ({
    url: `/admin/users/${id}`,
    method: "PUT",
    body,
  }),
  invalidatesTags:["AdminUsers"]
    }),
    deleteUser: builder.mutation({
  query: (id) => ({
    url: `/admin/users/${id}`,
    method: "DELETE",
  }),
  invalidatesTags:["AdminUsers"]
    }),
  })
});

export const {useGetMeQuery,useForgotPasswordMutation,useResetPasswordMutation
  ,useUpdateProfileMutation,useUploadAvatarMutation,useUpdatePasswordMutation
,useGetAdminUsersQuery,useDeleteUserMutation,useUpdateUserMutation,useGetUserDetailQuery
}=userApi;