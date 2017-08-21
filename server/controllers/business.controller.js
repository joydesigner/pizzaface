import Business from '../models/business.model';

/**
 * Load Business and append to req.
 */
function load(req, res, next, id) {
  Business.get(id)
    .then((business) => {
      req.business = business; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Business
 * @returns {Business}
 */
function get(req, res) {
  return res.json(req.business);
}

/**
 * Create new Business
 * @property {string} req.body.BizName - The name of business.
 * @returns {Business}
 */
function create(req, res, next) {
  const business = new Business({
    BizName: req.body.BizName
  });

  business.save()
    .then(savedBusiness => res.json(savedBusiness))
    .catch(e => next(e));
}

/**
 * Update existing business
 * @property {string} req.body.BizName The name of business.
 * @returns {Business}
 */
function update(req, res, next) {
  const business = req.business;
  business.BizName = req.body.BizName;

  business.save()
    .then(savedBusiness => res.json(savedBusiness))
    .catch(e => next(e));
}

/**
 * Get Business list.
 * @property {number} req.query.skip - Number of tasks to be skipped.
 * @property {number} req.query.limit - Limit number of tasks to be returned.
 * @returns {Business[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Business.list({ limit, skip })
    .then(business => res.json(business))
    .catch(e => next(e));
}

/**
 * Delete business.
 * @returns {Business}
 */
function remove(req, res, next) {
  const business = req.business;
  business.remove()
    .then(deletedBusiness => res.json(deletedBusiness))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
