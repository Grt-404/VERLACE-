const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');


module.exports.registerUser = async function (req, res) {
    try {

        const { email, fullname, password } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/");

        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const createdUser = await userModel.create({
            email,
            password: hash,
            fullname
        });

        const token = generateToken(createdUser);
        res.cookie("token", token);
        res.status(201).redirect('/shop');

    } catch (err) {
        console.error(err.message);
        req.flash("error", "Server Error");
        return res.redirect("/");

    }
};
module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        req.flash("error", "Email or password is incorrect");
        return res.redirect("/");

    }
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect('/shop');
        }
        else {

            req.flash("error", "Email or password is incorrect");
            return res.redirect("/");


        }
    })
}
module.exports.logout = async function (req, res) {
    res.cookie("token", "");
    res.redirect('/')
}
module.exports.myAccount = async function (req, res) {
    let { fullname, email, contact, picture } = req.user;
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    user.cart.forEach((cartItem) => {
        user.orders.push(cartItem);
    });
    res.render("Account", { fullname, email, contact, picture, user });
}