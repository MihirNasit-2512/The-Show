const _ = require('underscore');
const db_qry = require('../db_config/query');

function epi() {

    this.newepi = (req, res) => {
        let bdata = req.body;
        let sid = Number(req.query.sid);
        if (_.isEmpty(req.query.sid)) {
            res.send({ status: false, message: "Plz,Enter Show Id." });
        } else {
            if (_.isEmpty(bdata.name) || _.isEmpty(bdata.r_date) || _.isEmpty(bdata.season) || _.isEmpty(bdata.channel)) {
                res.send({ status: false, message: "Plz,Enter Episode Details" });
            } else {
                db_qry.findfshow(sid, (err, resu) => {
                    if (!err) {
                        if (req.uid === resu[0].user_id) {
                            bdata.user_id = resu[0].user_id;
                            bdata.show_id = resu[0].id
                            console.log(bdata);
                            db_qry.findepi(resu[0].id, bdata.season, (err, result) => {
                                if (!err) {
                                    if (_.isEmpty(result)) {
                                        db_qry.insertnewepi(bdata, (err, result) => {
                                            if (!err) {
                                                res.send({ status: true, message: "Episode Created.." });
                                            } else {
                                                throw err;
                                            }
                                        });
                                    } else {
                                        res.send({ status: false, message: "This Episode Is Already Created By You." });
                                    }
                                }
                            });
                        } else {
                            res.send({ status: false, message: "You Can Not Create Episode For This Show." });
                        }
                    } else {
                        throw err;
                    }
                });
            }
        }
    }

    this.updatepi = (req, res) => {
        let bdata = req.body;
        let id = req.query;
        if (_.isEmpty(id.epid)) {
            res.send({ status: false, message: "Plz,Enter Episode Id to Update" })
        } else {
            db_qry.findepiuid_shid(id.sid, id.epid, (err, ans) => {
                if (!err) {
                    if (!_.isEmpty(ans)) {
                        let upobj = {
                            season: bdata && bdata.season ? bdata.season : ans[0].season,
                            name: bdata && bdata.name ? bdata.name : ans[0].name,
                            r_date: bdata && bdata.r_date ? bdata.r_date : ans[0].r_date,
                            channel: bdata && bdata.channel ? bdata.channel : ans[0].channel,
                            show_id: ans[0].show_id,
                            user_id: ans[0].user_id
                        }
                        db_qry.updatepi(upobj, id.epid, (err, data) => {
                            if (!err) {
                                res.send({ status: true, message: "Episode Updated.." });
                            } else {
                                throw err;
                            }
                        });
                    } else {
                        res.send({ status: false, message: "No Episode Found." })
                    }
                } else {
                    throw err;
                }
            });
        }
    }

    this.deletepi = (req, res) => {
        let id = req.query;
        db_qry.deletepi_epid_sid_uid(id.epid, id.sid, req.uid, (err, result) => {
            if (!err) {
                if (result.affectedRows == 1) {
                    res.send({ status: true, message: "Episode Deleted." });
                } else {
                    res.send({ status: false, message: "No Episode Found" });
                }
            } else {
                throw err;
            }
        });
    }

    this.getepi = (req, res) => {
        let pgno = req.query.pgno;
        if (_.isEmpty(pgno)||_.isNull(pgno)) {
            pgno = 1;
        }
        skip = 2 * (pgno - 1);
        db_qry.findfepi(req.uid, skip, (err, result) => {
            if (!err) {
                db_qry.countepi(req.uid, (err, totepi) => {
                    let totpage = Math.ceil(totepi[0].total / 2);
                    if (pgno <= 0 || pgno > totpage) {
                        res.send({ status: false, message: "Invalid Page Number." });
                    } else {
                        res.send({ status: true, Page: Number(pgno), message: result, TotalPage: totpage });
                    }
                });
            } else {
                throw err;
            }
        });
    }

}

module.exports = new epi();
