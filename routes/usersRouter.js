const express = require('express');
const userModel = require('../models/user-model');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerUser, loginUser, logout, myAccount } = require('../controllers/authController.js');
const isLoggedin = require("../middlewares/isLoggedin");
const upload = require('../config/multer-config');



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/myAccount', isLoggedin, myAccount);

router.post('/dp', isLoggedin, upload.single("image"), async (req, res) => {

    const user = await userModel.findOne({ email: req.user.email });
    user.image = req.file.buffer;
    await user.save();
    res.redirect('/users/myAccount');

})
router.get('/editProfile', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render("edit", { user });
})
router.post("/edit", isLoggedin, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email });
    user.fullname = req.body.fullname;
    user.email = req.body.email;
    user.contact = req.body.contact;
    await user.save();
    // ✅ Re-issue token with updated email
    let token = jwt.sign({ email: user.email }, process.env.JWT_KEY);
    res.cookie("token", token);

    res.redirect('/users/myAccount');

    res.redirect('/users/myAccount');
})
module.exports = router;