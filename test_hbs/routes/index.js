var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , success:req.session.success, error:req.session.error});
});
router.get('/info',(req,res,next) =>{
  res.send('Hi main info here');
})
module.exports = router;
