import { Stepper, Step, StepLabel } from "@material-ui/core";
import React from "react";

const CheckoutProgress = ({ activeStep = 0 }) => {
  return (
    <Stepper style={{ background: "transparent" }} activeStep={activeStep} alternativeLabel>
      {["Login", "Shippinh Address", "Payment Method", "Place Order"].map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutProgress;
