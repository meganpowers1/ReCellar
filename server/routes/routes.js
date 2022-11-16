// routes specifies the routes for all the application functions
var express = require('express');

const auth = require('../controllers/auth.js');

const router = express.Router();

// router.post('/login', login);
router.post('/register', auth.register);
router.get('/reg', auth.reg);

// router.get('/private', isAuth);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

module.exports = router;
