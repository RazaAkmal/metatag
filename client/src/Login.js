import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "./App.css";
import LogoImg from '../src/images/logo.svg';
import LoginCard from './components/LoginCard'

const Login = () => {

 
  return (
    <div className="bgCover">
      <Grid container justifyContent="center">
        {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Navbar connect={initWeb3} buttonText={buttonTextState} />
        </Grid> */}
        <Grid
          item
          xl={4}
          lg={4}
          md={12}
          sm={12}
          xs={12}
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          {" "}
        </Grid>
        <Grid
          item
          xl={4}
          lg={4}
          md={12}
          sm={12}
          xs={12}
          style={{ textAlign: "center", marginTop: "30px" }}
        >
          {" "}
          <img style={{ width: '300px' }} src={LogoImg} alt="logo" />
        </Grid>
        <Grid
          item
          xl={4}
          lg={4}
          md={12}
          sm={12}
          xs={12}
          className="connact-btn"
        >
          {" "}

        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={8}
          sm={12}
          xs={12}
          style={{ textAlign: "center", marginTop: "40px" }}
        >

          <Typography
            variant="h3"
            className="main-heading"
          >
            Login to Gamertag
          </Typography>
        </Grid>

        <Grid container >
          <Grid container item
            xs={12}
            lg={12}
            justifyContent="center"
            alignItems="center"
            style={{ textAlign: "center", marginTop: "5%" }}>
            <Grid
              item
              lg={5}>
              <div className="card-outer">
                <LoginCard
                  className="user-card"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
