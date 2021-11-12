const express = require('express');
const router = express.Router();
const control = require('../controller/show');
const epi = require('../controller/episode');
const auth = require('../middleware/auth');

router.post('/login',control.login);

router.post('/signup',control.signup);

router.post('/newshow/:uid',auth,control.newshow);

router.put('/updshow/:uid',auth,control.updateshow);

router.delete('/deleteshow/:uid',auth,control.deleteshow);

router.get('/getshow/:uid',auth,control.getshow);

router.post('/newepi/:uid',auth,epi.newepi);

router.put('/updepi/:uid',auth,epi.updatepi);

router.delete('/delepi/:uid',auth,epi.deletepi);

router.get('/getepi/:uid',auth,epi.getepi);

module.exports = router;
