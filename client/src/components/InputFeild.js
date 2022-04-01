import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { blue } from "@material-ui/core/colors";
import styles from "./input.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "90%",
    },
    bgColor: {
      backgroundColor: blue,
    },
    borderNone: {
      border: "0px",
    },
  },
}));

export default function BasicTextFields() {
  const classes = useStyles();

  return (
    <form className={classes.root} style={{display: 'flex !important'}} noValidate autoComplete="off">
      <TextField
        label="Name"
        variant="outlined"
        size="small"
        color="secondary"
      />
    </form>
  );
}
