import React, { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useLazyGetDashboardSalesQuery} from '../redux/api/orderApi.js';
import Loader from '../layout/Loader.jsx';
import toast from 'react-hot-toast';
import SalesChart from '../chart/SalesChart.jsx';

const Dashboard=()=>{
    const [startDate,setStartDate]=useState(new Date().setDate(1));
  const [endDate,setEndDate]=useState(new Date());
  const [getDashboardSales,{error,isLoading,data}]=useLazyGetDashboardSalesQuery();
   const submitHandler=()=>{
    getDashboardSales({
    startDate:new Date(startDate).toISOString(),
    endDate:endDate.toISOString()
    })
  }
  useEffect(()=>{
    if(error){
    toast.error(error?.data?.message)
    }
    if(startDate && endDate && !data){
      getDashboardSales({
    startDate:new Date(startDate).toISOString(),
    endDate:endDate.toISOString()
    });
  }
  },[error,startDate,endDate,data,getDashboardSales]);
  if(isLoading) return <Loader />;
  return(
        <>
        <AdminLayout>
            <div class="row">
                <div class="col-12 col-md-8 row">
                     <p class="w-50">
            <label class="mx-4 my-1"><b>Start Date</b></label><br />
            <DatePicker 
          selected={startDate}
        onChange={(date)=>setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="form-control mx-3"
        />
            </p>
            <p class="w-50">
            <label class="mx-2 my-1"><b>End Date</b></label><br />
            <DatePicker 
        selected={endDate}
        onChange={(date)=>setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className="form-control"
        />
            </p>
                </div>
                <div class="col-12 col-md-4 text-center">
                    <button id="fetch" onClick={submitHandler} disabled={startDate > endDate}>Fetch</button>
                </div>
            </div>
            <div class="row ">
                <div class="col-6">
                <div class="text-center" id="sales">
                  <span><b>Sales</b></span> <br/>
                  <span id="nowrap">Rs {data?.totalSales?.toFixed(2)}</span>
                </div>
                </div>
                <div class="col-6">
                    <div class="text-center" id="sales">
                  <span id="nowrap"><b>Orders</b></span> <br/>
                  <span>{data?.totalNumOrders}</span>
                </div>
                </div>
            </div>
            <SalesChart salesData={data?.sales}/>
    <div className="mb-5"></div>
        </AdminLayout>
        </>
    )
}
export default Dashboard;