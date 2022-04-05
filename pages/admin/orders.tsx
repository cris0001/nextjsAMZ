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

function AdminOrders() {
  const classes = useStyles();
  const { userInfo } = useAppContext();
  const router = useRouter();
  const [orders, setOrders] = useState<any>();
  const [loading, setLoading] = useState(false);
  console.log(orders);

  console.log(orders);
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "/api/admin/orders",

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
    fetchData();
  }, []); //eslint-disable-line

  return (
    <Layout title="Order History">
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
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
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
                <Typography component="h1" variant="h1">
                  orders
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
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders?.map((order: any) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.user ? order.user.name : "deleted user"}</TableCell>
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

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
