const mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "the_show"
});


function db_qry() {

    this.insert = (bdata, cb) => {
        let sql = "insert into user set ?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err)
            }
        })
    }

    this.insert2 = (bdata, cb) => {
        let sql = "insert into `show` set ?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err)
            }
        })
    }

    this.insertnewepi = (bdata, cb) => {
        let sql = "insert into `episodes` set ?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err)
            }
        })
    }

    this.findfshow = (bdata, cb) => {

        let sql = "select * from `show` where id=?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

    this.find2 = (bdata, cb) => {

        let sql = "select * from user where email=?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

    this.find3 = (bdata, cb) => {

        let sql = "select * from user where id=?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

    this.findshowbyname_uid = (bdata, id, cb) => {
        let sql = "select * from `show` where name=? and user_id=?";
        con.query(sql, [bdata, id], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        });
    }

    this.findshow_limit = (bdata, skip, cb) => {
        let sql = "select * from `show` where user_id=? limit ?,2";
        con.query(sql, [bdata, skip], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        });
    }

    this.findepi = (bdata, season, cb) => {

        let sql = "select * from `episodes` where show_id=? and season=?";
        con.query(sql, [bdata, season], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

    this.findepiuid_shid = (shid, epid, cb) => {
        let sql = "select * from `episodes` where show_id=? and id=?";
        con.query(sql, [shid, epid], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

    this.update = (upobj, id, cb) => {
        let sql = `update the_show.show set ${upobj} where id = ${id}`
      
        con.query(sql,(err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                console.log(err);
                cb(null, false)
            }
        });
    }

    this.updatepi = (upobj, id, cb) => {
        let sql = "update `episodes` set ? where id=?";
        con.query(sql, [upobj, id], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err)
            }
        });
    }

    this.delete = (bdata, cb) => {
        let sql = "delete from `show` where id=?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err)
            }
        });
    }

    this.deletepi_epid_sid_uid = (epid, sid, uid, cb) => {
        let sql = "delete from `episodes` where id=? and show_id=? and user_id=?";
        con.query(sql, [epid, sid, uid], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err)
            }
        });
    }


    this.findfepi = (uid, skip, cb) => {

        let sql = "select * from `episodes` where user_id=? limit ?,2";
        con.query(sql, [uid, skip], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        });
    }

    this.countepi = (uid, cb) => {

        let sql = "select count(*) as total from `episodes` where user_id=?";
        con.query(sql, [uid], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

    this.countshow = (bdata, cb) => {

        let sql = "select count(*) as total from `show` where user_id=?";
        con.query(sql, [bdata], (err, result) => {
            if (!err) {
                cb(null, result);
            } else {
                cb(null, err);
            }
        })
    }

}


module.exports = new db_qry();