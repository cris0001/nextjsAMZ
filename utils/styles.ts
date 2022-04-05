import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  main: {
    minHeight: "80vh",
  },
  grow: {
    flexGrow: 1,
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    color: "white",
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
  },
});
export default useStyles;
