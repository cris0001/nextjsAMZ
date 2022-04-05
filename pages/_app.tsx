import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
// import { StoreProvider } from "../utils/Store";
import AppContextProvider from "../utils/Context";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles: Element | null = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
