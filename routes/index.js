const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require("../models/product-model");
const userModel = require('../models/user-model');

router.get('/', (req, res) => {
    let error = req.flash("error");

    res.render("index", { error });
})
router.get('/shop', isLoggedin, async (req, res) => {
    let products = await productModel.find();
    let success = req.flash("success")
    res.render("shop", { products, success });

})
router.get('/cart', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');

    let productsInCart = user.cart;

    let totalMrp = productsInCart.reduce((total, item) => total + item.price, 0);
    let totalDiscount = productsInCart.reduce((total, item) => total + item.discount, 0);
    let cartTotal = totalMrp - totalDiscount;

    res.render("cart", { totalMrp, totalDiscount, cartTotal, productsInCart });

})
router.get('/addToCart/:productid', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    user.save()
    req.flash("success", "product added to cart");
    return res.redirect('/shop')
})
router.get('/increaseqty/:productid', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    user.save()
    res.redirect('/cart')
})
router.get('/removeFromCart/:index', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.splice(req.params.index, 1);
    user.save()
    res.redirect('/cart')
})

module.exports = router;