import React, { useState, useEffect, createContext, useRef } from "react";
import contractAbi from "./contracts/contractAbi.json";
import getWeb3 from "./getWeb3";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import "./App.css";
import LogoImg from '../src/images/logo-white.svg';

const Profile = () => {
  const [web3, setWeb3] = useState();
  const [userAccount, setUserAccount] = useState(undefined);


  const [contract, setContract] = useState();
  const [selectedAccount, setSelectedAccount] = useState('')
  const [accounts, setAccounts] = useState()
  const accountRef = useRef(accounts);

  const [owned, setOwned] = useState('')
  const [NFTTokenId, setNFTTokenId] = useState([])
  const [tokenData, setTokenData] = useState([])


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
      const userAccounts = await web3.eth.getAccounts();
      const part1 = userAccounts[0].slice(0, 6);
      const part2 = userAccounts[0].slice(38, 44);
      const beautyAddress = ` ${part1}...${part2}`;
      setSelectedAccount(beautyAddress);
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
          setUserAccount(mybeautyAddress);
        }
        // Time to reload your interface with accounts[0]!
      });
    }
    catch (error) {
      console.log(error)
    }

  }, []);

  useEffect(() => {

    if (contract && selectedAccount) {
      contract.methods.getBalance("0x764f5F118D433FB9F2F434165C70B234AceCDb04").call()
        .then(function (result) {
          setOwned(result)
        })
    }

  }, [contract, selectedAccount])

  useEffect(() => {
    if (owned > 0) {
      contract.methods.retrieveNftTokenIds("0x764f5F118D433FB9F2F434165C70B234AceCDb04").call()
        .then(function (result) {
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
  console.log(selectedAccount, "selectedAccount")
  return (
    <div className="bgCover-profile profile-area">

      <Grid container justifyContent="center" className="my-container">

        <Grid
          item
          xl={4}
          lg={4}
          md={4}
          sm={4}
          xs={12}
        >
          {" "}
          <img style={{ width: '300px' }} src={LogoImg} alt="logo" />
        </Grid>
        <Grid
          item
          xl={8}
          lg={8}
          md={8}
          sm={8}
          xs={12}
          className="user-profile"
        >
          <div className="address">
            <p>Wallet address:</p>
            <p className="address-bar"><span> {selectedAccount} </span></p>
          </div>
          <div className="user-img">
            <span className="active-user"></span>
            <div className="border-area">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"></img>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" className="my-container">

        <Grid
          item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}

        >
          {" "}
          <div className="tag">
            <p>metatag ownd: </p>
            <h5>{owned}</h5>
          </div>
        </Grid>
        <Grid
          item
          xl={8}
          lg={8}
          md={8}
          sm={12}
          xs={12}
        >
          <div className="search-tag">
            <div className="search-filed">
              <input className="" placeholder="Search Your Tag"></input>
              <i className="fa fa-search">icon</i>
            </div>
            <div className="border-area">
              <Button
                color="inherit"
                variant="contained"
                className="appBarGradient connected-btn"
              >
                Add Tag
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
      <div className="my-container">
        <Grid container className=" serachTag-result" spacing={2}>
          {tokenData && tokenData.map(data => {
            let sliceIndex = data.image.indexOf(':')
            let imgPath = `https://metatag.mypinata.cloud/ipfs/${data.image.slice(sliceIndex + 3)}`
            return <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
            >
              {" "}
              <div className="card">
                <img src={imgPath} alt="tag-img" />
                <div className="card-contant">
                  <p>{data.name}</p>
                </div>
              </div>
            </Grid>
          })}
        </Grid>
      </div>
    </div>
  );
};

export default Profile;
