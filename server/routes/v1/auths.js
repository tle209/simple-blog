const router = require('express').Router();
const { login, logout } = require('../../services/posts');

router.put('/login', login);
router.put('/logout', logout);

module.exports = router;
