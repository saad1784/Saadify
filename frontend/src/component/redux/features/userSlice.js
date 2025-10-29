import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user:null,
    isAuthenticated:false,
    loading:true
};
export const userSlice=createSlice({
    initialState,
    name:"userSlice",
    reducers:{
        setUser(state,action){
            state.user=action.payload;
        },
        setIsAuthenticated(state,action){
            state.isAuthenticated=action.payload;
        },
        setLoading(state,action){
            state.loading=action.payload;
        },
          logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    }
});
export default userSlice.reducer;
export const {setUser,setIsAuthenticated,logoutUser,setLoading}=userSlice.actions;