const controller = require('../controllers/loginController');
const express    = require('express');
const router     = express.Router();

// routes mounted to /login
router.post('/', controller.login);

module.exports = router;