import React, { useState, useEffect, createContext, useRef } from "react";
import contractAbi from "./contracts/contractAbi.json";
import getWeb3 from "./getWeb3";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Navbar from "./components/AppBar";
import Cards1 from ".//components/Cards1";
import Button from "@material-ui/core/Button";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./App.css";
import SimpleAlerts from "./components/alert"
import { toast } from 'react-toastify';
import LogoImg from '../src/images/logo.svg';
import BNBImg from '../src/images/BNB.svg';
import ETHImg from '../src/images/ETH.svg';
import PolygonImg from '../src/images/Matic.svg';
import MoonImg from '../src/images/Moon.svg';


const chainNames = [
  {name: "Ethereum", img: ETHImg, chainId: '0x1' },
  {name: "BNB", img: BNBImg, chainId: '0x38' },
  {name: "Polygon", img: PolygonImg, chainId: '0x89' },
  {name: "Moon", img: MoonImg, chainId: '0x505' },
];

const mintingFee = 10000000000000000
const Profile = () => {
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
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accounts, setAccounts] = useState()
  const [whitelistedError, setWhitelistedError] = useState()
  const [registryResult, setRegistryResult] = useState([])
  const accountRef = useRef(accounts);

  const [selectedChain, setSelectedChain] = useState("Ethereum");
  const [selectedChainId, setSelectedChainId] = useState();
  const selectedChainRef = useRef(selectedChain);

  const [owned, setOwned] = useState('')
  const [NFTTokenId, setNFTTokenId] = useState([])
  const [tokenData, setTokenData] = useState([])

  const handleChange = async (event) => {
    const {
      target: { value },
    } = event;
    setSelectedChainId(value === "Ethereum" ? '0x1' : '0x38')
    setSelectedChain(value);
    selectedChainRef.current = value
    changeNetwork(value)
  };

  const changeNetwork = async (value) => {
    const result = chainNames.filter(el => el.name === value);
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: result[0].chainId }], // chainId must be in hexadecimal numbers
    }).then(function (result) { 

    }).catch(function (e) {
      setDisableButton(true)
      setWhitelistedError(true)
      setAccountErrorMessage(`Please connect to ${value} Network`);
      setButtonTextState("Connect Wallet");
      toast(`Oops, please connect to ${value} Network`, {
        hideProgressBar: true,
        autoClose: true,
        position: "top-left",
        className: 'toast'
      });
    })

  }
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
      const chainId = await web3.eth.getChainId();
      // if (chainId !== 1) {
      //   changeNetwork("Ethereum")
      // }
      
      setSelectedChainId(chainId)
      setSelectedAccount(userAccounts[0]);
      setButtonTextState("Connecting...");
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        contractAbi,
        "0x38cC05a0b9945203b735dAa9F42CB70a801c6E6d"
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
            setAccountErrorMessage("Sorry Only Whitelisted Users Can Currently Mint");
            setButtonTextState("Connect Wallet");
          }
        }
        // Time to reload your interface with accounts[0]!
      });
      window.ethereum.on('chainChanged', (chainId) => {
        console.log(chainId)
        setSelectedChainId(chainId);
        if ((selectedChainRef.current === "Ethereum" && chainId !== '0x1') || 
        (selectedChainRef.current === "BNB" && chainId !== '0x38') ||
        (selectedChainRef.current === "Polygon" && chainId !== '0x89') ||
        (selectedChainRef.current === "Moon" && chainId !== '0x505')
        ) {
          setDisableButton(true)
          setWhitelistedError(true)
          setAccountErrorMessage(`Please connect to ${selectedChainRef.current} Network`);
          toast(`Oops, please connect to ${selectedChainRef.current} Network`, {
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

    if (contract && selectedAccount) {
      contract.methods.getBalance("0x764f5F118D433FB9F2F434165C70B234AceCDb04").call()
      .then(function(result){
        setOwned(result)
      })
    }
    
  }, [contract, selectedAccount])

  useEffect(() => {
    if (owned > 0) {
      contract.methods.retrieveNftTokenIds("0x764f5F118D433FB9F2F434165C70B234AceCDb04").call()
      .then(function(result){
        setNFTTokenId(result)
      })
    }
  }, [owned])

  useEffect(() => {

    if (NFTTokenId.length > 0) {
      const result = NFTTokenId.map(async (tokenId) => {
        try {
          const response = await fetch(
            `/api/v1/fetch-nft-images?tokenId=${tokenId}`
          );
          const json = await response.json();
          return json
        } catch (error) {
          console.log(error, "error")
        }
        
      })
      Promise.all(result).then((values) => {
        setTokenData(values)
      });
    }
    
  }, [NFTTokenId])
  
  
  

  useEffect(() => {
    setButtonTextState("Connect Wallet");
    if (selectedAccount && accounts && !disableButton) {
      const part1 = selectedAccount.slice(0, 6);
      const part2 = selectedAccount.slice(38, 44);
      const beautyAddress = ` ${part1}...${part2}`;
      if (accountWhitelisted(selectedAccount)) {
        setUserAccount(beautyAddress);
        setButtonTextState("Connected");
        setWhitelistedError(false)
      } else {
        setWhitelistedError(true)
        setButtonTextState("Connect Wallet");
        setAccountErrorMessage("Please Connect To Your Wallet");
      }
    }

  }, [selectedAccount, accounts, disableButton])
  

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

  
  return (
    <div className="bgCover">
    <Grid container justifyContent="center">
      
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
          className="meta-own-heading"
        >
          Metatags Owned - {owned}
        </Typography>
      </Grid>

      <Grid container >
        <Grid container item
          xs={12}
          lg={12}
          justifyContent="center"
          alignItems="center"
          style={{ textAlign: "center" }}>
            {tokenData && tokenData.map(data => {
              let sliceIndex = data.image.indexOf(':')
              let imgPath = `https://metatag.mypinata.cloud/ipfs/${data.image.slice(sliceIndex + 3)}`
              return <div className="img-block"><img src={imgPath} alt="nftImg" /></div>
            })}
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

export default Profile;
