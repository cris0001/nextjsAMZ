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
  Card,
  List,
  ListItem,
  CircularProgress,
} from "@material-ui/core";
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Image from "next/image";
import Layout from "../../components/Layout";
import { useAppContext } from "../../utils/Context";
import { Item, Ord } from "../../types";
import { useRouter } from "next/router";
import useStyles from "../../utils/styles";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import axios from "axios";

function Order({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const orderId = params.id;
  const [orderInfo, setOrderInfo] = useState<Ord | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userInfo } = useAppContext();
  const classes = useStyles();

  useEffect((): any => {
    if (!userInfo) {
      return router.push("/login");
    }
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data }: { data: Ord } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `User ${userInfo?.token}`,
          },
        });

        setOrderInfo(data);
        setLoading(false);
      } catch (err) {
        getError(err);
        setLoading(false);
      }
    };
    if (!orderInfo || (orderInfo._id && orderInfo._id !== orderId)) {
      fetchOrder();
    }
  }, [orderInfo]); //eslint-disable-line

  return (
    <Layout title="Order details">
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
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
                  {orderInfo?.shippingAddress.fullName}, {orderInfo?.shippingAddress.address},{" "}
                  {orderInfo?.shippingAddress.city},{orderInfo?.shippingAddress.postalCode},{" "}
                  {orderInfo?.shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status: {orderInfo?.isDelivered ? `delivered at ${orderInfo?.deliveredAt}` : "not delivered"}
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
                <ListItem>{orderInfo?.paymentMethod}</ListItem>
                <ListItem>Status: {orderInfo?.isPaid ? `paid at ${orderInfo?.paidAt}` : "not paid"}</ListItem>
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
                        {orderInfo?.orderItems.map((item: any) => (
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
                      <Typography>{orderInfo?.itemsPrice}$</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>shipping:</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography>{orderInfo?.shippingPrice}$</Typography>
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
                        <strong>{orderInfo?.totalPrice}$</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
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

export default dynamic(() => Promise.resolve(Order), { ssr: false });
