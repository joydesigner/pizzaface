import Project from '../models/project.model';

/**
 * Load project and append to req.
 */
function load(req, res, next) {
  Project.get(req.params.projectId)
    .then((project) => {
      req.project = project; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get project
 * @returns {Project}
 */
function get(req, res) {
  return res.json(req.project);
}


/**
 * Get projects by admin email
 * @returns {Project}
 */
function getByAdminEmail(req, res, next, email) {
  Project.getByAdminEmail(email)
    .then((project) => {
      req.project = project; // eslint-disable-line no-param-reassign
      return res.json(req.project);
    })
    .catch(e => next(e));
}

/**
 * Get projects by assignee's email
 * @returns {Project}
 */
function getByTasksAssigned(req, res, next, email) {
  Project.getByTasksAssigned(email)
    .then((project) => {
      req.project = project; // eslint-disable-line no-param-reassign
      return res.json(req.project);
    })
    .catch(e => next(e));
}

/**
 * Create new project
 * @property {string} req.body.ProjectName - The project name of project.
 * @property {string} req.body.Owner - The Owner of project.
 * @property {string} req.body.Closed - The Closed status of project.
 * @returns {Project}
 */
function create(req, res, next) {
  const project = new Project({
    projectName: req.body.projectName,
    description: req.body.description,
    owner: req.body.owner,
    createdOn: req.body.createdOn,
    isActive: req.body.isActive
  });

  project.save()
    .then(savedProject => res.json(savedProject))
    .catch(e => next(e));
}

/**
 * Update existing project
 * @property {string} req.body.ProjectName - The project name of project.
 * @property {string} req.body.description - The description of project.
 * @property {string} req.body.Owner - The Owner of project.
 * @property {string} req.body.Tasks - The Tasks of project.
 * @property {string} req.body.Closed - The Closed status of project.
 * @returns {Project}
 */
function update(req, res, next) {
  const project = req.project;
  if (req.body.projectName) {
    project.projectName = req.body.projectName;
  }
  if (req.body.description) {
    project.description = req.body.description;
  }
  if (req.body.owner) {
    project.owner = req.body.owner;
  }
  if (req.body.createdOn) {
    project.createdOn = req.body.createdOn;
  }
  if (req.body.isActive) {
    project.isActive = req.body.isActive;
  }
  if (req.body.tasks) {
    project.tasks.push(req.body.tasks);
  }
  project.save()
    .then(savedProject => res.json(savedProject))
    .catch(e => next(e));
}

/**
 * Get project list.
 * @property {number} req.query.skip - Number of projects to be skipped.
 * @property {number} req.query.limit - Limit number of projects to be returned.
 * @returns {Projects[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Project.list({ limit, skip })
    .then(projects => res.json(projects))
    .catch(e => next(e));
}

/**
 * Delete project.
 * @returns {Project}
 */
function remove(req, res, next) {
  Project.findByIdAndRemove(req.params.projectId)
    .then((deletedProject) => {
    // TODO: also need to remove all tasks under the project
      // TODO: remove all referenced projectBelongedTo
      const response = {
        message: 'Project is successfully deleted',
        id: deletedProject._id
      };
      res.status(200).send(response);
    })
    .catch(e => next(e));
}

export default { load, get, getByAdminEmail, getByTasksAssigned, create, update, list, remove };
