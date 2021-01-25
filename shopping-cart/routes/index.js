var express = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const stripe = require('stripe')('sk_test_X1NEa1LfOgeuJQpfiGLs31i000DlPzztZv');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const successfuly = req.flash('success');
  //  console.log(req.session);
  //  console.log(req.user);
  var totalProducts = null;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      totalProducts = req.user.cart.totalquantity;
    } else {
      totalProducts = 0;
    }

  }
  Product.find({}, (error, doc) => {
    if (error) {
      return console.log(error);
    }
    var productGrid = [];
    var colGrid = 3;
    for (i = 0; i < doc.length; i += colGrid) {
      productGrid.push(doc.slice(i, i + colGrid))

    }
    console.log(productGrid);
    res.render('index',
      {
        title: 'Shopping-Cart',
        user: req.user,
        products: productGrid,
        checkUser: req.isAuthenticated(),
        totalProducts,
        successfuly

      });
  })

});

router.get('/addToCart/:id/:price/:name', (req, res, next) => {
  const cartID = req.user._id;
  const newProductPrice = parseInt(req.params.price, 10)
  const newProduct = {
    _id: req.params.id,
    price: newProductPrice,
    name: req.params.name,
    quantity: 1,
  }

  Cart.findById(cartID, (error, cart) => {
    if (error) {
      return console.log(error);
    }
    if (!cart) {
      const newCart = new Cart({
        _id: req.user._id,
        totalquantity: 1,
        totalprice: newProductPrice,
        selectedProduct: [newProduct]
      })
      newCart.save((error, result) => {
        if (error) {
          return console.log(error);
        }
        console.log(result);
      })
    }
    if (cart) {
      var indexOfProduct = -1;
      for (var i = 0; i < cart.selectedProduct.length; i++) {
        if (req.params.id === cart.selectedProduct[i]._id) {
          indexOfProduct = i;
          break;
        }
      }
      if (indexOfProduct >= 0) {
        console.log(`Add New Product where it index is ${indexOfProduct}`)
        cart.selectedProduct[indexOfProduct].quantity = cart.selectedProduct[indexOfProduct].quantity + 1;
        cart.selectedProduct[indexOfProduct].price = cart.selectedProduct[indexOfProduct].price + newProductPrice;
        cart.totalquantity = cart.totalquantity + 1;
        cart.totalprice = cart.totalprice + newProductPrice;
        Cart.updateOne({ _id: cartID }, { $set: cart }, (error, result) => {
          if (error) {
            return console.log(error);
          }
          console.log(result);
          console.log(cart);
        })

      } else {
        cart.totalquantity = cart.totalquantity + 1;
        cart.totalprice = cart.totalprice + newProductPrice;
        cart.selectedProduct.push(newProduct);
        Cart.updateOne({ _id: cartID }, { $set: cart }, (error, result) => {
          if (error) {
            return console.log(error);
          }
          console.log(result);
          console.log(cart);
        })
      }
    }

  })
  res.redirect('/');
})
// Shopping Cart Router 
router.get('/shopping-cart', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login')
  }
  if (!req.user.cart) {
    return res.render('shoppingcart', { checkUser: true, user: req.user, totalProducts: 0 });
  }
  // This variables must be below the condetion cuz cart not define 
  const userCart = req.user.cart;
  const totalProducts = req.user.cart.totalquantity;

  res.render('shoppingcart', { userCart, checkUser: true, user: req.user, totalProducts });
});

router.get('/increaseProduct/:index', (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity;
  userCart.selectedProduct[index].quantity += 1;
  userCart.selectedProduct[index].price += productPrice;
  userCart.totalquantity += 1;
  userCart.totalprice += productPrice;
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (error, result) => {
    if (error) {
      return console.log(error);
    }
    console.log(result);
    res.redirect('/shopping-cart');
  })

});

router.get('/decreaseProduct/:index', (req, res, next) => {
  const userCart = req.user.cart;
  const index = req.params.index;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity;
  userCart.selectedProduct[index].quantity -= 1;
  userCart.selectedProduct[index].price -= productPrice;
  userCart.totalquantity -= 1;
  userCart.totalprice -= productPrice;
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (error, result) => {
    if (error) {
      return console.log(error);
    }
    console.log(result);
    res.redirect('/shopping-cart');
  })


})
router.get('/deleteFromCart/:index', (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;
  if (userCart.selectedProduct.length <= 1) {
    Cart.deleteOne({ _id: userCart.id }, (error, result) => {
      if (error) {
        return console.log(error);
      }
      console.log(result);
      res.redirect('/shopping-cart');
    })
  } else {
    userCart.totalprice -= userCart.selectedProduct[index].price;
    userCart.totalquantity -= userCart.selectedProduct[index].quantity;
    userCart.selectedProduct.splice(index, 1);
    Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (error, result) => {
      if (error) {
        return console.log(error);
      }
      console.log(result);
      res.redirect('/shopping-cart');
    });


  }


});
router.get('/checkout', (req, res, next) => {
  const errorMessage = req.flash('error')
  res.render('checkout', {
    checkUser: true,
    user: req.user,
    totalProducts: req.user.cart.totalquantity,
    totalprice: req.user.cart.totalprice,
    errorMessage
  })
});
router.post('/checkout', (req, res, next) => {
  stripe.charges.create({
    amount: req.user.cart.totalprice * 100,
    currency: "usd",
    source: req.body.stripeToken,
    description: "Charge for test@gmail.com"
  })
    .then((charge) => {
      console.log(charge);
      req.flash('success', 'successfuly bought product');
      // create orders 
      const order = new Order({
        user: req.user._id,
        cart: req.user.cart,
        address: req.body.address,
        name: req.body.name,
        paymentid: charge.id,
        orderprice: req.user.cart.totalprice

      });
      // save the orders
      order.save((error, result) => {
        if (error) {
          return console.log(error);
        }
        console.log(result);
        // Delete cart after checkout
        Cart.deleteOne({ _id: req.user.cart._id }, (error, result) => {
          if (error) {
            return console.log(error);
          }
          console.log(result);
          res.redirect('/')
        })

      })
        .catch(error => {
          req.flash('error', error.raw.message)[0];
          res.redirect('/checkout')
        });
    })



})


module.exports = router;
