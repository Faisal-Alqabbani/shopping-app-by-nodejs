const mongoose = require('mongoose');
const schema = mongoose.Schema

const orderSchema  = mongoose.Schema({
    user:{
        type: schema.Types.ObjectId ,
        ref:'User',
        requried:true,
    },
    cart:{
        type:Object,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    paymentid:{
        type:String,
        required:true,

    },
    orderprice:{
        type:String,
        required:true,

    }

});


module.exports = mongoose.model('Order',orderSchema)