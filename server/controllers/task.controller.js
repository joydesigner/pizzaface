import Task from '../models/task.model';
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
  if (req.body.priority !== null && req.body.priority !== undefined) {
    task.priority = req.body.priority;
  }
  if (req.body.taskName) {
    task.taskName = req.body.taskName;
  }
  if (req.body.content) {
    task.content = req.body.content;
  }
  if (req.body.notes) {
    task.notes.push(req.body.notes);
  }
  if (req.body.percentage) {
    task.percentage = req.body.percentage;
    // override by certain conditions
    if (req.body.percentage === 100) {
      task.completed = true;
    } else {
      task.completed = false;
    }
  }
  if (req.body.url) {
    task.url = req.body.url;
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
    if (task.completed === true) {
      task.percentage = 100;
    }
  }

  if (req.body.projectBelonged) {
    task.projectBelonged.push(req.body.projectBelonged);
  }

  if (req.body.assignees) {
    // check if the assignee exist, if not push
    if (task.assignees.indexOf(req.body.assignees) < 0) {
      task.assignees.push(req.body.assignees);
    } else {
      const response = {
        message: 'The user is already in the assignee list'
      };
      res.status(404).send(response);
    }
    task.assignees = Array.from(new Set(task.assignees));
    // user need to push the task
    // User.getByEmail(req.body.assignees).then((user) => {
    //   user.tasks.push(task._id);
    // });
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
 * Remove assignee from task
 * @returns {Task}
 */
function removeAssignee(req, res, next) {
  const task = req.task;
  if (req.body.assignees) {
    // check if the assignee exist, if not push
    const assignees = task.assignees;
    const assignee = req.params.assignee;
    const index = assignees.indexOf(assignee);
    assignees.splice(index, 1);
  }

  task.save()
    .then(savedTask => res.json(savedTask))
    .catch(e => next(e));
}


/**
 * Delete task.
 * @returns {Task}
 */
function remove(req, res, next) {
  Task.findByIdAndRemove(req.params.taskId)
    .then((deletedTask) => {
      const response = {
        message: 'Task is successfully deleted',
        id: deletedTask._id
      };
      res.status(200).send(response);
    })
    .catch(e => next(e));
}

export default { load, get, getTaskByUser, getTaskByUserProject, getTaskByProjectId, create, update, list, remove, removeAssignee };// eslint-disable-line max-len
