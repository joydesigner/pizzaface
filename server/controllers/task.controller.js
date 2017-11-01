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
 * Get tasks by projectId and User
 * @returns {Tasks}
 */

function getTaskByUser(req, res, next, email) {
  Task.getByAssigneeEmail(email).then((task) => {
    req.task = task; // eslint-disable-line no-param-reassign
    return res.json(req.task);
  }).catch(e => next(e));
}

function getTaskByUserProject(req, res, next, projectId, email) {
  Task.getByAssigneeProject(email, projectId).then((task) => {
    req.task = task; // eslint-disable-line no-param-reassign
    return res.json(req.task);
  })
    .catch(e => next(e));
}

/**
 * Get tasks by projectId
 * @returns {Tasks}
 */

function getTaskByProjectId(req, res, next, projectId) {
  Task.getByProjectId(projectId).then((task) => {
    req.task = task; // eslint-disable-line no-param-reassign
    return res.json(req.task);
  })
    .catch(e => next(e));
}

/**
 * Create new task
 * @property {string} req.body.TaskName - The TaskName of task.
 * @property {string} req.body.Content - The Content of task.
 * @property {string} req.body.Notes - The Notes of task.
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
    notes: req.body.notes,
    url: req.body.url,
    assignees: req.body.assignees,
    percentage: req.body.percentage,
    createdOn: req.body.createdOn,
    dueDate: req.body.dueDate,
    isActive: req.body.isActive,
    completed: req.body.completed,
    priority: req.body.priority,
    projectBelonged: req.body.projectBelonged
  });
  console.log('Task::', task);
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
          thisTask.assignees.push(req.body.assignees);

          thisTask.assignees.forEach((assignee) => {
            User.getByEmail(assignee)
              .then((user) => {
                if (user) {
                  user.tasks.push(thisTask._id);
                  user.save();
                }
              });
          });
        });
    })
    .catch(e => next(e));
}

/**
 * Update existing Task
 * @property {string} req.body.TaskName - The TaskName of task.
 * @property {string} req.body.Content - The Content of task.
 * @property {Array} req.body.notes - The Notes of task.
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
  console.log('task update request::', req.body);
  if (req.body.taskName) {
    task.taskName = req.body.taskName;
  }
  if (req.body.content) {
    task.content = req.body.content;
  }
  if (req.body.notes) {
    console.log('updating task notes:', req.body.notes);
    task.notes.push(req.body.notes);
  }
  if (req.body.percentage) {
    console.log('updating task percentage', req.body.percentage);
    task.percentage = req.body.percentage;
  }
  if (req.body.url) {
    task.url = req.body.url;
  }
  if (req.body.assignees) {
    // check if the assignee exist, if not push
    if (task.assignees.indexOf(req.body.assignees) === -1) {
      console.log('not in the array');
      console.log('requested assignees', req.body.assignees);
      console.log('task assignees', task.assignees);
      task.assignees.push(req.body.assignees);
    } else {
      console.log('alreay in');
      res.send('<h3>The assignee is already assigned with the task.</h3>');
    }
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

export default { load, get, getTaskByUser, getTaskByUserProject, getTaskByProjectId, create, update, list, remove };// eslint-disable-line max-len
