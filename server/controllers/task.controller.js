import lodash from 'lodash';
import Task from '../models/task.model';
import User from '../models/user.model';
import Project from '../models/project.model';

/**
 * Load task and append to req.
 */
function load(req, res, next, id) {
  Task.get(id)
    .then((task) => {
      req.task = task; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get task
 * @returns {Task}
 */
function get(req, res) {
  return res.json(req.task);
}

/**
 * Create new task
 * @property {string} req.body.TaskName - The TaskName of task.
 * @property {string} req.body.Content - The Content of task.
 * @property {string} req.body.URL - The Content of task.
 * @property {string} req.body.Assignee - The Assignee of task.
 * @property {Date} req.body.DueDate - The DueDate of task.
 * @property {Boolean} req.body.Active - The Active of task.
 * @property {Boolean} req.body.Completed - The Completed of task.
 * @property {Number} req.body.Priority - The Priority of task.
 * @property {String} req.body.ProjectBelonged - The ProjectBelonged of task.
 * @returns {Task}
 */
function create(req, res, next) {
  const task = new Task({
    taskName: req.body.taskName,
    content: req.body.content,
    url: req.body.url,
    assignees: req.body.assignees,
    createdOn: req.body.createdOn,
    dueDate: req.body.dueDate,
    isActive: req.body.isActive,
    completed: req.body.completed,
    priority: req.body.priority,
    projectBelonged: req.body.projectBelonged
  });
  task.save()
    .then((savedTask) => {
      const thisTask = savedTask;
      res.json(thisTask);
      Project.get(thisTask.projectBelonged)
        .then((project) => {
          if (project) {
            project.tasks.push(thisTask._id);
            project.save();
          }
        })
        .then(() => {
        // TODO: task assignees currently only support the first one
          console.log('Task Assignees::', thisTask.assignees[0]);
          User.getByEmail(thisTask.assignees[0])
            .then((user) => {
              if (user) {
                user.tasks.push(thisTask._id);
                user.save();
              }
            });
        });
    })
    .catch(e => next(e));
}

/**
 * Update existing Task
 * @property {string} req.body.TaskName - The TaskName of task.
 * @property {string} req.body.Content - The Content of task.
 * @property {string} req.body.URL - The Content of task.
 * @property {string} req.body.Assignee - The Assignee of task.
 * @property {Date} req.body.DueDate - The DueDate of task.
 * @property {Boolean} req.body.Active - The Active of task.
 * @property {Boolean} req.body.Completed - The Completed of task.
 * @property {Number} req.body.Priority - The Priority of task.
 * @property {String} req.body.ProjectBelonged - The ProjectBelonged of task.
 * @returns {Task}
 */
function update(req, res, next) {
  const task = req.task;
  if (req.body.taskName) {
    task.taskName = req.body.taskName;
  }
  if (req.body.content) {
    task.content = req.body.content;
  }
  if (req.body.url) {
    task.url = req.body.url;
  }
  if (req.body.assignees) {
    task.assignees.push(req.body.assignees);
    // user need to push the task
    User.getByEmail(req.body.assignees).then((user) => {
      user.tasks.push(task._id);
    });
  }
  if (req.body.createdOn) {
    task.createdOn = req.body.createdOn;
  }
  if (req.body.dueDate) {
    task.dueDate = req.body.dueDate;
  }
  if (req.body.isActive) {
    task.isActive = req.body.isActive;
  }
  if (req.body.completed) {
    task.completed = req.body.completed;
  }
  if (req.body.priority) {
    task.priority = req.body.priority;
  }
  if (req.body.projectBelonged) {
    task.projectBelonged.push(req.body.projectBelonged);
  }

  task.save()
    .then(savedTask => res.json(savedTask))
    .catch(e => next(e));
}

/**
 * Get task list.
 * @property {number} req.query.skip - Number of tasks to be skipped.
 * @property {number} req.query.limit - Limit number of tasks to be returned.
 * @returns {Task[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Task.list({ limit, skip })
    .then(tasks => res.json(tasks))
    .catch(e => next(e));
}

/**
 * Delete task.
 * @returns {Task}
 */
function remove(req, res, next) {
  const task = req.task;
  task.remove()
    .then((deletedTask) => {
      // console.log('Deleted Task: ', deletedTask);
      res.json(deletedTask);
      // remove the task from user.tasks
      if (deletedTask.assignees.length > 0) {
        User.getByEmail(deletedTask.assignees[0]).then((user) => {
          lodash.pull(user.tasks, deletedTask._id);
          // console.log(user.tasks);
        });
      }
    })
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
