import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@emotion/react";
import { AuthProvider, AuthProviderProps } from "react-oidc-context"
import { WebStorageStateStore } from "oidc-client-ts"

const configuration: AuthProviderProps = {
  client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
  scope: "openid profile email",
  authority: import.meta.env.VITE_AUTH0_DOMAIN,
  metadataUrl: `${import.meta.env.VITE_AUTH0_DOMAIN}/.well-known/openid-configuration`,
  automaticSilentRenew: false,
  filterProtocolClaims: true,
  loadUserInfo: true,
  revokeTokensOnSignout: true,
  post_logout_redirect_uri: import.meta.env.VITE_AUTH0_LOGOUT_URI,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e6e53",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#bbf7d0",
      // light: will be calculated from palette.secondary.main,
      // dark: will be calculated from palette.secondary.main,
      // contrastText: will be calculated to contrast with palette.secondary.main
    },
  },
});

const queryClient = new QueryClient();


root.render(
  <React.StrictMode>
    <AuthProvider {...configuration}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
