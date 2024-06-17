const Router = require('express')
const router = new Router()

const userController = require('../controller/user.controller')
const { registerUser } = require('../controller/user.controller')

router.post('/user', userController.createUser)
router.get('/user', userController.getUsers)
router.get('/user/:id', userController.getOneUser)
router.put('/user', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/login', userController.OneUserInfo);
router.get('/table/:tableName', userController.getTableContent);
router.put('/updateUser', userController.updateUser);
router.get('/user/role/:login', userController.getUserRole);
router.put('/updateOPT', userController.updateOPT);
router.put('/banUser', userController.banUser);
router.put('/unbanUser', userController.unbanUser);
router.delete('/deleteUser', userController.deleteUser);
router.post('/importData', userController.importData);

module.exports = router