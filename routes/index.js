const { Router } = require("express");
const router = Router();

router.use('/job', require('./job'))
router.use('/employee', require('./employee'))

module.exports = router