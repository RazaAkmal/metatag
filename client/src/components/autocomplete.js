import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
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
  inputIndex,
  setErrorMessage,
  reloadFilter
},props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [TypedAnyWord, setTypedAnyWord] = useState(false);
  const [error, setError] = useState(false);
  async function getData(val) {
    if(val.target.value === '') {
      setTypedAnyWord(false);
      setLoading(false)
      changeSetButtonDisable(true);
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
    const result = await reloadFilter(val.target.value)
    if (!result) {
      changeSetButtonDisable(true);
      setLoading(false);
      setError(true)
    } else {
      changeSetButtonDisable(false);
      setLoading(false);
      setError(false)
    } 
  }

  return (
    <form className={classes.root} style={{display: 'flex'}} >
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
