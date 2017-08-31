import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import bizCtrl from '../controllers/business.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/biz - Get list of tasks */
  .get(bizCtrl.list)

  /** POST /api/biz - Create new business */
  // .post(validate(paramValidation.createUser), userCtrl.create);
  .post(bizCtrl.create);

router.route('/:bizId')
/** GET /api/biz/:bizId - Get biz */
  .get(bizCtrl.get)

  /** PUT /api/biz/:bizId - Update biz */
  // .put(validate(paramValidation.updateBiz), bizCtrl.update)
  .put(bizCtrl.update)

  /** DELETE /api/biz/:bizId - Delete biz */
  .delete(bizCtrl.remove);

/** Load business when API with bizId route parameter is hit */
router.param('bizId', bizCtrl.load);

export default router;
