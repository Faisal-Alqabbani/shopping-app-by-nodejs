const Product = require('../models/product');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Shopping_cart',{useNewUrlParser:true}, err =>{
  if(err){
    return console.log(err);
  }
  console.log('Database Connected!');
})

const products = [
    new Product({
        imagePath:'/images/phone1.jpg',
        productName:'IPhone X',
        information:{
                storageCapacity:64,
                numberOfSIM:'Double SIM',
                cameraResolution:16,
                displaySize:6.5
        },
        price:220
    }),
    new Product({
        imagePath:'/images/534372.jpg',
        productName:'IPhone XR',
        information:{
                storageCapacity:64,
                numberOfSIM:'Single SIM',
                cameraResolution:20,
                displaySize:5.5
        },
        price:200
    }),

    new Product({
        imagePath:'/images/532738.jpg',
        productName:'Note 10',
        information:{
                storageCapacity:120,
                numberOfSIM:'double SIM',
                cameraResolution:20,
                displaySize:9.0
        },
        price:400
    }),

    new Product({
        imagePath:'/images/511799.jpg',
        productName:'Note 9',
        information:{
                storageCapacity:100,
                numberOfSIM:'Double SIM',
                cameraResolution:20,
                displaySize:8.0
        },
        price:300
    }),
    new Product({
        imagePath:'/images/539395.jpg',
        productName:'Huawei',
        information:{
                storageCapacity:200,
                numberOfSIM:'Double SIM',
                cameraResolution:40,
                displaySize:8.0
        },
        price:999
    }),
]
var done = 0;
for(var i = 0; i<products.length ; i++){
    products[i].save((error,doc) =>{
        if(error){
            return console.log(error);
        }
        console.log(doc);
        done++;
        if(done === products.length){
            mongoose.disconnect();
        }
    })
}