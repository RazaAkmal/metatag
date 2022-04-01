import React, { useState, useEffect, createContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from "./Cards2.css"
import { toast } from "react-toastify";
import { json } from "body-parser";



const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function BasicTextFields({
  changeSetButtonDisable,
  userUsername,
  invalidName
},props) {
  const classes = useStyles();
  const [customerName, setCustomerName] = useState();
  const [loading, setLoading] = useState(false);
  
  useEffect(async () => {
    const dataFetch = async () => {
      const response = await fetch(
        "/api/v1/fetch-usernames"
      );
      const json = await response.json();
      const result = JSON.parse(json);
      return result;
    };
    const username = await dataFetch();
    setCustomerName(username);
  }, []);

  function getData(val) {
 
    if(val.target.value !== (val.target.value).toUpperCase()){
      changeSetButtonDisable(true);
      invalidName(false)
      return
    }
    invalidName(true);
    setLoading(true);

    userUsername(val.target.value);
    for (let i = 0; i < customerName.length; i++) {

      if(val.target.value === "") {
        setLoading(false)
        changeSetButtonDisable(true);

      }
      else if (val.target.value === customerName[i].Username) {
        changeSetButtonDisable(true);
        setLoading(false);
        toast('Name Not Available',{
          className: 'toast'
        });
        break;
      }
      else {

        changeSetButtonDisable(false);
        setInterval(() => {
          setLoading(false);
        }, 3000);
      }
    }  
  }

  return (
    <form className={classes.root} style={{display: 'flex'}} >
      <input
        id="outlined-basic"
        label="Username"
        fullWidth ={true}
        variant="outlined"
        required= {true}
        onChange={getData}
        style={{padding: '10px', width: '100%', backgroundColor: 'white', border:'none',margin:'10px 12px'}}
        color={"secondary"}
        placeholder="UserName"
        InputProps={{
        
          endAdornment: (
            <React.Fragment>
             {loading ?  <CircularProgress color="secondary" size={20}  />   : null}
             
            </React.Fragment>
          ),
        }}
      >
        
        
       
         </input>
    </form>
  );
}
