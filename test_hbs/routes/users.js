var express = require('express');
const {check, validationResult} = require('express-validator');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/info/:id', (req,res,next) =>{
  console.log(req.params.id);
  res.render('info',{id:req.params.id})
});
router.post('/info',[
    check('id','The ID must be not Empty').isLength({max:3}).isNumeric()
  ]
,(req,res,next) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    req.session.success = false;
    req.session.error = errors.array();
    return res.redirect('/');
  }
  req.session.success = true;
  req.session.errors = null;
    res.redirect('info/'+req.body.id);
    console.log(req.body.id);
  
})

module.exports = router;
