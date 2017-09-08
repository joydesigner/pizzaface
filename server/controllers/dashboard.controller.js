import Project from '../models/project.model';
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
 * @returns {Dashboard}
 */

function get(req, res) {
  return res.json(req.projects);
}

export default { load, get };
