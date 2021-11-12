const mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});


module.exports.dbconnect = () => {
    con.connect((err) => {
        if (err) throw err;
        console.log('db connected successfully...');
    })
    
}
