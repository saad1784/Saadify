import React, { useEffect } from 'react';
import '../invoice/invoice.css';
import {useParams} from 'react-router-dom';
import html2canvas from 'html2canvas';
import {useOnlyOrderDetailQuery} from "../redux/api/orderApi.js";
import {jsPDF} from 'jspdf';
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';

const Invoice=()=>{
    const params=useParams();
      const { data, isLoading, error } = useOnlyOrderDetailQuery(params?.id);
       const order=data?.order || {};
       const {user} =useSelector((state)=>state.user);
       const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalAmount,
       }=order;
    
      useEffect(() => {
        if (error) {
          toast.error(error?.data?.message);
        }
      }, [error]);
const handleDownload = async () => {
  const invoiceContainer = document.querySelector(".order-invoice");
  const input = document.getElementById("order_invoice");
  const originalWidth = invoiceContainer.style.width;
  const originalMargin = invoiceContainer.style.marginLeft;
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    invoiceContainer.style.width = "100%";
    invoiceContainer.style.marginLeft = "0";
    invoiceContainer.style.maxWidth = "100%";
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  html2canvas(input, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
    windowWidth: input.scrollWidth,
    windowHeight: input.scrollHeight,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let finalHeight = pdfHeight;
    if (finalHeight > pageHeight) {
      finalHeight = pageHeight;
    }
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
    pdf.save(`invoice_${order?._id}.pdf`);
    invoiceContainer.style.width = originalWidth || "70%";
    invoiceContainer.style.marginLeft = originalMargin || "15%";
    invoiceContainer.style.maxWidth = "";
  });
};
       return(
        <>
        <div class="order-invoice">
        <button className="btn btn-success col-md-5" id="in0" onClick={handleDownload} >
          <i className="fa fa-print"></i> Download Invoice
        </button>
        <div class="invoice" id="order_invoice">
            <div class="logo">
            <img src="/images/invoice_logo.png" id="in1"/>
            </div>
        <h1 id="in2">Invoice #{order?._id}</h1>
        <div class="row" id="in3">
            <div class="col-7 col-md-6">
                <div><span id="in4">Name</span> {user?.first} {user?.last}</div>
                <div><span id="in4">email</span> {user?.email}</div>
                <div><span id="in4">Phone</span> {shippingInfo?.phoneNo}</div>
                <div><span id="in4">Address</span> {shippingInfo?.address},{shippingInfo?.city}</div>
                <div><span id="in4">Date</span> {new Date(order?.createdAt).toLocaleString("en-US")}</div>
                <div><span id="in4">Status</span> {paymentInfo?.status}</div>
            </div>
            
            <div class="col-5 col-md-6" id="in5">
                <div>S-Shop</div>
                <div>455 Foggy Heights,</div>
                <div> AZ 85004, US</div>
                <div>(602) 519-0450</div>
                <div>info@shopit.com</div>
            </div>
        </div>
        <div class="tableIn">
                <div class="row" id="in7">
                    <div class="col" id="in8">
                    Id
                    </div>
                    <div class="col" id="in6">
                    Name
                    </div>
                    <div class="col" id="in6">
                    Price
                    </div>
                    <div class="col" id="in6">
                    QTY
                    </div>
                    <div class="col" id="in6">
                    Total
                    </div>
                </div>
                {orderItems?.map((item)=>(
                    <div class="row">
                    <div class="col" id="in12">
                    {item?.product}
                    </div>
                    <div class="col" id="in6" style={{fontSize:"0.6rem"}}>
                    {item?.name}
                    </div>
                    <div class="col" id="in14">
                    Rs {item?.price}
                    </div>
                    <div class="col" id="in6">
                    {item?.quantity}
                    </div>
                    <div class="col" id="in14">
                    Rs {item?.quantity * item?.price}
                    </div>
                </div>
                ))}
                
                
                <div class="row">
                   <div class="col-8" id="in9">
                    <b>Subtotal</b>
                    </div>
                    <div class="col-4" id="in15">
                        Rs {order?.itemPrice}
                    </div>
                </div>
                    <div class="row">
                    <div class="col-8" id="in9">
                    <b>Shipping</b>
                    </div>
                    <div class="col-4" id="in15">
                        Rs {order?.deliveryCharges}
                    </div>
                </div>
                <div class="row">
                    <div class="col-8" id="in10">
                    <b>Grand Total</b>
                    </div>
                    <div class="col-4" id="in16">
                        Rs {totalAmount}
                    </div>
                </div>
            </div>
        <footer id="in11">
          Invoice was created on a computer and is valid without the signature.
        </footer>
        </div>
        </div>
        </>
       )
    
}
export default Invoice;