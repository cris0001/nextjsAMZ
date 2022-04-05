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
} from "@material-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import useStyles from "../utils/styles";
import { useRouter } from "next/router";
import { useAppContext } from "../utils/Context";
import Cookies from "js-cookie";

const Layout = ({ children, title }: any) => {
  const { darkMode, changeTheme, cart, userInfo, setUserInfo, setCart } = useAppContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

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
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>amz</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch checked={darkMode} onChange={changeTheme}></Switch>

              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems!.length > 0 ? <Badge badgeContent={cart.cartItems!.length}>Cart</Badge> : "Cart"}
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
