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

/** Load task when API with projectId route parameter is hit */
router.param('projectId', projectCtrl.load);

export default router;
