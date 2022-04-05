import React, { useState } from "react";
import { Button, List, ListItem, TextField, Typography, Link } from "@material-ui/core";
import { NextPage } from "next";
import NextLink from "next/link";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import { useRouter } from "next/router";
import axios from "axios";
import { useAppContext } from "../utils/Context";
import Cookies from "js-cookie";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";

type FormValues = {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
};

const Register: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { setUserInfo } = useAppContext();

  const router = useRouter();
  const { redirect }: any = router.query;
  const classes = useStyles();

  const handleSubmitForm = async ({ name, email, password, confirmPassword }: FormValues) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("passwords dont match", { variant: "error" });

      return;
    }
    try {
      const { data } = await axios.post("/api/users/register", { name, email, password });
      Cookies.set("userInfo", JSON.stringify(data));
      JSON.parse(Cookies.get("userInfo")!);
      setUserInfo(data);
      console.log(data);
      router.push(redirect || "/");
    } catch (error: any) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };
  return (
    <Layout title="Register">
      <form onSubmit={handleSubmit(handleSubmitForm)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
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
                    errors.name ? (errors.name.type === "minLength" ? "name is not valid" : "name is required") : ""
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
                    errors.email ? (errors.email.type === "pattern" ? "email is not valid" : "email is required") : ""
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
                required: true,
                minLength: 6,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.email
                      ? errors.email.type === "minLength"
                        ? "password is too short"
                        : "password is required"
                      : ""
                  }
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
                required: true,
                minLength: 6,
              }}
              render={({ field }: any) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.email
                      ? errors.email.type === "minLength"
                        ? "password is too short"
                        : "password is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              register
            </Button>
          </ListItem>
          <ListItem>
            <NextLink href={`/login?redirect=${redirect || "/"}`} passHref>
              <Link>Already have account?</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;
