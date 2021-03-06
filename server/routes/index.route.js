import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import taskRoutes from './task.route';
import bizRoutes from './business.route';
import projectRoutes from './project.route';
import dashboardRoutes from './dashboard.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount task routes at /tasks
router.use('/tasks', taskRoutes);

// mount business routes at /biz
router.use('/biz', bizRoutes);

// mount project routes at /projects
router.use('/projects', projectRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount dashboard routes at /dashboard
router.use('/dashboard', dashboardRoutes);

export default router;
