const express = require('express');
const { getSuggestions } = require('../controllers/suggestionController');
const router = express.Router();

router.post('/', getSuggestions);

module.exports = router;
