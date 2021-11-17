const jwt = require('jsonwebtoken');
const _   = require('underscore');

require("dotenv").config();

module.exports = (req, res, next) => {
    if (!_.isEmpty(req.headers.authorization)) {
        let token = req.headers.authorization;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (decoded) {
            req.uid = decoded.id;
            next();
        } else {
            throw 'Something Went Wrong.'
        }
    } else {
        res.send({ status: false, message: "Plz,Provide Token." });
    }
}