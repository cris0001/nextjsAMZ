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
  CardContent,
  CardActions,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useAppContext } from "../../utils/Context";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../../components/Layout";
import useStyles from "../../utils/styles";

type Summary = {
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  ordersPrice: number;
  salesData: [];
};

function AdminDashboard() {
  const classes = useStyles();
  const { userInfo } = useAppContext();
  const router = useRouter();
  const [summary, setSummary] = useState<Summary>({
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
    ordersPrice: 0,
    salesData: [],
  });
  const [loading, setLoading] = useState(false);

  console.log(summary);
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "/api/admin/summary",

          {
            headers: {
              authorization: `User ${userInfo?.token}`,
            },
          }
        );

        setSummary(data);
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
                <ListItem selected button component="a">
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
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">{summary.ordersPrice}$</Typography>
                          <Typography>sales</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="admin/orders" passHref>
                            <Button size="small" color="primary">
                              view sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">{summary.ordersCount}</Typography>
                          <Typography>orders</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="admin/orders" passHref>
                            <Button size="small" color="primary">
                              view orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">{summary.productsCount}</Typography>
                          <Typography>proucts</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="admin/products" passHref>
                            <Button size="small" color="primary">
                              view products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">{summary.usersCount}</Typography>
                          <Typography>users</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="admin/users" passHref>
                            <Button size="small" color="primary">
                              view users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem></ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
