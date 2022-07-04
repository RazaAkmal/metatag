const axios = require('axios')
const apiKey = '02159266bc384e7b819daf2401d5a878'

const fetchUsernames = (req, res, next) => {
  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': 'b1d6d6dcb06541eabf93f5b391b00ce1',
    'Ocp-Apim-Trace': true
  }
    axios.get("https://api-metatag.azure-api.net/getUserNames/GetAll?name=hello", {
      headers
    })
    .then(response => {
      console.log(response.data);
      res.send(JSON.stringify(response.data))
    })
    .catch(error => {
      console.log(error);
    });
};
const fetchFilterdUsername = (req, res, next) => {
  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': 'b1d6d6dcb06541eabf93f5b391b00ce1',
    'Ocp-Apim-Trace': true
  }
    axios.get(`https://api-metatag.azure-api.net/getUserNames/GetFilterSearch?name=${req.query.name}`, {
      headers
    })
    .then(response => {
      res.send(JSON.stringify(response.data))
    })
    .catch(error => {
      console.log(error);
    });
};
const fetchWhiteListed = (req, res, next) => {
    const buildUri = "https://api-metatag.azure-api.net/getUserNames/GetWhitelist?name=all"
    axios.get(buildUri,{
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': "b1d6d6dcb06541eabf93f5b391b00ce1"
      }
    })
    .then(response => {
      // console.log(response.data);
      res.send(JSON.stringify(response.data))
    })
    .catch(error => {
      console.log(error, "Error ehre");
      res.status(400).send(error.response.data)
  
    });
};


module.exports.fetchUsernames = fetchUsernames;
module.exports.fetchWhiteListed = fetchWhiteListed;
module.exports.fetchFilterdUsername = fetchFilterdUsername;
