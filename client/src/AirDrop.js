import React, { useState, useEffect, createContext, useRef } from "react";
import contractAbi from "./contracts/contractAbi.json";
import getWeb3 from "./getWeb3";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Stepper } from "./components/stepper";
import "./App.css";
import SimpleAlerts from "./components/alert"
import { toast } from 'react-toastify';
import LogoImg from '../src/images/logo.svg';
import TickImg from '../src/images/tick.svg';
import coloredTIck from '../src/images/coloredTIck.svg';
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const mintingFee = 100000000000000000
const AirDrop = () => {

  const classes = useStyles();
  const [web3, setWeb3] = useState();
  const [userAccount, setUserAccount] = useState(undefined);
  const [initalPercent, setPercent] = useState(0);

  const [initialStatus, setStatus] = useState('wait');
  const [testSuccess, setTestSuccess] = useState(false)
  const [contract, setContract] = useState();
  const [buttonTextState, setButtonTextState] = useState();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [firstUserInput, setFirstUserInput] = useState("testingAPI!");
  const [errorMessage, setErrorMessage] = useState(false);
  const [alertState, setAlertState] = useState(false);
  const [msg, setmessage] = useState('')
  const [status, setalertStatus] = useState('')
  const [disableButton, setDisableButton] = useState('')
  const [accounts, setAccounts] = useState()
  const [whitelistedError, setWhitelistedError] = useState()
  const accountRef = useRef(accounts);
  useEffect(() => {
    const dataFetch = async () => {
      const response = await fetch(
        "/api/v1/fetch-whitelisted"
      );
      const json = await response.json();
      const result = JSON.parse(json);
      accountRef.current = result
      setAccounts(result);
    };
    dataFetch();
    try {
      window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts[0]) {
          const part1 = accounts[0].slice(0, 6);
          const part2 = accounts[0].slice(38, 44);
          const mybeautyAddress = ` ${part1}...${part2}`;
          if (accountWhitelisted(accounts[0])) {
            setUserAccount(mybeautyAddress);
            setButtonTextState("Connected");
            setWhitelistedError(false)
          } else {
            setWhitelistedError(true)
            setButtonTextState("Connect Wallet");
          }
        }
        // Time to reload your interface with accounts[0]!
      });
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== '0x4') {
          setDisableButton(true)
          toast("Oops, please connect to Rinkeby Network", {
            hideProgressBar: true,
            autoClose: false,
            position: "top-left",
            className: 'toast'
          });
        } else {
          setDisableButton(false)
        }
      });
    }
    catch (error) {
      console.log(error)
    }

  }, []);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const userAccounts = await web3.eth.getAccounts();
      const defaultAccount = userAccounts[0];
      if (defaultAccount) {
        const part1 = defaultAccount.slice(0, 6);
        const part2 = defaultAccount.slice(38, 44);
        const beautyAddress = ` ${part1}...${part2}`;
        setTimeout(() => {
          if (accountWhitelisted(defaultAccount)) {
            setUserAccount(beautyAddress);
            setButtonTextState("Connected");
            setWhitelistedError(false)
          } else {
            setWhitelistedError(true)
            setButtonTextState(" Connect Wallet");
          }
        }, 2000);
          
      }
      setButtonTextState("Connect Wallet");
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        contractAbi,
        "0x1De85704E96cEF99358A3558395fAa1d339D9883"
      );
      console.log(instance, "Instance")
      setContract(instance);
      setWeb3(web3);
    };
    init();
  }, [accounts])
  

  const accountWhitelisted = (address) => {
    return accountRef.current ? accountRef.current.some((el) => el.Walletaddress.toUpperCase() === address.toUpperCase()) : ''
  }

  // Open metamask on click

  const initWeb3 = async () => {

    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const bestAccount = accounts[0];
    if (bestAccount) {
      const part1 = bestAccount.slice(0, 6);
      const part2 = bestAccount.slice(38, 44);
      const mybeautyAddress = ` ${part1}...${part2}`;
      if (accountWhitelisted(bestAccount)) {
        setUserAccount(mybeautyAddress);
        setButtonTextState("Connected");
        setWhitelistedError(false)
      } else {
        setWhitelistedError(true)
      }
    }
  };

  const errInRequest = (err) => {
    setPercent(0)
    setStatus('error')
    setOpenBackdrop(false);
    toast(err.message, {
      className: 'toast'
    });
  };
  const successResponse = (res) => {
    setPercent(0)
    setStatus('process')
    const runInterval = setInterval(async () => {
      web3.eth
        .getTransactionReceipt(res && res)
        .then((txReceipt) => {
          if (txReceipt == null) {

          }
          else if (txReceipt && txReceipt.status === true) {
            clearInterval(runInterval);
            toast('Transaction Confirmed', {
              className: 'toast'
            });

            setPercent(0)
            setStatus('process')
            setTimeout(() => {
              setPercent(1)
            }, 100);
            setTimeout(() => {
              setPercent(2)
              setStatus('finish')
              setTestSuccess(true)
            }, 200);

            setTimeout(() => {
              setOpenBackdrop(false)
            }, 2000);

          } else if (txReceipt && txReceipt.status === false) {
            clearInterval(runInterval);
            setPercent(0)
            setStatus('error')
          }
        });
    }, 5000);
  };

  // Main Functions

  const signUp = async () => {
    console.log('Signup')
    const userAddresses = await web3.eth.getAccounts();
    const userAdd = userAddresses[0];
    let json = JSON.stringify({
      Walletaddress: userAdd,
      Username: firstUserInput.toString()
    })
      if (firstUserInput) {
        setPercent(0)
        setStatus('wait')
        setOpenBackdrop(true);
        await contract.methods.signup(firstUserInput.toString()).send({ from: userAdd, value: mintingFee }, function (err, res) {
          if (res) {
            successResponse(res)
          }
          if (err) {
            errInRequest(err)
          }
        })
      } else {
        setErrorMessage("Please enter username to get registered")
      }
  };

  return (
    <div className="bgCover">
      <Grid container justify="center">
        {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Navbar connect={initWeb3} buttonText={buttonTextState} />
        </Grid> */}
        <Grid
          direction="row"
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
          direction="row"
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

          <div className={disableButton ? "" : "border-area"}>
            <Button
              disabled={disableButton}
              color="inherit"
              onClick={initWeb3}
              variant="contained"
              className={disableButton ? "connected-btn" : "appBarGradient connected-btn"}
            >
              {buttonTextState}
            </Button>
          </div>
        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={8}
          sm={12}
          xs={12}
          style={{ textAlign: "center", marginTop: "40px" }}
          spacing={9}
        >

          <Typography
            variant="h3"
            className="main-heading"
          >
            {!testSuccess ?  "Claim your airdrop" : "SUCCESSFULLY TRANSFERED"}
          </Typography>
          {!testSuccess ?
            <Typography
              variant="h3"
              className="sub-heading"
            >
              Anyone with an ENS or UNSTOPPABLE DOMAIN can claim their share of MTAG tokens
            </Typography>
            :
            <Grid container item
              xs={12}
              lg={12}
              spacing={3}
              justifyContent="center"
              alignItems="center"
              style={{ textAlign: "center" }}>
              <div className="outer-aread-button">
                <div className="inner-circle">
                  <img className="img" src={TickImg} alt="tickImage" />
                </div>
              </div>
            </Grid>
          }
          <Typography
            variant="h3"
            className="sub-heading"
          >
            {!testSuccess ? <div><span className="">0.1 ETH</span> <span>/</span> <span> $450 USD </span></div> : <span style={{marginTop: '50px'}}>SUCCESSFULLY TRANSFERED - 26384Di49</span> }
          </Typography>
        </Grid>

        <Grid container item
          xs={12}
          lg={12}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          style={{ textAlign: "center" }}>
          <Grid
            item>
            <div className="border-area">
              <Button
                // disabled={disableButton}
                color="inherit"
                onClick={signUp}
                variant="contained"
                className={testSuccess ? "claim-btn claimed" : "appBarGradient claim-btn"}
              >
                {testSuccess ? "CLAIMED" : "Claim Now" }
              </Button>
            </div>
          </Grid>
          <Backdrop className={classes.backdrop} open={openBackdrop}>
            <div className="backdropModal">
              <div className="text-left">
                <p style={{ marginTop: '0', textAlign: 'left' }}>Your transaction is in Progress.</p>

              </div>
              <Stepper stepperType={false} number={initalPercent} status={initialStatus} />
            </div>
          </Backdrop>
        </Grid>
        {!testSuccess &&
          <>
            <Grid item container xs={12} justify="center">
              <Typography
                variant="h3"
                className="sub-heading"
                style={{ marginTop: "50px !important" }}
              >
                REQUIREMENTS
              </Typography>
            </Grid>

            <Grid item container xs={6} >
              <div className="requirment"><img src={coloredTIck} alt="coloredTIck" /><span style={{ marginLeft: '20px' }}>Must own a MetaTag</span></div>
            </Grid>
            <Grid item container xs={12} >
            </Grid>
            <Grid item container xs={6} >
              <div className="requirment"><img src={coloredTIck} alt="coloredTIck" /><span style={{ marginLeft: '20px' }}>Must have had a ENS or UNSTOPPABLE DOMAIN within the past year</span></div>
            </Grid>
          </>
        }
      </Grid>
    </div>
  );
};

export default AirDrop;
