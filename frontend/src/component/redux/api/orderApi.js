import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const orderApi =createApi({
    reducerPath:"orderApi",
    baseQuery: fetchBaseQuery({  baseUrl: "/api",
     }),
      tagTypes:["Order","AdminOrders"],
    keepUnusedDataFor:30,
    endpoints:(builder) => ({
   createNewOrder: builder.mutation({
      query: (body) => ({
        url: "/order/me",
        method: "POST",
        body,
      }),
    }),
    getDashboardSales:builder.query({
        query:({startDate,endDate})=>`/admin/get_sales?startDate=${startDate}&endDate=${endDate}`
    }),
        adminGetOrders:builder.query({
        query:()=>`/admin/orders`,
        providesTags:["AdminOrders"]
    }), 
       myOrders:builder.query({
        query:()=>`/me/orders`
    }),  onlyOrderDetail:builder.query({
        query:(id)=>`/order_detail/${id}`,
        providesTags:["Order"]
    }),
    orderDetails: builder.query({
  query: ({ id, token }) => `/order/${id}?t=${token}`,
  providesTags: ["Order"],
}),
    adminGetOrders:builder.query({
        query:()=>`/admin/orders`,
        providesTags:["AdminOrders"]
    }), 
        updateOrder:builder.mutation({
        query({id,body}){
            return{
                url:`/admin/orders/${id}`,
                method:"PUT",
                body
            }
        },
        invalidatesTags:["Order"]
    }),
    deleteOrder:builder.mutation({
        query(id){
            return{
                url:`/admin/orders/${id}`,
                method:"DELETE",
            }
        },
        invalidatesTags:["AdminOrders"]
    }),
    })
})
export const {useCreateNewOrderMutation,useMyOrdersQuery,useOrderDetailsQuery
    ,useAdminGetOrdersQuery ,useDeleteOrderMutation,useUpdateOrderMutation,useLazyGetDashboardSalesQuery
,useOnlyOrderDetailQuery
}=orderApi;