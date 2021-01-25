const User = require('../model/user')
const insertUser = (req,res,next)=>{
    const user = new User({
      username:req.body.username,
      userMail:req.body.usermail
    })
user.save((error,result) =>{
    if(error){
        res.redirect('/')
        return console.log(error);
    }
      console.log(result);
      res.redirect('/getUsers');
    })
}
// get user controller
const getUser = (req,res,next) =>{
    User.find({},'username userMail',(error,result) =>{
      if(error){
        res.redirect('/');
        return console.log(error);
      }
      console.log(result);
      res.render('index',{items:result})
  
    })
  }
const updateUser = (req,res,next) =>{
    const _id = req.body._id;
    const updateUser = {
      username:req.body.username,
      userMail:req.body.usermail
    }
  // update User
    User.updateOne({_id},{$set:updateUser},(error,result)=>{
    if(error){
      res.redirect('/');
      return console.log('error');
    }
    console.log(result);
    res.redirect('/getUsers');
    })
  }
// Delete user form databse
const deleteUser = (req,res,next)=>{
    const _id = req.body._id;
    User.deleteOne({_id},(error,result)=>{
      if(error){
        res.redirect('/');
        return console.log(error)
      }
      res.redirect('/getUsers');
      console.log(result)
    })
  }


module.exports = {
    insertUser,
    getUser,
    updateUser,
    deleteUser
}