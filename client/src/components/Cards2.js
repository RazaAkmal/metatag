import React,{ useState }  from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import BasicTextFields from "./InputFeild";
// import Button from "@material-ui/core/Button";
import Button from "./Button"
import styles from "./Cards1.css";
import { blue } from "@material-ui/core/colors";
import DisabledOptions from "./autococmpleteCards2";
import ComboBox from "./autocomplete";

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
  const classes = useStyles();
  const signup = props.userSignUp;
  const [buttonDisable, setButtonDisable] = useState(true);

  return (
    <Card
      className={classes.root}
      variant="outlined"
      style={{
        backgroundColor: "#ffffff",
        paddingBottom: "40px",
        paddingTop: "10px",
        borderRadius: "15px",
      }}
    >


      <Typography
        variant="h4"
        style={{ paddingBottom: "20px", paddingTop: "10px" }}
        className="cardsGradient"
      >
        Custom1
      </Typography>
      <Typography
        variant="subtitle1"
        color="primary"
        className="addressBackgroundColor"
        style={{ padding: "5px", marginBottom: "35px" }}
      >
        {props.addressOfUser ? props.addressOfUser : "Not Connected"}
      </Typography>
      {/* <Typography style={{ marginLeft: "7px" }}>
        <ComboBox
          ress={props.res}
          customerName={props.customerName}
          changeSetButtonDisable={(buttonDisable) =>
            setButtonDisable(buttonDisable)
          }
          userUsername={(usname) => props.myUsername(usname)}
        />
      </Typography> */}
      <Typography style={{ marginLeft: "7px", marginBottom: "35px" }}>
        <DisabledOptions buttonState={state => {
          setButtonDisable(state)
        }}></DisabledOptions>
      </Typography>
      
      <Button
        onClick={props.userSignUp}
        sig={signup}
        status={props.status}
        number={props.number}
        openBackdrop={props.openBackdrop}
        buttonDisable={buttonDisable}
      ></Button>
      {/* <Button
        variant="contained"
        color="primary"
        className="gradient"
        style={{ marginBottom: "px" }}
      >
        {" "}
        Register
      </Button> */}

    </Card>
  );
}
