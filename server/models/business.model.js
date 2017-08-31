import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * Business Schema
 */
const BusinessSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true
  },
  description: String
});

/**
 * Methods
 */
BusinessSchema.method({
});

/**
 * Statics
 */
BusinessSchema.statics = {
  /**
   * Get project
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<Project, APIError>}
   */
  get(id) {
    return this.findById(id)
      .then((business) => {
        if (business) {
          return business;
        }
        const err = new APIError('No such business exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List business in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of business to be skipped.
   * @param {number} limit - Limit number of business to be returned.
   * @returns {Promise<biz[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit);
  }
};

/**
 * @typedef User
 */
export default mongoose.model('Business', BusinessSchema);
