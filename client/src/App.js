import React, { useState, useEffect, createContext, useRef } from "react";
import contractAbi from "./contracts/contractAbi.json";
import getWeb3 from "./getWeb3";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Navbar from "./components/AppBar";
import Cards1 from ".//components/Cards1";
import Button from "@material-ui/core/Button";

import "./App.css";
import SimpleAlerts from "./components/alert"
import { toast } from 'react-toastify';
import LogoImg from '../src/images/logo.svg';


const mintingFee = 10000000000000000
const App = () => {
  const [web3, setWeb3] = useState();
  const [userAccount, setUserAccount] = useState(undefined);
  const [initalPercent, setPercent] = useState(0);

  const [initialStatus, setStatus] = useState('wait');

  const [contract, setContract] = useState();
  const [buttonTextState, setButtonTextState] = useState();
  const [apiResponse, setApiResponse] = useState();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [numberOfUsers, setNumberOfUsers] = useState(['firstUserInput']);
  const [firstUserInput, setFirstUserInput] = useState("");
  const [secondUserInput, setSecondUserInput] = useState("");
  const [thirdUserInput, setThirdUserInput] = useState("");
  const [fourthUserInput, setFourthUserInput] = useState("");
  const [fifthUserInput, setFifthhUserInput] = useState("");
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
    // Get network provider and web3 instance.
    const init = async () => {
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const userAccounts = await web3.eth.getAccounts();
      const defaultAccount = userAccounts[0];
      if (defaultAccount) {
        const part1 = defaultAccount.slice(0, 6);
        const part2 = defaultAccount.slice(38, 44);
        const beautyAddress = ` ${part1}...${part2}`;
        if (accountWhitelisted(defaultAccount)) {
          setUserAccount(beautyAddress);
          setButtonTextState("Connected");
          setWhitelistedError(false)
        } else {
          setWhitelistedError(true)
          setButtonTextState(" Connect Wallet");
        }
      }
      setButtonTextState("Connect Wallet");
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        contractAbi,
        "0xe8935C7dE07cFF6A92bE9420B31758403dDC53C5"
      );
      console.log(instance, "Instance")
      setContract(instance);
      setWeb3(web3);
    };
    init();

    try {
      window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts[0]) {
          const part1 = accounts[0].slice(0, 6);
          const part2 = accounts[0].slice(38, 44);
          const mybeautyAddress = ` ${part1}...${part2}`;
          console.log('here in console', accounts[0], accountWhitelisted(accounts[0]))
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

  const accountWhitelisted = (address) => {
    return accountRef.current ? accountRef.current.some((el) => el.Walletaddress.toUpperCase() === address.toUpperCase()) : ''
  }

  console.log(accounts, "accounts")

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

  //Helper Functions
  const toWei = (amount) => {
    return web3.utils.toWei(amount, "Ether");
  };


  const fromWei = (amount) => {
    return web3.utils.fromWei(amount, "Ether");
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
  const setUserName = (key, value) => {
    if (key === "firstUserInput") {
      setFirstUserInput(value)
    } else if (key === "secondUserInput") {
      setSecondUserInput(value)

    } else if (key === "thirdUserInput") {
      setThirdUserInput(value)

    } else if (key === "fourthUserInput") {
      setFourthUserInput(value)

    } else {
      setFifthhUserInput(value)
    }
  };
  // Main Functions

  const signUp = async () => {
    const userAddresses = await web3.eth.getAccounts();
    const userAdd = userAddresses[0];
    let json = JSON.stringify({
      Walletaddress: userAdd,
      Username: firstUserInput.toString()
    })

    let usersLength = numberOfUsers.length
    if (usersLength === 1) {
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
    }
    if (usersLength === 2) {
      if (firstUserInput && secondUserInput) {
        setPercent(0)
        setStatus('wait')
        setOpenBackdrop(true);
        await contract.methods.signup2(firstUserInput.toString(), secondUserInput.toString()).send({ from: userAdd, value: mintingFee * 2 }, function (err, res) {
          if (res) {
            successResponse(res)
          }
          if (err) {
            errInRequest(err)
          }
        })
      } else {
        setErrorMessage("Please enter username in all fields to get registered")
      }
    }
    if (usersLength === 3) {
      if (firstUserInput && secondUserInput && thirdUserInput) {
        await contract.methods.signup3(firstUserInput.toString(), secondUserInput.toString(), thirdUserInput.toString()).send({ from: userAdd, value: mintingFee * 3 }, function (err, res) {
          if (res) {
            successResponse(res)
          }
          if (err) {
            errInRequest(err)
          }
        })
      } else {
        setErrorMessage("Please enter username in all fields to get registered")
      }
    }
    if (usersLength === 4) {
      if (firstUserInput && secondUserInput && thirdUserInput && fourthUserInput) {
        await contract.methods.signup4(firstUserInput.toString(), secondUserInput.toString(), thirdUserInput.toString(), fourthUserInput.toString()).send({ from: userAdd, value: mintingFee * 4 }, function (err, res) {
          if (res) {
            successResponse(res)
          }
          if (err) {
            errInRequest(err)
          }
        })
      } else {
        setErrorMessage("Please enter username in all fields to get registered")
      }
    }
    if (usersLength === 5) {
      if (firstUserInput && secondUserInput && thirdUserInput && fourthUserInput && fifthUserInput) {
        await contract.methods.signup5(firstUserInput.toString(), secondUserInput.toString(), thirdUserInput.toString(), fourthUserInput.toString(), fifthUserInput.toString()).send({ from: userAdd, value: mintingFee * 5 }, function (err, res) {
          if (res) {
            successResponse(res)
          }
          if (err) {
            errInRequest(err)
          }
        })
      } else {
        setErrorMessage("Please enter username in all fields to get registered")
      }
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
            Register your Gamertag
          </Typography>
          <Typography
            variant="h3"
            className="sub-heading"
          >
            Current Mint Price <span className="">0.1 ETH</span> <span>/</span> <span> $450 USD </span>
          </Typography>
        </Grid>

        <Grid container >
          <Grid container item
            xs={12}
            lg={12}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            style={{ textAlign: "center" }}>
            <Grid
              item
              lg={5}>
              <div className="card-outer">
                <Cards1
                  className="user-card"
                  addressOfUser={userAccount}
                  userSignUp={signUp}
                  status={initialStatus}
                  number={initalPercent}
                  openBackdrop={openBackdrop}
                  numberOfUsers={numberOfUsers}
                  setNumberOfUsers={setNumberOfUsers}
                  myUserName={setUserName}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  whitelistedError={whitelistedError}
                />
              </div>
            </Grid>

          </Grid>

        </Grid>

        <Grid item container xs={12} justify="space-evenly">

          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} style={{ textAlign: "center", marginTop: "40px" }}>
            {alertState ? <SimpleAlerts status={status} msg={msg} /> : null}
          </Grid>

        </Grid>
      </Grid>
    </div>
  );
};

export default App;
