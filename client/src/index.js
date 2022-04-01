import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import { grey } from "@material-ui/core/colors";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#D3D3D3",
    },
    error: {
      main: "#FFFFFF",
    },
    textPrimary: {
      main: "#f92f7f",
    },

  },

  typography: {
    fontFamily: "Atkinson Hyperlegible",
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
    <ToastContainer position="top-right"
    autoClose={2000}
    limit={1}
    />
  </ThemeProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
