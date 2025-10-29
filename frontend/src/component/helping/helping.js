export const updateQueryParam =(searchParams,key,value)=>{
const hasValueInParams=searchParams.has(key);
    if(value && hasValueInParams){
        searchParams.set(key,value);
    }else if(value){
        searchParams.append(key,value);
    }else{
        searchParams.delete(key);
    }
    return searchParams;
};

export const calculateOrderCost = (cartItems = []) => {
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = 200;
  const totalPrice = Number((itemsPrice + shippingPrice).toFixed(2));

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice,
    totalPrice
  };
};