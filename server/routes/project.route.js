import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import projectCtrl from '../controllers/project.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/projects - Get list of projects */
  .get(projectCtrl.list)

  /** POST /api/projects - Create new project */
  // .post(validate(paramValidation.createUser), userCtrl.create);
  .post(projectCtrl.create);

router.route('/:projectId')
/** GET /api/projects/:projectId - Get project */
  .get(projectCtrl.get)

  /** PUT /api/projects/:projectId - Update project */
  // .put(validate(paramValidation.updateProject), projectCtrl.update)
  .put(projectCtrl.update)

  /** DELETE /api/projects/:projectId - Delete project */
  .delete(projectCtrl.remove);

router.route('/me/:email')
/** GET /api/projects/me/:email - Get projects */
  .get(projectCtrl.get);

router.route('/user/:assignee')
/** GET /api/projects/user/:email - Get projects */
  .get(projectCtrl.get);

/** Load project when API with projectId route parameter is hit */
router.param('projectId', projectCtrl.load);
router.param('email', projectCtrl.getByAdminEmail);
router.param('assignee', projectCtrl.getByTasksAssigned);

export default router;
