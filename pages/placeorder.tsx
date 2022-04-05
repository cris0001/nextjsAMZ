import React, { useEffect, useState } from "react";
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Button,
  Card,
  List,
  ListItem,
  CircularProgress,
} from "@material-ui/core";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import { useAppContext } from "../utils/Context";
import { Item } from "../types";
import { useRouter } from "next/router";
import CheckoutProgress from "../components/CheckoutProgress";
import useStyles from "../utils/styles";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import axios from "axios";

const PlaceOrder: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { cart, userInfo, clearCart } = useAppContext();
  const classes = useStyles();
  const paymentMethod = Cookies.get("paymentMethod");
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const round2 = (num: number): number => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cart.cartItems!.reduce((a, c: any) => a + c.price * c.quantity, 0));
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = round2(itemsPrice + shippingPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, []); //eslint-disable-line

  const handlePlaceOrder = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      console.log("test");
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.address,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          userInfo,
        },
        {
          headers: {
            authorization: `User ${userInfo?.token}`,
          },
        }
      );
      console.log(data);
      clearCart();
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Layout title="Place order">
      <CheckoutProgress activeStep={3} />
      <Typography component="h1" variant="h1">
        Place order
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2" component="h2">
                  shipping address
                </Typography>
              </ListItem>
              <ListItem>
                {cart.address.fullName}, {cart.address.address}, {cart.address.city}, {cart.address.postalCode},{" "}
                {cart.address.country}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2" component="h2">
                  payment method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2" component="h2">
                  order items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.cartItems!.map((item: Item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>${item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">order summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>{itemsPrice}$</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>shipping:</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>{shippingPrice}$</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>total:</strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      <strong>{totalPrice}$</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button onClick={handlePlaceOrder} variant="contained" color="primary" fullWidth>
                  place order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
