import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import BasicTextFields from "./autocomplete";
import Button from "./Button";
import styles from "./Cards1.css";
import { blue } from "@material-ui/core/colors";
import { Stepper } from "./stepper";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: "50px",
    background: "linear-gradient(90deg, #D926AE -5.32%, #FF4361 53.28%, #FF7362 109.48%)",
    borderRadius: "0px",
    position: "relative",
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
  const classes = useStyles();
  const signup = props.userSignUp;
  const [buttonDisable, setButtonDisable] = useState(true);
  const [valid, setValid] = useState(true);
  const [customerName, setCustomerName] = useState();

  useEffect(() => {
    const dataFetch = async () => {
      const response = await fetch(
        "/api/v1/fetch-usernames"
      );
      const json = await response.json();
      const result = JSON.parse(json);
      setCustomerName(result, "result ehre");
    };
    dataFetch();
  }, []);
  return (
    <Card
      className={classes.root}
      variant="outlined"
    >

      <div className="whiteWrapper " style={{ marginTop: '0px' }}>
        {!props.whitelistedError ?
          <div>
            {props.numberOfUsers.map((user, index) => (
              <BasicTextFields
                showMinusIcnon={index !== 0 && index === props.numberOfUsers.length - 1}
                setNumberOfUsers={props.setNumberOfUsers}
                numberOfUsers={props.numberOfUsers}
                customerName={customerName}
                inputIndex={index + 1}
                setErrorMessage={props.setErrorMessage}
                changeSetButtonDisable={(buttonDisable) =>
                  setButtonDisable(buttonDisable)
                }
                removeUserName={props.myUserName}
                setValidName={(value) =>
                  setValid(value)
                }
                userUsername={(usname) => {
                  props.myUserName(index, usname)
                }}
              />
            ))}

            {valid ? null : <div style={{ color: 'black', marginTop: '0' }}>Only Uppercase and Numaric Alphabets Allowed</div>}
            {props.errorMessage ? <div style={{ color: 'black', marginTop: '0' }}>{props.errorMessage}</div> : null}

            <Button
              onClick={props.userSignUp}
              sig={signup}
              status={props.status}
              className="bbtn"
              style={{ borderRadius: '0 !important', width: '100%' }}
              number={props.number}
              openBackdrop={props.openBackdrop}
              numberOfUsers={props.numberOfUsers}
              setNumberOfUsers={props.setNumberOfUsers}
              buttonDisable={buttonDisable}
            ></Button>

            {/* <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '35px', padding: "0 10px" }}>
              <div className="card-address">Registered User will be here</div>
            </div> */}
            <div style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px', padding: "0 10px" }}>
              <div className="card-address">Your Eth Address</div>
              <div className="address-box" > {props.addressOfUser}</div>
            </div>
          </div> :
          <Typography
            variant="h3"
            style={{ color: "white", paddingBottom: "20px", paddingTop: "10px" }}
          >
            Sorry Only Whitelisted Users Can Currently Mint
          </Typography>
        }

      </div>
    </Card>
  );
}
