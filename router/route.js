const express = require('express');
const router  = express.Router();
const control = require('../controller/show');
const epi     = require('../controller/episode');
const auth    = require('../middleware/auth');

router.post('/login',control.login);

router.post('/signup',control.signup);

router.post('/show/create',auth,control.newshow);

router.put('/show/update/:sid',auth,control.updateshow);

router.delete('/show/delete/:sid',auth,control.deleteshow);

router.get('/show/get/:pgno',auth,control.getshow);

router.post('/episode/create/:sid',auth,epi.newepi);

router.put('/episode/update/:epid/:sid',auth,epi.updatepi);

router.delete('/episode/delete/:epid/:sid',auth,epi.deletepi);

router.get('/episode/get/:pgno',auth,epi.getepi);

router.get('/uploads/:fname',control.getimg);

module.exports = router;
