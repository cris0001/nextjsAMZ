import React, { useEffect } from "react";
import { Button, List, ListItem, TextField, Typography, Link } from "@material-ui/core";
import { NextPage } from "next";
import NextLink from "next/link";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useAppContext } from "../utils/Context";
import CheckoutProgress from "../components/CheckoutProgress";

type FormValues = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const Shipping: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const { userInfo, cart, setCart } = useAppContext();
  const router = useRouter();
  const classes = useStyles();

  const handleSubmitForm = ({ fullName, address, city, postalCode, country }: FormValues) => {
    setCart({ ...cart, address: { fullName, address, city, postalCode, country } });
    Cookies.set("shippingAddress", JSON.stringify({ fullName, address, city, postalCode, country }));
    router.push("/payment");
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    if (cart.address) {
      setValue("fullName", cart.address.fullName);
      setValue("address", cart.address.address);
      setValue("city", cart.address.city);
      setValue("postalCode", cart.address.postalCode);
      setValue("country", cart.address.country);
    }
  }, []); //eslint-disable-line

  return (
    <Layout title="Shipping">
      <CheckoutProgress activeStep={1} />
      <form onSubmit={handleSubmit(handleSubmitForm)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Shipping address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  inputProps={{ type: "text" }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === "minLength"
                        ? "name is not valid"
                        : "name is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            {" "}
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Address"
                  inputProps={{ type: "text" }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.address
                      ? errors.address.type === "minLength"
                        ? "address is not valid"
                        : "address is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="City"
                  inputProps={{ type: "text" }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.city ? (errors.city.type === "minLength" ? "city is not valid" : "city is required") : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            {" "}
            <Controller
              name="postalCode"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  inputProps={{ type: "text" }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === "minLength"
                        ? "postal code is not valid"
                        : "postal code is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            {" "}
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="country"
                  label="Country"
                  inputProps={{ type: "text" }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.country
                      ? errors.country.type === "minLength"
                        ? "country is not valid"
                        : "country is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Shipping;
