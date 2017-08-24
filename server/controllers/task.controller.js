import Task from '../models/task.model';

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
    TaskName: req.body.TaskName,
    Content: req.body.Content,
    URL: req.body.URL,
    Assignee: req.body.Assignee,
    DueDate: req.body.DueDate,
    Active: req.body.Active,
    Completed: req.body.Completed,
    Priority: req.body.Priority,
    ProjectBelonged: req.body.ProjectBelonged
  });

  console.log('Task created', task);

  task.save()
    .then(savedTask => res.json(savedTask))
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
  if (req.body.TaskName) {
    task.TaskName = req.body.TaskName;
  }
  if (req.body.Content) {
    task.Content = req.body.Content;
  }
  if (req.body.URL) {
    task.URL = req.body.URL;
  }
  if (req.body.Assigned) {
    task.Assigned.push(req.body.Assigned);
  }
  if (req.body.DueDate) {
    task.DueDate = req.body.DueDate;
  }
  if (req.body.Active) {
    task.Active = req.body.Active;
  }
  if (req.body.Completed) {
    task.Completed = req.body.Completed;
  }
  if (req.body.Priority) {
    task.Priority = req.body.Priority;
  }
  if (req.body.ProjectBelonged) {
    task.ProjectBelonged = req.body.ProjectBelonged;
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
    .then(deletedTask => res.json(deletedTask))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
