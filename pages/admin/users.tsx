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

function AdminUsers() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { userInfo } = useAppContext();
  const router = useRouter();
  const [users, setUsers] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/admin/users",

        {
          headers: {
            authorization: `User ${userInfo?.token}`,
          },
        }
      );
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
    fetchData();
  }, []); //eslint-disable-line

  const handleDeleteUser = async (userId: string) => {
    closeSnackbar();
    if (!window.confirm("are u sure?")) {
      return;
    }
    try {
      setDelLoading(true);
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `User ${userInfo.token}` },
      });
      enqueueSnackbar("user deleted successfully", { variant: "success" });
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
                  Users
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
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>ISADMIN</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users?.map((user: any) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin === true ? "yes" : "no"}</TableCell>
                            <TableCell>
                              <NextLink href={`/admin/user/${user._id}`} passHref>
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>
                              <Button onClick={() => handleDeleteUser(user._id)} size="small" variant="contained">
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

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
