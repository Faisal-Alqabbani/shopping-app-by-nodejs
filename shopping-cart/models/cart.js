const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    _id:{
        required:true,
        type:String
    },
    totalquantity:{
         required:true,
         type:Number,

    },
    totalprice:{
        required:true,
        type:Number
    },
    selectedProduct:{
        required:true,
        type:Array,
        
        
    }

})

module.exports = mongoose.model('Cart',cartSchema);