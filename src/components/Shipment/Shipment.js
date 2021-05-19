import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import ProcessPayment from "../ProcessPayment/ProcessPayment";
import "./Shipment.css";

const Shipment = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const onSubmit = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="row">
      <div className="col-md-6">
        <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            name="name"
            defaultValue={loggedInUser.name}
            ref={register({ required: true })}
            placeholder="Enter your name"
          />
          {errors.name && <span className="error">Name is required</span>}
          <input
            name="email"
            defaultValue={loggedInUser.email}
            ref={register({ required: true })}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">Email is required</span>}
          <input
            name="address"
            ref={register({ required: true })}
            placeholder="Enter your addresss"
          />
          {errors.address && <span className="error">Address is required</span>}
          <input
            name="phone"
            ref={register({ required: true })}
            placeholder="Enter your phone"
          />
          {errors.phone && <span className="error">Phone is required</span>}

          <input type="submit" className="btn btn-primary" />
        </form>
      </div>
      <div className="col-md-6">
        <h2>Please Pay for Me</h2>
        <ProcessPayment />
      </div>
    </div>
  );
};

export default Shipment;
