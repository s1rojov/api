const { Router } = require("express");
const router = Router();

router.use('/job', require('./job'))
router.use('/employee', require('./employee'))
router.use('/register', require('./register'))
router.use('/login', require('./login'))

module.exports = router