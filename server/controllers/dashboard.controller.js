// import lodash from 'lodash';
import Project from '../models/project.model';
import User from '../models/user.model';
import Task from '../models/task.model';
/**
 * Load project and append to req.
 */
function load(req, res, next, email) {
  Project.getByAdminEmail(email)
    .then((projects) => {
      req.projects = projects; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get dashboard
 * @returns {Promise<Dashboard[]>}
 * Logic:
 * For USER, list all projects contain the tasks which the user is assigned to
 * For ADMIN/MANAGER, list all projects the user is the owner of the project
 */

function get(req, res) {
  console.log('current dashboard req::', req.params.email);
  return new Promise(() => {
    if (req.params.email) {
      User.getByEmail(req.params.email).then((user) => {
        console.log('current USER::', user);
        if (user.role === 'ADMIN' || user.role === 'MANAGER') {
          console.log('Here is ADMIN');
          // ADMIN
          // 1. List all projects owned by the admin
          // 2. List all projects contains the task assigned to the admin
          // List all projects owned by the admin
          Project.getByAdminEmail(req.params.email).then((projects) => {
            console.log('get by admin email');
            return res.json(projects);
          });
        }
        if (user.role === 'USER') {
          // USER => list all tasks assigned to the user and project contains those tasks
          // projectIDs, find the project which contains those tasks assigned to the user
          // TaskIds, find the tasks which are assigned to the user
          console.log('Here is for USER');
          Task.getByAssigneeEmail(req.params.email).then((tasks) => {
            console.log('User Tasks::', tasks);
            return res.json(tasks);
          });
        }
      });
    }
  });
}

export default { load, get };
