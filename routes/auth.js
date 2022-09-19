const router = require('express').Router();
const controller = require('../Controller/controller.js')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/verify', controller.verify)
router.delete('/:email', controller.delete)
router.post('/bhoot/:email', controller.bhoot)
module.exports = router;