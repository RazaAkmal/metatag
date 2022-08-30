const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');

router.get('/fetch-usernames', controllers.fetchUsernames)
router.get('/fetch-whitelisted', controllers.fetchWhiteListed)
router.get('/fetch-filtered-username/', controllers.fetchFilterdUsername)
router.get('/fetch-nft-images/', controllers.fetcNFTImages)

module.exports = router;