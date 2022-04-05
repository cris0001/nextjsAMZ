import React, { useEffect, useState } from "react";
import { Grid, Typography, Card, List, ListItem, Button, ListItemText, TextField } from "@material-ui/core";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import NextLink from "next/link";
import { useAppContext } from "../utils/Context";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import { redirect } from "next/dist/server/api-utils";
import Cookies from "js-cookie";
import { getError } from "../utils/error";

type FormValues = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
};

function Profile() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const classes = useStyles();
  const { userInfo, setUserInfo } = useAppContext();
  const router = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  }, []); //eslint-disable-line

  const handleSubmitForm = async ({ name, email, password, confirmPassword }: FormValues) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("passwords dont match", { variant: "error" });

      return;
    }
    try {
      const { data } = await axios.put("/api/users/profile", { name, email, password, userInfo });
      Cookies.set("userInfo", JSON.stringify(data));
      enqueueSnackbar("profile updated", { variant: "success" });
      setUserInfo(data);
      router.push("/");
    } catch (err: any) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form onSubmit={handleSubmit(handleSubmitForm)} className={classes.form}>
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
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
                            id="name"
                            label="Name"
                            inputProps={{ type: "text" }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === "minLength"
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
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            inputProps={{ type: "email" }}
                            error={Boolean(errors.email)}
                            helperText={
                              errors.email
                                ? errors.email.type === "pattern"
                                  ? "email is not valid"
                                  : "email is required"
                                : ""
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => value === "" || value.length > 5 || "Password length is more tha n5",
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.password)}
                            helperText={errors.email ? "password is too short" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === "" || value.length > 5 || "confirm password length is more tha n5",
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.email ? "confirm password is too short" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" type="submit" fullWidth color="primary">
                        update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
