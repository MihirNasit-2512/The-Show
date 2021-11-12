const express = require('express');
const app = express();
const routes = require('./router/route');
const db = require('./db_config/connection');
const bodyparser = require('body-parser');

db.dbconnect();

app.use(bodyparser.json());

app.use('/',routes);

app.listen(9000,()=>{
    console.log('server started..');
});

