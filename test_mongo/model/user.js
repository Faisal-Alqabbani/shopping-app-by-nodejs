const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    userMail:{
        type:String,
        default:'Email User any thing'
    }
})
module.exports = mongoose.model('User',UserSchema)