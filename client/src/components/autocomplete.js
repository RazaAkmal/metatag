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
  setValidName,
  showMinusIcnon,
  setNumberOfUsers,
  numberOfUsers,
  customerName,
  inputIndex,
  setErrorMessage
},props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  function getData(val) {
    if(val.target.value !== (val.target.value).toUpperCase()){
      changeSetButtonDisable(true);
      setValidName(false)
      return
    }
    setValidName(true);
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
        onChange={(e)=> {
          let letters = /^[A-Za-z]+$/;
          if(e.target.value.match(letters)) {
            changeSetButtonDisable(false)
            getData(e)
          }else {
            changeSetButtonDisable(true)
            setValidName(false)
          }
        }}
        style={{padding: '10px', width: '100%', backgroundColor: 'white', border:'none',margin:'10px 12px', height:'35px'}}
        color={"secondary"}
        placeholder={`USERNAME  ${inputIndex}`}
        InputProps={{
        
          endAdornment: (
            <React.Fragment>
             {loading ?  <CircularProgress color="secondary" size={20}  />   : null}
             
            </React.Fragment>
          ),
        }}
      >
         </input>
        {showMinusIcnon && <span onClick={()=>{
          let newUsers = numberOfUsers.filter((user, index) => index !== numberOfUsers.length - 1)
          setNumberOfUsers(newUsers)
          setErrorMessage(false)
        }}  className="input-remove">-</span>} 
         
    </form>
  );
}
