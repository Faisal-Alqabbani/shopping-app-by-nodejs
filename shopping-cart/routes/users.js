var express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Order = require('../models/order');
const passport = require('passport');
var router = express.Router();
const csrf  = require('csurf');


router.use(csrf());


/* GET users listing. */
router.get('/signup', isNotSignIn,function (req, res, next) {
  var messagesError = req.flash('signupError')
  res.render('user/signup', {messages:messagesError , token:req.csrfToken()})
});

router.post('/signup',
  [
    check('email').not().isEmpty().withMessage('Please Enter Your Email'),
    check('email').isEmail().withMessage('Please enter valid email'),
    check('password').not().isEmpty().withMessage('Please Enter Your password'),
    check('password').isLength({ min: 7 }).withMessage('Please Enter your password more than 7 char'),
    check('confirm-password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password and confirm-password not matched')
      }
      return value;
    })

  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var validationMessage = [];
      for(var i=0;i<errors.errors.length;i++){
        validationMessage.push(errors.errors[i].msg);
      }
      req.flash('signupError',validationMessage);
      return res.redirect('signup');
      
    }
    next()

    
  },passport.authenticate('local-signup',{
    session:false,
    successRedirect:'login',
    failureRedirect:'signup',
    failureFlash:true
  }));

router.get('/login',isNotSignIn,(req,res,next)=>{
  var messagesError = req.flash('signinError');
  res.render('user/login',{messages:messagesError, token:req.csrfToken()})
})

// proifle router 
router.get('/profile',isSignIn,(req,res,next)=>{
  if(req.user.cart){
    totalProducts = req.user.cart.totalquantity;
  }else{
    totalProducts = 0;
  }
  Order.find({user:req.user._id},(error,order)=>{
    if(error){
      return console.log(error);
    }
    console.log(order)
    res.render('user/profile',{
      checkUser:true,
      checkProfile:true,
      totalProducts,
      order
    
    });
  })

})
// Post Login 
router.post('/login', [
  check('email').not().isEmpty().withMessage('Please Enter Your Email'),
  check('password').not().isEmpty().withMessage('Please Enter Your password'),
],(req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    var validationMessage = [];
    for(var i =0;i<errors.errors.length;i++){
      validationMessage.push(errors.errors[i].msg);
    }
    req.flash('signinError',validationMessage)
    return res.redirect('login')
  }
next()
},passport.authenticate("local-signin",{
  successRedirect:'profile',
  failureRedirect:'login',
  failureFlash:true
}))

// logout user
router.get('/logout',isSignIn,(req,res,next) =>{
  req.logOut();
  res.redirect('/');
});

 function isSignIn(req,res,next){
  if(!req.isAuthenticated()){
    return res.redirect('login');
  }
  next();
}

function isNotSignIn (req,res,next){
  if(req.isAuthenticated()){
   return res.redirect('/');
  }
  next();
}

module.exports = router;
