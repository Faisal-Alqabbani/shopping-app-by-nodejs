var express = require('express');
const {insertUser, getUser,updateUser,deleteUser} = require('../controller/user_control');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/insert',insertUser);

// Get all users
router.get('/getUsers',getUser)
// update User 
router.post('/update',updateUser)

router.post('/delete',deleteUser)

module.exports = router;
