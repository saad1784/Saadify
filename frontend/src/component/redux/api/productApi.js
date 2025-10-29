import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const productApi =createApi({
    reducerPath:"productApi",
    baseQuery: fetchBaseQuery({  baseUrl: "/api",
     }),
    tagTypes:["Product","AdminProducts","Reviews"],
    endpoints:(builder) => ({
        getProducts:builder.query({
            query:(params)=> ({
                url:"/products",
                params:{
        keyword:params?.keyword,
        category:params?.category,
        "price[gte]":params.min,
        "price[lte]":params.max,
    }
            })
        }),
        getOneProduct:builder.query({
            query:(id)=>`product/${id}`,
            providesTags:["Product"]
        }),
        getAdminProducts:builder.query({
            query:()=>`/admin/products`,
            providesTags:["AdminProducts"]
        }),
        newProducts:builder.mutation({
        query(body){
            return{
                url:"/admin/products",
                method:"POST",
                body
            }
        },
        invalidatesTags:["AdminProducts"]
        }),
        updateProducts:builder.mutation({
        query({id,body}){
            return{
                url:`/admin/products/${id}`,
                method:"PUT",
                body
            }
        },
        invalidatesTags:["AdminProducts"]
        }),
        uploadProductImages:builder.mutation({
        query({id,body}){
            return{
                url:`/admin/products/${id}/upload_images`,
                method:"PUT",
                body
            }
        },
        invalidatesTags:["Product"]
        }),
        deleteProductImage:builder.mutation({
        query({id,body}){
            return{
                url:`/admin/products/${id}/delete_image`,
                method:"PUT",
                body
            }
        },
        invalidatesTags:["Product"]
        }),
        deleteProduct: builder.mutation({
            query(id) {
            return {
            url: `/admin/products/${id}`,
            method: "DELETE",
            };
            },
        invalidatesTags:["Product","AdminProducts"]

}), submitReviews:builder.mutation({
        query(body){
            return{
                url:"/create/review",
                method:"PUT",
                body
            }
        },
                    invalidatesTags:["Product"]

        }),
         canUserReview:builder.query({
            query:(productId)=>`/can_review?productId=${productId}`,
        }),
getProductReviews:builder.query({
            query:(productId)=>`/reviews?id=${productId}`,
            providesTags:["Reviews"]
        }),
          deleteReview: builder.mutation({
  query({productId,id}) {
    return {
      url: `/admin/review?productId=${productId}&id=${id}`,
      method: "DELETE",
    };
  },
        invalidatesTags:["Reviews"]

}),
    })
})
export const {useGetProductsQuery,useGetOneProductQuery,useGetAdminProductsQuery
    ,useDeleteProductMutation,useNewProductsMutation,useUpdateProductsMutation
    ,useUploadProductImagesMutation,useDeleteProductImageMutation,useLazyGetProductReviewsQuery
    ,useDeleteReviewMutation,useSubmitReviewsMutation,useCanUserReviewQuery
}=productApi;