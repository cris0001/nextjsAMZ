import React, { useEffect, useState } from "react";
import {
  Grid,
  TableContainer,
  Typography,
  Card,
  List,
  ListItem,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  ListItemText,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useAppContext } from "../utils/Context";
import { useRouter } from "next/router";
import { Ord } from "../../nxtamz/types/index";
import axios from "axios";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";

function OrderHistory() {
  const classes = useStyles();
  const { userInfo } = useAppContext();
  const router = useRouter();
  const [orders, setOrders] = useState<Ord[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }

    // const fetchOrders = async () => {
    //   setLoading(true);
    //   try {
    //     const { data } = await axios.get(
    //       "/api/orders/history",

    //       {
    //         headers: {
    //           authorization: `User ${userInfo?.token}`,
    //         },
    //       }
    //     );
    //     console.log(data);
    //     setOrders(data);
    //     setLoading(false);
    //   } catch (err) {
    //     setLoading(false);
    //   }
    // };
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/orders/history/${userInfo?._id}`,

          {
            headers: {
              authorization: `User ${userInfo?.token}`,
            },
          }
        );
        console.log(data);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); //eslint-disable-line

  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
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
                  Order History
                </Typography>
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
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>{order.isPaid ? `paid at ${order.paidAt}` : "not paid"}</TableCell>
                            <TableCell>
                              {order.isDelivered ? `delivered at ${order.deliveredAt}` : "not delivered"}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
