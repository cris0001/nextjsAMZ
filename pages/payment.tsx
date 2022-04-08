import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useAppContext } from "../utils/Context";
import Cookies from "js-cookie";
import CheckoutProgress from "../components/CheckoutProgress";
import useStyles from "../utils/styles";
import { useSnackbar } from "notistack";

import {
  ListItem,
  Typography,
  List,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@material-ui/core";

const Payment: NextPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const { cart, setCart } = useAppContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();

  const handleSubmit = (e: any) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar("pleace choose payment method", { variant: "error" });
    } else {
      Cookies.set("paymentMethod", paymentMethod);
      setCart({ ...cart, paymentMethod: paymentMethod });
      router.push("/placeorder");
    }
  };

  useEffect(() => {
    if (!cart.address) {
      router.push("/shipping");
    } else setPaymentMethod(Cookies.get("paymentMethod" || "")!);
  }, []); //eslint-disable-line

  return (
    <Layout title="Payment">
      <CheckoutProgress activeStep={2} />
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography component="h1" variant="h1">
          payment method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                arial-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel label="Credit Card" value="Creadit Card" control={<Radio />}></FormControlLabel>
                <FormControlLabel label="PayPal" value="PayPal" control={<Radio />}></FormControlLabel>
                <FormControlLabel label="Bank Transfer" value="Bank Transfer" control={<Radio />}></FormControlLabel>
                <FormControlLabel label="Cash" value="Cash" control={<Radio />}></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button type="submit" fullWidth variant="contained" color="primary">
              continue
            </Button>
          </ListItem>
          <ListItem>
            <Button type="button" onClick={() => router.push("/shipping")} fullWidth variant="contained">
              back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
