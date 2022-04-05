import React, { useEffect } from "react";
import { Button, List, ListItem, TextField, Typography, Link } from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useAppContext } from "../utils/Context";
import useStyles from "../utils/styles";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";

type FormValues = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const { redirect }: any = router.query;
  const { userInfo, setUserInfo } = useAppContext();

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []); //eslint-disable-line

  const handleSubmitLogin = async ({ email, password }: FormValues) => {
    closeSnackbar();
    try {
      const { data } = await axios.post("/api/users/login", { email, password });

      Cookies.set("userInfo", JSON.stringify(data));
      setUserInfo(data);
      router.push(redirect || "/");
    } catch (error: any) {
      enqueueSnackbar(error.response.data ? error.response.data.message : error.message, { variant: "error" });
    }
  };
  const classes = useStyles();

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(handleSubmitLogin)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
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
            <Button variant="contained" type="submit" fullWidth color="primary">
              login
            </Button>
          </ListItem>
          <ListItem>
            <NextLink href={`/register?redirect=${redirect || "/"}`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Login;
