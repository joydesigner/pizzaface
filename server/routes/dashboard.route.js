import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import dashboardCtrl from '../controllers/dashboard.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:email')
/** GET /api/dashboard/:email - Get dashboard */
  .get(dashboardCtrl.get);

router.param('email', dashboardCtrl.load);

export default router;
