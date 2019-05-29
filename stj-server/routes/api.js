const controller = require('../controllers/apiController');
const debug      = require('debug')('stj-server');
const express    = require('express');
const jwt        = require('../services/token');
const router     = express.Router();

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send( {message: 'No token provided.'} );
    }
    token = token.replace('Bearer ', '');
    debug(`verifyToken:  got token:${token}`);

    if (jwt.verify(token)) {
        return next();
    }
    else {
        return res.status(401).send( {message: 'Authentication token is not valid.'} );
    }
};

// routes mounted to /api
router.get('/event/:eventId/heats', controller.getHeats);
router.get('/meet/:meetId/session/:sessNum/events', controller.getEvents);
router.get('/meets', verifyToken, controller.getMeets);

module.exports = router;