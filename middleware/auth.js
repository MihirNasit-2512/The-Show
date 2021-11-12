const jwt = require('jsonwebtoken');
const _ = require('underscore');
require("dotenv").config();

module.exports = (req, res, next) => {
    if (!_.isEmpty(req.headers.authorization) || !_.isEmpty(req.params.uid)) {
        let token = req.headers.authorization;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (req.params.uid == decoded.id) {
            req.uid = decoded.id;
            next();
        } else {
            throw 'Invalid UserId.'
        }
    } else {
        res.send({ status: false, message: "Plz,Provide Token." });
    }
}