const { Router } = require("express");
const router = Router();

router.use('/job', require('./job'))
module.exports = router