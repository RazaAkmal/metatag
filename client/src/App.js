import React, { useState, useEffect, createContext } from "react";
import contractAbi from "./contracts/contractAbi.json";
import getWeb3 from "./getWeb3";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Navbar from "./components/AppBar";
import Cards1 from ".//components/Cards1";
import Cards2 from "./components/Cards2";
import Button from "@material-ui/core/Button";

import axios from 'axios'
import styles from "./App.css";
import SimpleAlerts from "./components/alert"
import { Stepper } from "./components/stepper";
import { toast } from 'react-toastify';
import { Loader } from "./components/loader";
import Alert from '@material-ui/lab/Alert';
// import LogoImg from './components/miniLogo.jpg';
import LogoImg from '../src/images/logo.svg';

// PROD
//const mintingUrl = 'https://prod-24.uksouth.logic.azure.com:443/workflows/07935d4dbdf1456eaa9893c475dbf501/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=apaV_wgJOF0N45ENhR6b-1yJ-yVUeax7j1dR4OfK450'
//DEV LOGIC APP
const regUrl = ''
const regStatus = '/api/v1/fetch-regstatus'
const mintingFee = 10000000000000000
const fetchPinStatus = '/api/v1/fetch-pinstatus'
const fetchMintStatus = '/api/v1/fetch-mintstatus'
const mintSomething = '/api/v1/mint-something'
const App = () => {
  const [web3, setWeb3] = useState();
  const [userAccount, setUserAccount] = useState(undefined);
  const [initalPercent, setPercent] = useState(0);
  
  const [initialStatus, setStatus] = useState('wait');

  const [contract, setContract] = useState();
  const [buttonTextState, setButtonTextState] = useState();
  const [apiResponse, setApiResponse] = useState();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [alertState, setAlertState] = useState(false);
  const [msg,setmessage] = useState('')
  const [status,setalertStatus] = useState('')

  useEffect(() => {
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
        setUserAccount(beautyAddress);
      }

      // Get the contract instance.
      const instance = new web3.eth.Contract(
        contractAbi,
        "0xbbf14c0D2bDa317097a7B6f919cEAFD057F4CE15"
      );
      setContract(instance);
      setWeb3(web3);
      if (defaultAccount) {
        setButtonTextState("Connected");
      } else {
        setButtonTextState(" Connect Wallet");
      }
     
    };
    init();
  }, []);

  window.ethereum.on('accountsChanged', function (accounts) {
    if (accounts[0]) {
      const part1 = accounts[0].slice(0, 6);
      const part2 = accounts[0].slice(38, 44);
      const mybeautyAddress = ` ${part1}...${part2}`;

      setUserAccount(mybeautyAddress);
      setButtonTextState("Connected");
    }
    // Time to reload your interface with accounts[0]!
  });
  // Open metamask on click

  const initWeb3 = async () => {

    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const bestAccount = accounts[0];
    if (bestAccount) {
      const part1 = bestAccount.slice(0, 6);
      const part2 = bestAccount.slice(38, 44);
      const mybeautyAddress = ` ${part1}...${part2}`;

      setUserAccount(mybeautyAddress);
      setButtonTextState("Connected");
    }
  };

  //Helper Functions
  const toWei = (amount) => {
    return web3.utils.toWei(amount, "Ether");
  };

  const fromWei = (amount) => {
    return web3.utils.fromWei(amount, "Ether");
  };

  // Main Functions

  const signUp = async () => {

    setPercent(0)
    setStatus('wait')
    setOpenBackdrop(true);
    const userAddresses = await web3.eth.getAccounts();
    const userAdd = userAddresses[0];
     let json = JSON.stringify({
      Walletaddress: userAdd,
      Username: userInput.toString()
    })

    await contract.methods.signup(userInput.toString()).send({ from: userAdd, value: mintingFee} , function (err , res) {
      if(res){
            setPercent(0)
            setStatus('process')
              const runInterval = setInterval(async () => {
              web3.eth
              .getTransactionReceipt(res && res)
              .then((txReceipt) => {
                 if(txReceipt == null){

                }
               else if (txReceipt && txReceipt.status === true) {
                  clearInterval(runInterval);
                  toast('Transaction Confirmed',{
                    className: 'toast'
                  });
                   
                  let jsonwHash = JSON.stringify({
                    Walletaddress: userAdd,
                    Username: userInput.toString(),
                    Minttransactionhash: txReceipt.transactionHash
                  })
                  setPercent(0)
                  setStatus('process')
                  axios.post(regUrl,jsonwHash,{
                    headers: {
                      'Content-Type': 'application/json'
                      }
                  }).then(async res => {

                    const request = await fetch(`${regStatus}?Walletaddress=${userAdd}`)
                    const data = await request.json()
                     const result = JSON.parse(data)
                     if(result.ethereum == 0 && result.moon == 0 && result.bsc == 0 ){
                      setPercent(0)
                      setStatus('error')
                      toast('something went wrong during registration',{
                        className: 'toast'
                      });
                      setTimeout(() => {
                        setOpenBackdrop(false);
                      }, 5000);
                      return
                    }
                    setPercent(1)
                    setStatus('process')
                    const pinStatus = await fetch(`${fetchPinStatus}?Walletaddress=${userAdd}`)
                    const statusData = await pinStatus.json()
                     
                    
                    let mintBody = JSON.stringify({
                      Walletaddress: userAdd,
                      Uri: statusData
                    })
                     setPercent(2)
                    setStatus('process')
                    axios.post(mintSomething,mintBody,{
                      headers: {
                        'Content-Type': 'application/json'
                        }
                    }).then(async res => {
                       const mintStatus = await fetch(`${fetchMintStatus}?Walletaddress=${userAdd}`)
                      const statusData = await mintStatus.json()
                       const obj = JSON.parse(statusData)
                       setPercent(2)
                        setStatus('finish')
        
                         toast('Successfully Minted',{
                          className: 'toast'
                        });
                        setalertStatus('success')
                        setmessage(`Successfully Minted. Ethereum : ${obj.ethereum},   Bsc ${obj.bsc} , Moon ${obj.moon}` )
                        setAlertState(true)
                        setTimeout(() => {
                          setOpenBackdrop(false);
                        }, 5000);
                    })
                    .catch(err=> {
                      setPercent(2)

                      setStatus('error')
                      toast('Error During Minting',{
                        className: 'toast'
                      });
                      setalertStatus('error')
                      setmessage(`Error During Minting Please Contact us on Discord` )
                      setTimeout(() => {
                        setOpenBackdrop(false);
                      }, 5000);
                    })
                  }).catch(err => {
                     setPercent(0)
                    setStatus('error')
                    toast(`something went wrong during registration`,{
                      className: 'toast'
                    });
                    	 setalertStatus('error')
                      setmessage('something went wrong during registration')                      
                      setAlertState(true) 
                    setTimeout(() => {
                      setOpenBackdrop(false);
                    }, 5000);
                  })

                } else if (txReceipt && txReceipt.status === false) {
                  clearInterval(runInterval);
                  setPercent(0)
                  setStatus('error')
                  //Error control here 
                }
              });
          }, 5000);
      }
      if(err){
        setPercent(0)
        setStatus('error')
        setOpenBackdrop(false);
        toast(err.message,{
          className: 'toast'
        });
      }
    })

  };

  return (
    <div className="bgCover">
      <Grid container justify="center">
        {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Navbar connect={initWeb3} buttonText={buttonTextState} />
        </Grid> */}
        
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          {" "}
          <Typography variant="h2" style={{ color: "#f9317a" }}>
            
          </Typography>
          <img style={{width: '200px'}} src={LogoImg}/>
          <Button
          style={{position: 'absolute', right: '30px'}}
            color="inherit"
            onClick={initWeb3}
            variant="contained"
            className="appBarGradient"
          >
            {buttonTextState}
          </Button>

        </Grid>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          style={{ textAlign: "center", marginTop: "50px" }}
          spacing={9}
        >

          <Typography
            variant="h3"
            style={{ color: "#ffff", marginBottom: "100px", fontSize:'20px' }}
            className="h3padding"
          >
           Current Mint Price <span className="textCOlor">0.1</span> <span className="textCOlor2">ETH</span>  <span className="textCOlor">/</span> <span className="textCOlor">$450</span><span className="textCOlor2">USD</span>
          </Typography>
        </Grid>
        <Grid item lg={3}
            justifyContent="center"
            alignItems="center" 
            style={{ textAlign: "center" }}>
            <Cards1
              addressOfUser={userAccount}
              userSignUp={signUp}
              res={apiResponse}
              status={initialStatus}
              number={initalPercent}
              openBackdrop={openBackdrop}
              myUsername={(userInput) => setUserInput(userInput)}
            />
          </Grid>
        <Grid item  container xs={12} justify="space-evenly">

          <Grid item  xs= {8} sm={8} md={8} lg={8} xl= {8} style={{ textAlign: "center", marginTop: "50px" }}>
          {alertState ? <SimpleAlerts status={status} msg={msg}/> : null   } 
          </Grid>

        </Grid>
      </Grid>
    </div>
  );
};

export default App;
