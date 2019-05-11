const debug = require('debug')('stj-server');
const tokenSvc = require('../services/token');
const User  = require('../models/user');

function findUser(first, last)
{
    // insert or update user in DB
    const newUser    = {"first": first, "last": last};
    const queryObj   = {"first": first, "last": last};
    const updateOpts = {"new": true, "upsert": true, "runValidators": true};

    return User.findOneAndUpdate(queryObj, newUser, updateOpts).exec();
}


exports.login = async function(req, res, next) {
    const first    = req.body.firstName ? req.body.firstName.trim() : '';
    const last     = req.body.lastName ? req.body.lastName.trim() : '';
    const pin      = req.body.pin ? req.body.pin.trim() : '';
    const validPin = req.app.get('pin');
    //debug(`User: ${first} ${last} using pin: ${pin}, validPin: ${validPin}`);

    if (pin !== validPin)  {
        return res.status(401).json( {message: 'Invalid PIN.'} );
    }
    if (!first || !last) {
        return res.status(400).json( {message: 'Missing information.'} );
    }

    const user = await findUser(first.trim(), last.trim());
    const token = tokenSvc.sign( user.toObject() ); // toObject() call needed to create js object
    res.json( {token: token} );
};
