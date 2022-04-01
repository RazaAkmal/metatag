import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
      color: "black",
    },
  },
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{}}>
      <CircularProgress
        variant="indeterminate"
        style={{ color: "red", backgroundColor: "white", textAlign: "center" }}
      />
    </div>
  );
}
