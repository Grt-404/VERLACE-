const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require("../models/product-model");
const userModel = require('../models/user-model');

router.get('/explore', (req, res) => {
    let error = req.flash("error");

    res.render("index", { error });
})
router.get('/', (req, res) => {

    let success = req.flash("success")
    res.render("render", { success });
})
router.get('/journal', (req, res) => {


    res.render("journal");
})
router.get('/philosophy', (req, res) => {


    res.render("philosophy");
})
router.get('/process', (req, res) => {


    res.render("process");
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
router.get('/subscribe', (req, res) => {
    req.flash("success", "Congrats! You will now recieve latest updates on the registered email");
    return res.redirect('/')
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
router.post("/sort", isLoggedin, async (req, res) => {

    let products = await productModel.find();
    products.forEach((product) => {
        if (req.body.sort === "price_asc") {
            res.redirect("/ascending")

        }
        if (req.body.sort === "price_desc") {
            res.redirect("/descending");
        }
    })


})
router.get("/ascending", async (req, res) => {
    let products = await productModel.find().sort({ price: 1 });
    let success = req.flash("success")
    res.render("shop", { products, success });
})
router.get("/descending", async (req, res) => {
    let products = await productModel.find().sort({ price: -1 });
    let success = req.flash("success")
    res.render("shop", { products, success });
})
router.get("/latest", async (req, res) => {
    let products = await productModel.find().sort({ _id: 1 });
    let success = req.flash("success")
    res.render("shop", { products, success });
})
router.get("/discount", async (req, res) => {
    let No_products = await productModel.find();
    let products = No_products.filter((val) => { return val.discount != 0; }
    )
    let success = req.flash("success")
    res.render("shop", { products, success });
})
router.get("/admin", isLoggedin, (req, res) => {
    if (req.user.email === "gurpreetarora1406@gmail.com") {
        return res.redirect("/owners/admin");
    }
    req.flash("success", "SORRY! YOU DON'T HAVE ADMIN PERMISSIONS, PLEASE CONTACT US FOR ANY HELP");
    return res.redirect('/shop')

})

module.exports = router;