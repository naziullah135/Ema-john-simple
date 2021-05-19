import React from "react";
import { Elements} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SimpleCardForm from "./SimpleCardForm";

const stripePromise = loadStripe(
  "pk_test_51Ie13OJQWSG6jdbP5O3IQzdrmqC3O0BRlYzO3ULSg7XX4WtjdVupBnxGcV2ft3XACNT0Ky23NWxuMzXr7qiEuXvT00TsuJNvsX"
);

const ProcessPayment = () => {
  return (
    <Elements stripe={stripePromise}>
        <SimpleCardForm></SimpleCardForm>
    </Elements>
  );
};

export default ProcessPayment;
