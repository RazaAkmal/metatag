const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');

router.get('/fetch-usernames', controllers.fetchUsernames)
router.get('/fetch-mintcount', controllers.fetchMintCount)
router.post('/register-something', controllers.registerUsername)
router.post('/mint-something', controllers.mintSomething)
router.get('/fetch-regstatus', controllers.fetchRegStatus)
router.get('/fetch-pinstatus', controllers.fetchPinStatus)
router.get('/fetch-mintstatus', controllers.fetchMintStatus)

module.exports = router;