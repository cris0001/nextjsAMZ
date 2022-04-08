import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import useStyles from "../utils/styles";
import { useRouter } from "next/router";
import { useAppContext } from "../utils/Context";
import Cookies from "js-cookie";
import { data } from "../utils/sidebarData";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";

const Layout = ({ children, title }: any) => {
  const { darkMode, changeTheme, cart, userInfo, setUserInfo, setCart } = useAppContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidbarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const handleOpenSidebar = () => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",

      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();

  const handleLoginClick = (e: any): void => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = (e: any, redirect: string): void => {
    setAnchorEl(null);
    if (redirect !== "backdropClick") {
      router.push(redirect);
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setUserInfo(null);
    setCart({ cartItems: [] });
    Cookies.remove("userInfo");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title}-next amazon` : `next amazon`}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <Box display="flex" alignItems="center">
              <IconButton edge="start" aria-label="open drawer" onClick={handleOpenSidebar}>
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>amz</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer anchor="left" open={sidbarVisible} onClose={handleCloseSidebar}>
              <List>
                <ListItem>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography>Shopping by category</Typography>
                    <IconButton aria-label="close" onClick={handleCloseSidebar}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {data.map((item, index) => {
                  return (
                    <div key={index}>
                      <NextLink href={`/${item.category}`} passHref>
                        <ListItem button component="a" onClick={handleCloseSidebar}>
                          <ListItemText primary={item.category} />
                        </ListItem>
                      </NextLink>

                      <div style={{ marginLeft: "40px" }}>
                        <NextLink href={`/${item.category}/pants`} passHref>
                          <ListItem button component="a" onClick={handleCloseSidebar}>
                            <ListItemText primary={"pants"} />
                          </ListItem>
                        </NextLink>
                        <NextLink href={`/${item.category}/shirts`} passHref>
                          <ListItem button component="a" onClick={handleCloseSidebar}>
                            <ListItemText primary={"shirts"} />
                          </ListItem>
                        </NextLink>
                        <NextLink href={`/${item.category}/shoes`} passHref>
                          <ListItem button component="a" onClick={handleCloseSidebar}>
                            <ListItemText primary={"shoes"} />
                          </ListItem>
                        </NextLink>
                        <NextLink href={`/${item.category}/sneakers`} passHref>
                          <ListItem button component="a" onClick={handleCloseSidebar}>
                            <ListItemText primary={"sneakers"} />
                          </ListItem>
                        </NextLink>
                        <NextLink href={`/${item.category}/handbags`} passHref>
                          <ListItem button component="a" onClick={handleCloseSidebar}>
                            <ListItemText primary={"handbags"} />
                          </ListItem>
                        </NextLink>
                      </div>
                    </div>
                  );
                })}
              </List>
            </Drawer>
            <div className={classes.grow}></div>
            <div>
              <Switch checked={darkMode} onChange={changeTheme}></Switch>

              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge color="secondary" badgeContent={cart.cartItems.length}>
                        Cart
                      </Badge>
                    ) : (
                      "Cart"
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleLoginClick}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={(e) => handleCloseMenu(e, "/profile")}>Profile</MenuItem>
                    <MenuItem onClick={(e) => handleCloseMenu(e, "/order-history")}>Order History</MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem onClick={(e) => handleCloseMenu(e, "/admin/dashboard")}>Admin dashboard</MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>futer</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
