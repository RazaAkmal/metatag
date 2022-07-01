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


const mintingFee = 1000000000000000
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
  const [userNameArray, setuserNameArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [accountErrorMessage, setAccountErrorMessage] = useState('');
  const [alertState, setAlertState] = useState(false);
  const [msg, setmessage] = useState('')
  const [status, setalertStatus] = useState('')
  const [disableButton, setDisableButton] = useState('')
  const [accounts, setAccounts] = useState()
  const [whitelistedError, setWhitelistedError] = useState()
  const [registryResult, setRegistryResult] = useState([])
  const accountRef = useRef(accounts);
  useEffect(() => {
    // Get network provider and web3 instance.
    const init = async () => {
      const web3 = await getWeb3();
      const dataFetch = async () => {
        const response = await fetch(
          "/api/v1/fetch-whitelisted"
        );
        const json = await response.json();
        const result = JSON.parse(json);
        accountRef.current = result
        setAccounts(result);  
      };
      await dataFetch();
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
          setAccountErrorMessage("Sorry Only Whitelisted Users Can Currently Mint");
          setButtonTextState("Connect Wallet");
        }
      } else {
        setWhitelistedError(true)
        setAccountErrorMessage("Please Connect To Your Wallet");
        setButtonTextState("Connect Wallet");
      }
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        contractAbi,
        "0x4A119210B6109Df415eB70024F0D7A8021e39fe4"
      );
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


  const POLL_INTERVAL = 5000;
  const MAX_ATTEMPTS = 36;

  const pollRegistryAPI = ({ fn, interval, maxAttempts }) => {
    console.log('Start poll...');
    let attempts = 0;
  
    const executePoll = async (resolve, reject) => {
      console.log('- poll');
      const result = await fn();
      attempts++;
       result.includes(4); 
      if (!result.includes(0)) {
        return resolve(result);
      } else if (maxAttempts && attempts === maxAttempts) {
        let count = 0
        let Mintcount = 0
        result.forEach(element => {
          if (element === 0) {
            count += 1;
          } else {
            Mintcount += 1;
          }
        });
        if (result.length === count) {
          return reject(new Error('Error occured, contact admins on discord'));
        } else {
          return reject(new Error(`${Mintcount} was minted`));
        }

      } else {
        setTimeout(executePoll, interval, resolve, reject);
      }
    };
  
    return new Promise(executePoll);
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
            setPercent(0)
            setStatus('process')
            setTimeout(() => {
              setPercent(1)
              setTimeout(() => {
                const pollForRegistry = pollRegistryAPI({
                  fn: registery,
                  interval: POLL_INTERVAL,
                  maxAttempts: MAX_ATTEMPTS,
                })
                  .then(user => {
                    setPercent(2)
                    setTimeout(() => {
                      setStatus('finish')
                      setOpenBackdrop(false)
                      setRegistryResult(user)
                      toast('Transaction Confirmed', {
                        className: 'toast'
                      });
                    }, 2000);
                  })
                  .catch(err => {
                    console.error(err)
                    setPercent(2)
                    setTimeout(() => {
                      setStatus('finish')
                      setOpenBackdrop(false)
                      setRegistryResult([0])
                      toast(err, {
                        className: 'toast'
                      });
                    }, 5000);
                  });
              }, 20000);
            }, 20000);
          } else if (txReceipt && txReceipt.status === false) {
            clearInterval(runInterval);
            setPercent(0)
            setStatus('error')
          }
        });
    }, 5000);
  };
  const setUserName = (index, value) => {
    let arrayname = [...userNameArray]
    arrayname[index] = value
    setuserNameArray(arrayname)
    setErrorMessage(false)
  };
  // Main Functions

  const returnTokenIdFromName = async (name) => {
    const response = await contract.methods.returnTokenIdFromName(name).call(function (err, res) {
      if (res === 0) {
        return 0
      } else {
        return res
      }
    })
    return response
  }

  const registery = async () => {
    let userWithoutUndefined = userNameArray.filter(user => user !== undefined)
    let enteredUser = userWithoutUndefined.filter(user => user !== '')
    let responseResult = []
    const promises = enteredUser.map(async (user, index) => {
      const result = await returnTokenIdFromName(user)
      responseResult.push(Number(result))
      return result
    })
  
    const allResult = await Promise.all(promises)  
    console.log('End')
    return responseResult
  }

  const signUp = async () => {
    const userAddresses = await web3.eth.getAccounts();
    const userAdd = userAddresses[0];

    let usersLength = numberOfUsers.length
    let userWithoutUndefined = userNameArray.filter(user => user !== undefined)
    let enteredUser = userWithoutUndefined.filter(user => user !== '')

      if (usersLength === enteredUser.length) {
        setPercent(0)
        setStatus('wait')
        setOpenBackdrop(true);
        await contract.methods.registerNames(enteredUser).send({ from: userAdd, value: mintingFee * enteredUser.length }, function (err, res) {
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
            Current Mint Price <span className="">{(0.1 * numberOfUsers.length).toFixed(1)} ETH</span>
          </Typography>
        </Grid>

        <Grid container >
          <Grid container item
            xs={12}
            lg={12}
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
                  registryResult={registryResult}
                  accountErrorMessage={accountErrorMessage}
                />
              </div>
            </Grid>

          </Grid>

        </Grid>

        <Grid item container xs={12} justifyContent="space-evenly">

          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} style={{ textAlign: "center", marginTop: "40px" }}>
            {alertState ? <SimpleAlerts status={status} msg={msg} /> : null}
          </Grid>

        </Grid>
      </Grid>
    </div>
  );
};

export default App;
