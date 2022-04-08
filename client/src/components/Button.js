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
        className="addmore"
        onClick={() => {
          let length = props.numberOfUsers.length
          let newValue = "secondUserInput"
          if (length > 1) {
            newValue = "thirdUserInput"
          }
          if (length > 2) {
            newValue = "fourthUserInput"
          }
          if (length > 3) {
            newValue = "fifthUserInput"
          }
          if (length > 4) {
            return
          }
          props.setNumberOfUsers(oldArray => [...oldArray, newValue] );
        }}
      >
        + Register another user
      </Button>
      <div className="register-outer">
      <Button
        variant="contained"
        color="primary"
        className="register"
        disabled={props.buttonDisable}
        onClick={() => {
          handleToggle();
          props.sig();
        }}
      >
        Register
      </Button>
      </div>

      <Backdrop className={classes.backdrop} open={props.openBackdrop}>
        <div className="backdropModal">
          <div className="text-left">
           <p style={{marginTop: '0',textAlign:'left'}}>Your transaction is in Progress.</p>

          </div>
        {/* <CircularProgress style={{color: 'black'}} /> */}
        <Stepper  number={props.number} status={props.status}/>
        </div>
      </Backdrop>
    </div>
  );
}
