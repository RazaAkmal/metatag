import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { blue } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";

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
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(true);
  let navigate = useNavigate(); 

  const handleLogin = () => {
    if (userName === "demo" && password === "yayusername") {
      localStorage.setItem('logedIn' , true)
      navigate('/');
    } else {
      setValid(false)
    }
  }


  return (
    <Card
      className={classes.root}
      variant="outlined"
    >

      <div className="whiteWrapper " style={{ marginTop: '0px' }}>
          <div>
          <input
          type='text'
        id="outlined-basic"
        label="Username"
        variant="outlined"
        required= {true}
        onChange={(e)=> setUserName(e.target.value)}
        style={{padding: '10px', width: '90%', backgroundColor: 'white', border:'none',margin:'10px 12px', height:'35px'}}
        color={"secondary"}
        placeholder={`USERNAME`}
        value={userName}
      />
          <input
          type='password'
        id="outlined-basic"
        label="Password"
        variant="outlined"
        required= {true}
        onChange={(e)=> {setPassword(e.target.value)}}
        style={{padding: '10px', width: '90%', backgroundColor: 'white', border:'none',margin:'10px 12px', height:'35px'}}
        color={"secondary"}
        placeholder={`PASSWORD`}
        value={password}
      />

            {valid ? null : <div style={{ color: 'black', marginTop: '0' }}>Please Enter Valid Credentials</div>}

          <div className="register-outer">
            <Button
              variant="contained"
              color="primary"
              className="register"
              disabled={props.buttonDisable}
              onClick={handleLogin}
            >
              Register
            </Button>
          </div>
          </div> 
      </div>
    </Card>
  );
}
