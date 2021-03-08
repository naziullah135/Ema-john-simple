import React from "react";

const Cart = (props) => {
  const cart = props.cart;
  const total = cart.reduce(
    (total, prd) => total + prd.price * prd.quantity,
    0
  );

  let shipping = 0;
  if (total > 35) {
    shipping = 0;
  } else if (total > 15) {
    shipping = 4.99;
  } else if (total > 0) {
    shipping = 12.99;
  }

  const tax = total / 10;
  const grandTotal = total + shipping + Number(tax);

  const formatNumber = (num) => {
    const precision = num.toFixed(2);
    return Number(precision);
  };

  return (
    <div>
      <h3>Order Summary</h3>
      <h5>Items Ordered: {cart.length}</h5>
      <p>Product Price: {formatNumber(total)}</p>
      <p>
        <small>Shipping Charge: {shipping}</small>
      </p>
      <p>
        <small>Tax & Vat: {formatNumber(tax)}</small>
      </p>
      <p>Total Price: {formatNumber(grandTotal)}</p>
      <br />
      {props.children}
    </div>
  );
};

export default Cart;
