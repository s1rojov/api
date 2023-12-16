const { Router } = require("express");
const router = Router();

router.use('/job', require('./job'))
router.use('/employee', require('./employee'))
router.use('/department', require('./department'))
router.use('/statistic', require('./statistic'))

module.exports = router