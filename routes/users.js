const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register');
}}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo:true}), (req, res) => {
    // keep session info true 안하면 returnTo가 날라간다. Colt 코드에는 없는것.
    req.flash('success', 'welcome back!')
    console.log(req.session);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

})

router.get('/logout', (req, res) => {  // https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
      });
})

module.exports = router;
