import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./Button.css";
import "./Button.css";
import { Stepper } from "./stepper";
import { Loader } from "./loader";


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function SimpleBackdrop(props) {
  console.log(props)
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(props.openBackdrop);
  };
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className="gradient"
        disabled={props.buttonDisable}
        onClick={() => {
          handleToggle();
          props.sig();
        }}
      >
        Register
      </Button>
   

      <Backdrop className={classes.backdrop} open={props.openBackdrop}>
        <div className="backdropModal">
          <div className="text-left" style={{color: 'black'}}>
           <p style={{marginTop: '0',textAlign:'left'}}>Your transaction is in Progress.Please Wait...</p>

          </div>
        {/* <CircularProgress style={{color: 'black'}} /> */}
        <Stepper  number={props.number} status={props.status}/>
        </div>
      </Backdrop>
    </div>
  );
}
