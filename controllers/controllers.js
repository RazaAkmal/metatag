const axios = require('axios')
const apiKey = '02159266bc384e7b819daf2401d5a878'

const fetchUsernames = (req, res, next) => {
    axios.get("https://api.cname.global/getUserNames/GetAll")
    .then(response => {
      console.log(response.data);
      res.send(JSON.stringify(response.data))
    })
    .catch(error => {
      console.log(error);
    });
};

const fetchMintCount = (req, res, next) => {
  axios.get("https://api.cname.global/mintCount/mintToken?getassetnumber=getassetnumber")
  .then(response => {
    console.log(response.data);
    res.send(JSON.stringify(response.data))
  })
  .catch(error => {
    console.log(error);
  });
};


const fetchRegStatus = (req, res, next) => {
  const walletaddress = req.query.Walletaddress
  console.log('wallet address',walletaddress)
  const buildUri = "https://api.cname.global/checkStatusResult/checkRegStatus?Walletaddress="+walletaddress
  axios.get(buildUri,{
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': apiKey
    }
  })
  .then(response => {
    console.log(response.data);
    res.send(JSON.stringify(response.data))
  })
  .catch(error => {
    console.log(error);
    res.status(400).send(error.response.data)

  });
};

const fetchPinStatus = (req, res, next) => {
  const walletaddress = req.query.Walletaddress
  const buildUri = "https://api.cname.global/checkStatusResult/checkPinStatus?Walletaddress="+walletaddress
  axios.get(buildUri,{
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': apiKey
    }
  })
  .then(response => {
    console.log(response.data);
    res.send(JSON.stringify(response.data))
  })
  .catch(error => {
    console.log(error);
  });
};

const fetchMintStatus = (req, res, next) => {
  const walletaddress = req.query.Walletaddress
  const buildUri = "https://api.cname.global/checkStatusResult/checkMintStatus?Walletaddress="+walletaddress
  axios.get(buildUri,{
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': apiKey
    }
  })
  .then(response => {
    console.log(response.data);
    res.send(JSON.stringify(response.data))
  })
  .catch(error => {
    console.log(error.response.data);
    res.status(500).send(error.response.data)
  });
};

 const registerUsername = (req, res, next) => {
  const walletaddress = req.body.Walletaddress
  const username = req.body.Username
  const minttransactionhash = req.body.Minttransactionhash
  console.log("Registering" + walletaddress)
  console.log("Registering" + username)

  const options = {
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey
    }
  };
  axios.post('https://api.cname.global/registerMaster/manual/paths/invoke',{
  Username: username,
  WalletAddress: walletaddress,
  Minttransactionhash: minttransactionhash
  },options)
  .then(response => {
    console.log(response.data);
    res.send(response.data)
  })
  .catch(error => {
     console.log(error.response.data);
     res.status(400).send(error.response.data)
  });
}; //Line 

const mintSomething = (req, res, next) => {
  const walletaddress = req.body.Walletaddress
  const uri = req.body.Uri
  console.log("Registering" + walletaddress)
  console.log(uri);
  const options = {
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey
    }
  };
  axios.post('https://api.cname.global/mintMaster/manual/paths/invoke',{
  WalletAddress: walletaddress,
  Uri:uri
  },options)
  .then(response => {
    console.log(response.data);
    res.send(response.data)
  })
  .catch(error => {
     console.log(error.response.data);
     res.status(502).send(error.response.data)
  });
}; //Line 


module.exports.fetchUsernames = fetchUsernames;
module.exports.fetchMintCount = fetchMintCount;
module.exports.registerUsername = registerUsername;
module.exports.mintSomething = mintSomething;
module.exports.fetchRegStatus = fetchRegStatus;
module.exports.fetchPinStatus = fetchPinStatus;
module.exports.fetchMintStatus = fetchMintStatus;

