"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const pageRouter = (0, express_1.Router)();
// In-memory user database
const users = [
    { id: 1, username: "admin", password: "admin12345" }
];
/**
 * Home route
 *
 * @route GET /
 */
pageRouter.get('/', (req, res) => {
    res.status(200).render('index', {
        pageTitle: "Home"
    });
});
/**
 * login route
 *
 * @route GET /login
 */
pageRouter.get('/login', auth_middleware_1.isLoggedOut, (req, res) => {
    res.status(200).render('login');
});
/**
 * Login route
 *
 * @route POST /login
 */
pageRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (!foundUser) {
        res.status(301).redirect('/login');
        return;
    }
    res.cookie('isLoggedIn', true, {
        httpOnly: true,
        signed: true, // req.signedCookies
        maxAge: 3 * 60 * 1000 // 3 mins
    });
    res.cookie('username', username, {
        httpOnly: true,
        signed: true,
        maxAge: 3 * 60 * 1000 // 3 mins
    });
    res.status(301).redirect('/my-profile');
});
/**
 * Signup route
 *
 * @route POST /signup
 */
pageRouter.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(301).redirect('/login');
        return;
    }
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        res.status(301).redirect('/login');
        return;
    }
    const newUser = {
        id: users.length + 1,
        username,
        password
    };
    users.push(newUser); // Add user to users array
    res.cookie('isLoggedIn', true, {
        httpOnly: true,
        signed: true, // req.signedCookies
        maxAge: 3 * 60 * 1000 // 3 mins
    });
    res.cookie('username', username, {
        httpOnly: true,
        signed: true,
        maxAge: 3 * 60 * 1000 // 3 mins
    });
    res.status(301).redirect('/my-profile');
});
/**
 * Logout route
 *
 * @route GET /logout
 */
pageRouter.get('/logout', (req, res) => {
    res.clearCookie('isLoggedIn');
    res.clearCookie('username');
    res.status(301).redirect('/');
});
/**
 * My Account page (Logged in users only)
 *
 * @route GET /my-account
 */
pageRouter.get('/my-profile', auth_middleware_1.checkAuth, (req, res) => {
    const { username } = req.signedCookies;
    res.status(200).render('profile', {
        username
    });
});
exports.default = pageRouter;
