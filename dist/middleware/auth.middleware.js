"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedOut = exports.checkAuth = void 0;
const checkAuth = (req, res, next) => {
    const { isLoggedIn } = req.signedCookies;
    if (!isLoggedIn) {
        res.status(301).redirect('/login');
        return;
    }
    next(); // Proceed to the next middleware
};
exports.checkAuth = checkAuth;
const isLoggedOut = (req, res, next) => {
    const { isLoggedIn } = req.signedCookies;
    if (isLoggedIn) {
        res.status(301).redirect('/my-profile');
        return;
    }
    next();
};
exports.isLoggedOut = isLoggedOut;
