import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import BasicTextFields from "./autocomplete";
import Button from "./Button";
import "./Cards1.css";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: "50px",
    background: "linear-gradient(270deg, #5A5A94 0%, #FB406C 100%)",
    // background: "linear-gradient(90deg, #D926AE -5.32%, #FF4361 53.28%, #FF7362 109.48%)",
    borderRadius: "0px",
    // opacity: "0.4",
    position: "relative",
    boxShadow: "2.4px -1.78553e-14px 37.2px rgba(77, 150, 238, 0.5145), inset -26.68px 9.8006e-15px 130.68px #243345, inset 26.68px -9.8006e-15px 98.68px #A4CDFF"
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
  input: {
    marginBottom: 1522,
  },
  bacgroundColor: blue,
});

let debounce

export default function OutlinedCard(props) {
  const classes = useStyles();
  const signup = props.userSignUp;
  const [buttonDisable, setButtonDisable] = useState(true);
  const [valid, setValid] = useState(true);

  const debounceFunc =  (name) => {
    return new Promise((resolve, reject) => {
      debounce = setTimeout(async () => {
        const response = await fetch(
          `/api/v1/fetch-filtered-username?name=${name}`
        );
        const json = await response.json();
        resolve(json === "False");
      }, 3000)
    });
 }


  const reloadFilter = (name) => {
    if (debounce) {
        clearTimeout(debounce)
        debounce = null
    }
    return new Promise((resolve, reject) => {
      debounceFunc(name).then((res) => {
        resolve(res)
      });
    });
}

  return (
    <Card
      className={classes.root}
      variant="outlined"
    >

      <div className="whiteWrapper " style={{ marginTop: '0px' }}>
        <div className="number-user">
          <p>Number of usernames:</p>
          <div className="account">
            <button className="btn btn-count">-</button>
            <p className="total-count">2</p>
            <button className="btn btn-count">+</button>
          </div>
        </div>
        {!props.whitelistedError ?
          <div>
            {props.numberOfUsers.map((user, index) => (
              <BasicTextFields
                showMinusIcnon={index !== 0 && index === props.numberOfUsers.length - 1}
                setNumberOfUsers={props.setNumberOfUsers}
                numberOfUsers={props.numberOfUsers}
                inputIndex={index + 1}
                setErrorMessage={props.setErrorMessage}
                changeSetButtonDisable={(buttonDisable) =>
                  setButtonDisable(buttonDisable)
                }
                reloadFilter={reloadFilter}
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
            {props.registryResult.length ? props.registryResult.map((result, index) => <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: index === 0 ? '35px' : "5px", padding: "0 10px" }}>
              <a className="card-address" target="_blank" href={`https://testnets.opensea.io/assets/rinkeby/0x4a119210b6109df415eb70024f0d7a8021e39fe4/${result}`}>https://testnets.opensea.io/assets/rinkeby/0x4a119210b6109df415eb70024f0d7a8021e39fe4/{result}</a>
            </div>) : ''}
            
            <div style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px', padding: "0 10px" }}>
              <div className="card-address">Your Eth Address</div>
              <div className="address-box" > {props.addressOfUser}</div>
            </div>
          </div> :
          <Typography
            variant="h3"
            style={{ color: "white", paddingBottom: "20px", paddingTop: "10px" }}
          >
            {props.accountErrorMessage}
          </Typography>
        }

      </div>
    </Card>
  );
}
