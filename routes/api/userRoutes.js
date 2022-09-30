const router = require('express').Router();
const {
    getStudents,
    createUser,
    getSingleUser,
    deleteUser,
    updateUser,
    updateBalance,
    createCheckoutSession
} = require('../../controllers/userController');
// const mysql = require('mysql2');

// /api/users
router.route('/').get(getStudents).post(createUser);

// /api/users/:userId
router.route('/:studentId').get(getSingleUser).delete(deleteUser).put(updateUser);

// /api/users/:userId/balance
router.route('/:studentId/balance').put(updateBalance);

// api/users/create-checkout-session
router.route('/:userId/create-checkout-session').post(createCheckoutSession)


module.exports = router;
