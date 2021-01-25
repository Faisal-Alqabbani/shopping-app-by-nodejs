const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Cart = require('../models/cart');
passport.serializeUser((user,done)=>{
    // you can use any information of user like id or email ,username .. etc 
    return done(null,user.id)
})
passport.deserializeUser((id,done) =>{
    // (email) means dispaly the only the email
    User.findById(id,('email'),(error,user)=>{
        Cart.findById(id,(error,cart)=>{
            if(!cart){
                return done(error,user);
            }
            user.cart = cart;
            return done(error,user);
        })
        // return done(error,user)
    })
})
passport.use('local-signin', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    // After finsh this field run callback function
    passReqToCallback:true
    // done this function for authentication
},(req,email,password,done)=>{
    User.findOne({
        email,

    }, (error,user) =>{
        if(error){
            return done(error)
        }
        if(!user){
            // false means didn't send user if it is true mean send user
            // null meand an errors
            return done(null,false,req.flash('signinError','This user not found'))
        }
        if(!user.comparePassword(password)){
            return done(null, false, req.flash('signinError','the passwrod is invalid'))
        }
        return done(null,user)
;    })
}));


// sesstion for signup
passport.use('local-signup', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,
    
},(req,email,password,done)=>{
   const user = new User({
       email,
       password:User().hashPassword(password)
   })
   user.save((error,user)=>{
       if(error){
           return done(null, false,req.flash('signupError','This Email is not exist'));
       }
       return done(null,user)
   })
    

}))
