import React, { useState, useEffect, createContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from "./Cards2.css"
import { toast } from "react-toastify";
import { json } from "body-parser";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

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
  removeUserName,
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
  const [TypedAnyWord, setTypedAnyWord] = useState(false);
  const [error, setError] = useState(false);
  function getData(val) {
    if(val.target.value === '') {
      setTypedAnyWord(false);
      return
    }
    if(val.target.value !== (val.target.value).toUpperCase()){
      changeSetButtonDisable(true);
      setValidName(false)
      setError(true)
      return
    }
    setValidName(true);
    setLoading(true);
    setTypedAnyWord(true)

    userUsername(val.target.value);
    for (let i = 0; i < customerName.length; i++) {

      if(val.target.value === "") {
        setLoading(false)
        changeSetButtonDisable(true);
      }
      else if (val.target.value === customerName[i].Username) {
        changeSetButtonDisable(true);
        setLoading(false);
        setError(true)
        // toast('Name Not Available',{
        //   className: 'toast'
        // });
        break;
      }
      else {
        changeSetButtonDisable(false);
        setError(false)
        setInterval(() => {
          setLoading(false);
        }, 3000);
      }
    }  
  }

  return (
    <form className={classes.root} style={{display: 'flex'}} >
      {/* <input
        id="outlined-basic"
        label="Username"
        fullWidth ={true}
        variant="outlined"
        required= {true}
        onChange={(e)=> {
          let letters = /^[a-zA-Z0-9_.-]*$/;
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
         </input> */}
        <OutlinedInput
          style={{
            background: '#FDF5FB'
          }}
          fullWidth
          placeholder={`USERNAME  ${inputIndex}`}
          onChange={(e) => {
            let letters = /^[a-zA-Z0-9_.-]*$/;
            if (e.target.value.match(letters)) {
              changeSetButtonDisable(false)
              getData(e)
            } else {
              changeSetButtonDisable(true)
              setValidName(false)
            }
          }}
          endAdornment={
            <InputAdornment position="end">
              {loading ? <CircularProgress thickness={4} color="secondary" size={20} /> : null}
              {TypedAnyWord && !loading ?
                (!error ? <CheckCircleOutlineIcon color="success" /> : <CancelIcon color="error" />) : ''
              }              
            </InputAdornment>
          }
        />
                
        {showMinusIcnon && <span onClick={()=>{
          let newUsers = numberOfUsers.filter((user, index) => index !== numberOfUsers.length - 1)
          removeUserName(newUsers.length, '')
          setNumberOfUsers(newUsers)
          setErrorMessage(false)
        }}  className="input-remove">-</span>} 
         
    </form>
  );
}
