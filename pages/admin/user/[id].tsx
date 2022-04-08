import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  List,
  ListItem,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import NextLink from "next/link";
import { useAppContext } from "../../../utils/Context";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import Layout from "../../../components/Layout";
import useStyles from "../../../utils/styles";
import { getError } from "../../../utils/error";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

type FormValues = {
  name: string;
  isAdmin: boolean;
};

function EditUser({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userId = params.id;
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const classes = useStyles();
  const { userInfo } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      setLoading(true);
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `User ${userInfo.token}` },
          });
          console.log(data);
          setValue("name", data.name);
          setIsAdmin(data.isAdmin);
          setLoading(false);
        } catch (error: any) {
          //enqueueSnackbar(error.response.data ? error.response.data.message : error.message, { variant: "error" });
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []); //eslint-disable-line

  //   slug, price,image,category, brand, countInStock,description

  const handleSubmitForm = async ({ name }: { name: string }) => {
    closeSnackbar();

    try {
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        isAdmin,
      });

      enqueueSnackbar("user updated", { variant: "success" });
      router.push("/admin/users");
    } catch (err: any) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="Edit User">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
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
                  edit user {userId}
                </Typography>
              </ListItem>
              <ListItem>{loading && <CircularProgress />}</ListItem>
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
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? "Name is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Checkbox checked={isAdmin} name="isAdmin" onClick={(e: any) => setIsAdmin(e.target.checked)} />
                    </ListItem>

                    <ListItem>
                      <Button
                        disabled={userInfo._id === userId}
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        update user
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
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  };
};

export default dynamic(() => Promise.resolve(EditUser), { ssr: false });
