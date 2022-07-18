const router = require('express').Router();
const {
    getUsers,
    createUser,
    getSingleUser,
    deleteUser,
    updateUser,
    updateBalance
} = require('../../controllers/userController');
const mysql = require('mysql2');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:username').get(getSingleUser).delete(deleteUser).put(updateUser);

// /api/users/:userId/balance
router.route('/:username/balance').put(updateBalance);


module.exports = router;
