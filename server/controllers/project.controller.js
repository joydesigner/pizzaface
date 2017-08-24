import Project from '../models/project.model';

/**
 * Load project and append to req.
 */
function load(req, res, next, id) {
  Project.get(id)
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
 * Create new project
 * @property {string} req.body.ProjectName - The project name of project.
 * @property {string} req.body.Owner - The Owner of project.
 * @property {string} req.body.Closed - The Closed status of project.
 * @returns {Project}
 */
function create(req, res, next) {
  const project = new Project({
    ProjectName: req.body.ProjectName,
    Owner: req.body.Owner,
    Closed: req.body.Closed
  });

  project.save()
    .then(savedProject => res.json(savedProject))
    .catch(e => next(e));
}

/**
 * Update existing project
 * @property {string} req.body.ProjectName - The project name of project.
 * @property {string} req.body.Owner - The Owner of project.
 * @property {string} req.body.Tasks - The Tasks of project.
 * @property {string} req.body.Closed - The Closed status of project.
 * @returns {Project}
 */
function update(req, res, next) {
  const project = req.project;
  if (req.body.ProjectName) {
    project.ProjectName = req.body.ProjectName;
  }
  if (req.body.Owner) {
    project.Owner = req.body.Owner;
  }
  if (req.body.Closed) {
    project.Closed = req.body.Closed;
  }
  if (req.body.Tasks) {
    project.Tasks = req.body.Tasks;
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
  const project = req.project;
  project.remove()
    .then(deletedProject => res.json(deletedProject))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
