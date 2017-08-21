import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import taskCtrl from '../controllers/task.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/tasks - Get list of tasks */
  .get(taskCtrl.list)

  /** POST /api/tasks - Create new task */
  // .post(validate(paramValidation.createUser), userCtrl.create);
  .post(taskCtrl.create);

router.route('/:taskId')
/** GET /api/tasks/:taskId - Get task */
  .get(taskCtrl.get)

  /** PUT /api/tasks/:taskId - Update task */
  // .put(validate(paramValidation.updateTask), taskCtrl.update)
  .put(taskCtrl.update)

  /** DELETE /api/tasks/:taskId - Delete task */
  .delete(taskCtrl.remove);

/** Load task when API with taskId route parameter is hit */
router.param('taskId', taskCtrl.load);

export default router;
