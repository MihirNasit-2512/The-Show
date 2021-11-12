const db_qry = require('../db_config/query');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function controller() {


    this.login = (req, res) => {
        let bdata = req.body;
        if (_.isEmpty(bdata.email)) {
            res.send({ status: false, message: "Plz,Enter E-mail" });
        } else if (_.isEmpty(bdata.password)) {
            res.send({ status: false, message: "Plz,Enter Password" });
        } else {
            db_qry.find2(bdata.email, (err, result) => {
                if (!err) {
                    if (!_.isEmpty(result)) {
                        bcrypt.compare(bdata.password, result[0].password, (err, re) => {
                            if (re) {
                                var token = jwt.sign({ id: result[0].id }, process.env.PRIVATE_KEY, { algorithm: 'HS256' });
                                globtoken = token;
                                res.send({ status: true, message: "Login Successfully...", token: token });
                            } else {
                                res.send({ status: false, message: "Incorrect Password." });
                            }
                        });
                    } else {
                        res.send({ status: false, message: "Incorrect E-mail." });
                    }
                }
            });
        }
    }
    
    this.signup = (req, res) => {
        let bdata = req.body;
        if (_.isEmpty(bdata.name) || _.isEmpty(bdata.address) || _.isEmpty(bdata.email) || _.isEmpty(bdata.password)) {
            res.send({ status: false, message: "Plz,Enter Details.." });
        } else {
            db_qry.find2(bdata.email, (err, result) => {
                if (!err) {
                    if (_.isEmpty(result)) {
                        bcrypt.hash(bdata.password, 10, function (err, hash) {
                            bdata.password = hash;
                            db_qry.insert(bdata, (err, result) => {
                                if (!err) {
                                    res.send({ status: true, message: "User Registered.." });
                                } else {
                                    res.send({ status: false, message: "User not Registered.." });
                                }
                            });
                        });
                    } else {
                        res.send({ status: false, message: "E-mail Already Registered.." });
                    }
                } else {
                    throw err;
                }
            });
        }
    }
    
    
    this.newshow = (req, res) => {
        let bdata = req.body;
        bdata.user_id = req.uid;
        db_qry.findshowbyname_uid(bdata.name, bdata.user_id, (err, resu) => {
            if (!err) {
                if (_.isEmpty(resu)) {
                    if (_.isEmpty(bdata.r_date) || _.isEmpty(bdata.episodes) || _.isEmpty(bdata.name)) {
                        res.send({ status: false, message: "Plz,Enter All Details" });
                    } else {
                        db_qry.insert2(bdata, (err, result) => {
                            if (!err) {
                                res.send({ status: true, message: "Show Created..." });
                            } else {
                                throw err;
                            }
                        });
                    }
                } else {
                    res.send({ status: false, message: "This Show Is Already Created By You." });
                }
            } else {
                throw err;
            }
        })


    }

    this.updateshow = (req, res) => {
        let bdata = req.body;
        let sid = req.query.sid;
        if (_.isEmpty(sid)) {
            res.send({ status: false, message: "Plz,Enter Show Id To Update" });
        } else {
            db_qry.findfshow(sid, (err, data) => {
                if (!err) {
                    if (!_.isEmpty(data)) {
                        if (req.uid == data[0].user_id) {
                            let upobj = {
                                name: bdata && bdata.name ? bdata.name : data[0].name,
                                r_date: bdata && bdata.r_date ? bdata.r_date : data[0].r_date,
                                user_id: data[0].user_id,
                                episodes: bdata && bdata.episodes ? bdata.episodes : data[0].episodes
                            }
                            db_qry.update(upobj, data[0].id, (err, re) => {
                                if (!err) {
                                    res.send({ status: true, message: "Show Was Updated.." });
                                } else {
                                    throw err;
                                }
                            });

                        } else {
                            res.send({ status: false, message: "No Show Found." });
                        }
                    } else {
                        res.send({ status: false, message: "No Show Found." });
                    }
                } else {
                    throw err;
                }
            });
        }
    }

    this.deleteshow = (req, res) => {
        let bdata = req.query;
        if (_.isEmpty(bdata.sid)) {
            res.send({ status: false, message: "Plz,Enter Show Id To Delete Show.." });
        } else {
            db_qry.findfshow(bdata.sid, (err, result) => {
                if (!err) {
                    if (!_.isEmpty(result)) {
                        if (req.uid == result[0].user_id) {
                            db_qry.delete(bdata.sid, (err, ans) => {
                                if (!err) {
                                    res.send({ status: true, message: "Show Was Deleted.." });
                                } else {
                                    throw err;
                                }
                            });
                        } else {
                            res.send({ status: false, message: "No Show Found." });
                        }
                    } else {
                        res.send({ status: false, message: "No Show Found." });
                    }
                } else {
                    throw err;
                }

            });
        }
    }

    this.getshow = (req, res) => {
        let pgno = req.query.pgno;
        
        if (_.isNull(pgno) || _.isEmpty(pgno)) {
            pgno = 1;
        }
        let skip = 2 * (pgno - 1);
        let bdata = req.uid;
        db_qry.findshow_limit(bdata, skip, (err, result) => {
            if (!err) {
                db_qry.countshow(bdata, (err, totshow) => {
                    if (!err) {
                        let totpage = Math.ceil(totshow[0].total / 2);
                        if (pgno <= 0 || pgno > totpage) {
                            res.send({ status: false, message: "Inavlid Page Number." });
                        } else {
                            res.send({ status: true, Page: Number(pgno), show: result, TotalPage: totpage });
                        }
                    } else {
                        throw err;
                    }
                });
            } else {
                throw err;
            }
        });

    }
}
module.exports = new controller();
