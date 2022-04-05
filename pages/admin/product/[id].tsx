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
  slug: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  countInStock: number;
  description: string;
};

function EditProduct({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const productId = params.id;
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
  const [loadingUpload, setLoadingUpload] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      setLoading(true);
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `User ${userInfo.token}` },
          });

          setValue("name", data.name);
          setValue("slug", data.slug);
          setValue("price", data.price);
          setValue("image", data.image);
          setValue("category", data.category);
          setValue("brand", data.brand);
          setValue("countInStock", data.countInStock);
          setValue("description", data.description);
          setLoading(false);
        } catch (error: any) {
          enqueueSnackbar(error.response.data ? error.response.data.message : error.message, { variant: "error" });
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []); //eslint-disable-line

  //   slug, price,image,category, brand, countInStock,description

  const handleSubmitForm = async ({
    name,
    slug,
    price,
    image,
    category,
    brand,
    countInStock,
    description,
  }: FormValues) => {
    closeSnackbar();

    try {
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      });

      enqueueSnackbar("product updated", { variant: "success" });
      router.push("/admin/products");
    } catch (err: any) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    setLoadingUpload(true);
    try {
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `User ${userInfo?.token}`,
        },
      });
      setValue("image", data.secure_url);
      enqueueSnackbar("image updated", { variant: "success" });
      setLoadingUpload(false);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
      setLoadingUpload(false);
    }
  };

  return (
    <Layout title="edit product">
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
                <ListItem selected button component="a">
                  <ListItemText primary="Products"></ListItemText>
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
                  edit product {productId}
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
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? "Slug is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue={0}
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Price"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? "Price is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="image"
                            label="Image"
                            error={Boolean(errors.image)}
                            helperText={errors.image ? "Image is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" component="label">
                        upload file
                        <input type="file" onChange={handleUpload} hidden />
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={errors.category ? "Category is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="brand"
                            label="Brand"
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? "Brand is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue={0}
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Count In Stock"
                            error={Boolean(errors.countInStock)}
                            helperText={errors.countInStock ? "Count In Stock is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="description"
                        defaultValue=""
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field }: any) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="description"
                            label="Description"
                            error={Boolean(errors.description)}
                            helperText={errors.description ? "Description is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button variant="contained" type="submit" fullWidth color="primary">
                        update product
                      </Button>
                      {loadingUpload && <CircularProgress />}
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

export default dynamic(() => Promise.resolve(EditProduct), { ssr: false });
