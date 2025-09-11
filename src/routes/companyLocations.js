const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const controller = require('../controllers/companyLocationController');

router.use(authenticateToken, authorizeRoles('agency', 'admin'));

router.get('/', controller.listLocations);
router.post('/', controller.createLocation);
router.get('/:id', controller.getLocation);
router.put('/:id', controller.updateLocation);
router.delete('/:id', controller.deleteLocation);

module.exports = router;

