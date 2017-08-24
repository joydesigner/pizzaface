import { Observable } from 'rxjs';
import Project from '../models/project.model';
import Task from '../models/task.model';

/**
 * Load project and append to req.
 */
function load(req, res, next, email) {
  Project.getByEmail(email)
    .then((projects) => {
      req.projects = projects; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get dashboard
 * @returns {Dashboard}
 */

function get(req, res) {
  if (req.projects && req.projects.length > 0) {
    // need to use async for each
    const sourceProjects = Observable.from(req.projects);
    sourceProjects.subscribe(
      (project) => {
        const taskPromise = Task.getByProjectId(project._id);
        const sourceTasks = Observable.fromPromise(taskPromise);
        sourceTasks.subscribe((tasks) => {
          console.log('Tasks::', tasks);
          project.Tasks = tasks[0]; // eslint-disable-line no-param-reassign
          console.log('Project Tasks::', project.Tasks);
          console.log('Project::', project);
        });
      },
      (e) => {
        console.log(`error: ${e}`);
      },
      () => console.log('completed')
    );
  }
  return res.json(req.projects);
}
export default { load, get };
