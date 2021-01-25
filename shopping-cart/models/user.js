const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true

    },
    password:{
        type:String,
        required:true,
        trim:true
    }
},{
    timestamps:true
});
userSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
}
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('User',userSchema);