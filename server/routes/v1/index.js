const router = require('express').Router();

router.use('/posts', require('./posts'));
router.use('/posts', require('./comments'));

module.exports = router;
