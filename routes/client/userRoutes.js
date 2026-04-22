const express = require('express');
const router = express.Router();
const UserController = require("../../controllers/client/userController");

// User
router.get('/login', UserController.loginUser);
router.post('/login', UserController.postLoginUser);
router.get('/logout', UserController.logoutUser);
router.get('/account', UserController.getAccount);
router.get('/register', UserController.registerUser);
router.post('/register', UserController.postRegisterUser);
router.get('/update-password', UserController.updatePassword);
router.post('/update-password', UserController.postUpdatePassword);
router.get('/forgot-password', UserController.getForgotPassword);
router.post('/forgot-password', UserController.postForgotPassword);
router.get('/reset-password/:token', UserController.getResetPassword);
router.post('/reset-password/:token', UserController.postResetPassword);
router.get('/my-tickets', UserController.getMyTickets);

module.exports= router;