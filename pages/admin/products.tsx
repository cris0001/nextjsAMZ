import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  List,
  ListItem,
  CircularProgress,
  Button,
  ListItemText,
  TableRow,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableBody,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useAppContext } from "../../utils/Context";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../../components/Layout";
import useStyles from "../../utils/styles";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";

function AdminProducts() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { userInfo } = useAppContext();
  const router = useRouter();
  const [products, setProducts] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [prodLoading, setProdLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }

    fetchData();
  }, []); //eslint-disable-line

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/admin/products",

        {
          headers: {
            authorization: `User ${userInfo?.token}`,
          },
        }
      );
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!window.confirm("are u sure?")) {
      return;
    }
    try {
      setProdLoading(true);
      const { data } = await axios.post(
        "/api/admin/products",
        {},
        {
          headers: { authorization: `User ${userInfo.token}` },
        }
      );
      enqueueSnackbar("product created successfully", { variant: "success" });
      setProdLoading(false);
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
      setProdLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("are u sure?")) {
      return;
    }
    try {
      setDelLoading(true);
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `User ${userInfo.token}` },
      });
      enqueueSnackbar("product deleted successfully", { variant: "success" });
      setDelLoading(false);
      fetchData();
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
      setDelLoading(false);
    }
  };
  return (
    <Layout title="Products">
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
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
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
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                  </Grid>
                  <Grid item xs={6} align="right">
                    <Button onClick={handleCreateProduct} color="primary" variant="contained">
                      create
                    </Button>
                    {prodLoading && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products?.map((product: any) => (
                          <TableRow key={product._id}>
                            <TableCell>{product._id.substring(20, 24)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}$</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink href={`/admin/product/${product._id}`} passHref>
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{" "}
                              <Button onClick={() => handleDeleteProduct(product._id)} size="small" variant="contained">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
