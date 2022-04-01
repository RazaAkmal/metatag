import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ComboBox from "./autocomplete";
import BasicTextFields from "./InputFeild";
import Button from "./Button";
import styles from "./Cards1.css";
import { blue } from "@material-ui/core/colors";
import { Stepper } from "./stepper";

const useStyles = makeStyles({
  root: {
    minWidth: 275,

    padding: "25px",
  },
  addr: {
    paddingTop: "20px",
    paddingBottom: "15px",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  bacgroundColor: blue,
});

export default function OutlinedCard(props) {
  console.log(props.addressOfUser);
  const classes = useStyles();
  const signup = props.userSignUp;
  const [buttonDisable, setButtonDisable] = useState(true);
  const [valid, setValid] = useState(true);

  return (
    <Card
      className={classes.root}
      variant="outlined"
      className="margin"
      style={{
        backgroundColor: "black",
 
        borderRadius: "0px",
        padding: "30px 20px",

      }}
    >
   
      
      <div className="whiteWrapper " style={{marginTop: '0px'}}>
  
        <ComboBox
          ress={props.res}
          customerName={props.customerName}
          changeSetButtonDisable={(buttonDisable) =>
            setButtonDisable(buttonDisable)
          }
          invalidName={(value) =>
            setValid(value)
          }
          userUsername={(usname) => {
            props.myUsername(usname)
          }}
        />
      {valid  ? null : <div style={{color: 'red', marginTop: '0'}}>Only Uppercase Characters Allowed</div>}
      <Button
        onClick={props.userSignUp}
        sig={signup}
        status={props.status}
        className="bbtn"
        style={{borderRadius:'0 !important', width: '100%'}}
        number={props.number}
        openBackdrop={props.openBackdrop}
        buttonDisable={buttonDisable}
      ></Button>
      
      <div style={{color: 'white', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'20px'}}>
        <div>Your Eth Address</div>
        <div style={{padding: '0 10px', borderRadius:'10px', backgroundColor:'white',color:'black'}}>{props.addressOfUser}</div>

        {/* <Typography
        variant="h4"
        style={{ paddingBottom: "20px", paddingTop: "10px" }}
        className="cardsGradient"
      >
        {props.addressOfUser}
      </Typography> */}
      </div>
      </div>
    </Card>
  );
}
