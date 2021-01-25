const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    imagePath:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    information:{
        required:true,
        type:{
            storageCapacity:Number,
            numberOfSIM:String,
            cameraResolution:Number,
            displaySize:Number
        }
    }
});
module.exports = mongoose.model('product', productSchema);