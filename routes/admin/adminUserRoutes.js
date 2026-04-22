const express = require('express');
const router = express.Router();
const AdminUserController = require("../../controllers/admin/userController");

// User
router.get('/admin/user/list', AdminUserController.getAllUser);
router.get('/admin/user/add', AdminUserController.getAddUser);
router.post('/admin/user/add', AdminUserController.postAddUser);
router.get('/admin/user/edit/:id', AdminUserController.getEditUser);
router.post('/admin/user/edit/:id', AdminUserController.postEditUser);
router.delete('/admin/user/delete/:id', AdminUserController.deleteUser);

module.exports= router;