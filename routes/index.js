const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require("../models/product-model");
const userModel = require('../models/user-model');

// Landing Pages
router.get('/', (req, res) => {
    const success = req.flash("success");
    res.render("render", { success });
});

router.get('/explore', (req, res) => {
    const error = req.flash("error");
    res.render("index", { error });
});

router.get('/journal', (req, res) => res.render("journal"));
router.get('/philosophy', (req, res) => res.render("philosophy"));
router.get('/process', (req, res) => res.render("process"));

// Shop
router.get('/shop', isLoggedin, async (req, res) => {
    try {
        const products = await productModel.find();
        const success = req.flash("success");
        res.render("shop", { products, success });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error loading shop");
        res.redirect('/');
    }
});

// Cart
router.get('/cart', isLoggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate('cart.product');

        const productsInCart = user.cart
            .filter(item => item.product && item.product.image)
            .map(item => {
                const productObj = item.product.toObject();
                return {
                    ...productObj,
                    quantity: item.quantity
                };
            });

        res.render("cart", {
            productsInCart,
            totalDiscount: 0
        });
    } catch (err) {
        console.error("Cart error:", err.message);
        req.flash("error", "Could not load cart");
        res.redirect('/shop');
    }
});

// Add to cart
router.get('/addToCart/:productid', isLoggedin, async (req, res) => {
    try {
        const { productid } = req.params;
        const user = await userModel.findOne({ email: req.user.email });

        const existingItem = user.cart.find(item =>
            item.product && item.product.toString() === productid
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ product: productid, quantity: 1 });
        }

        await user.save();
        req.flash("success", "Product added to cart");
        res.redirect("/shop");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error adding to cart");
        res.redirect("/shop");
    }
});

// Increase quantity
router.get('/increaseqty/:productid', isLoggedin, async (req, res) => {
    try {
        const { productid } = req.params;
        const user = await userModel.findOne({ email: req.user.email });

        const existingItem = user.cart.find(item =>
            item.product && item.product.toString() === productid
        );

        if (existingItem) {
            existingItem.quantity += 1;
            await user.save();
        }

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.redirect('/cart');
    }
});

// Remove from cart
router.get('/removeFromCart/:productid', isLoggedin, async (req, res) => {
    try {
        const { productid } = req.params;
        const user = await userModel.findOne({ email: req.user.email });

        const itemIndex = user.cart.findIndex(item =>
            item.product && item.product.toString() === productid
        );

        if (itemIndex !== -1) {
            if (user.cart[itemIndex].quantity > 1) {
                user.cart[itemIndex].quantity -= 1;
            } else {
                user.cart.splice(itemIndex, 1);
            }

            await user.save();
        }

        res.redirect('/cart');
    } catch (err) {
        console.error("Remove from cart error:", err);
        req.flash("error", "Failed to update cart.");
        res.redirect('/cart');
    }
});



// Place order
router.get('/placeOrder', isLoggedin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate('cart.product');

        if (!user || user.cart.length === 0) {
            req.flash("error", "Your cart is empty.");
            return res.redirect("/cart");
        }

        const orderedProducts = user.cart
            .filter(item => item.product)
            .map(item => ({
                name: item.product.name,
                price: item.product.price,
                image: item.product.image ? item.product.image.toString('base64') : null, // ✅ base64 string
                bgcolor: item.product.bgcolor,
                panelcolor: item.product.panelcolor,
                textcolor: item.product.textcolor
            }));

        // ✅ Push each ordered product individually
        user.orders.push(...orderedProducts);

        // ✅ Clear the cart
        user.cart = [];

        await user.save();

        req.flash("success", "Order placed successfully!");
        res.redirect("/users/myAccount");

    } catch (err) {
        console.error("Order placement failed:", err);
        req.flash("error", "Could not place order.");
        res.redirect("/cart");
    }
});


// Sorting
router.post("/sort", isLoggedin, async (req, res) => {
    const { sort } = req.body;
    if (sort === "price_asc") return res.redirect("/ascending");
    if (sort === "price_desc") return res.redirect("/descending");
    return res.redirect("/shop");
});

router.get("/ascending", async (req, res) => {
    const products = await productModel.find().sort({ price: 1 });
    const success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/descending", async (req, res) => {
    const products = await productModel.find().sort({ price: -1 });
    const success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/latest", async (req, res) => {
    const products = await productModel.find().sort({ _id: -1 });
    const success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/discount", async (req, res) => {
    const allProducts = await productModel.find();
    const products = allProducts.filter(p => p.discount !== 0);
    const success = req.flash("success");
    res.render("shop", { products, success });
});

// Admin
router.get("/admin", isLoggedin, (req, res) => {
    if (req.user.email === "gurpreetarora1406@gmail.com") {
        return res.redirect("/owners/admin");
    }
    req.flash("success", "SORRY! YOU DON'T HAVE ADMIN PERMISSIONS, PLEASE CONTACT US FOR ANY HELP");
    res.redirect('/shop');
});

// Subscribe
router.get('/subscribe', (req, res) => {
    req.flash("success", "Congrats! You will now receive latest updates on the registered email");
    res.redirect('/');
});

module.exports = router;
