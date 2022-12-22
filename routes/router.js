const express = require('express');
const router = express.Router();
const userControl = require('../controllers/user');
const authenticate = require('../middleware/authenticate');

// Public Routes
router.post('/login', userControl.login);
router.post('/signup', userControl.signup)

// Authentication middleware here
router.use(authenticate.checkLoggedin)

// Private Routes
router.get("/test", (req, res)=>{
 console.log("session");
})

router.get('/logout', userControl.logout);
router.post('/edit', userControl.editUser);
router.get('/invite', userControl.getInvite);


module.exports = router;