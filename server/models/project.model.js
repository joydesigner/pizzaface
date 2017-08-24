import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Task from './task.model';
import APIError from '../helpers/APIError';

/**
 * Project Schema
 */
const ProjectSchema = new mongoose.Schema({
  ProjectName: String,
  Owner: String,
  Closed: Boolean,
  Tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: Task }]
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ProjectSchema.method({
});

/**
 * Statics
 */
ProjectSchema.statics = {
  /**
   * Get project
   * @param {ObjectId} id - The objectId of project.
   * @returns {Promise<Project, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((project) => {
        if (project) {
          return project;
        }
        const err = new APIError('No such project exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get project by owner
   * @param {Owner} email - The email of project Owner.
   * @returns {Promise<Project, APIError>
   */
  getByEmail(email) {
    return this.find({ Owner: email });
  },

  /**
   * List projects in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of projects to be skipped.
   * @param {number} limit - Limit number of projects to be returned.
   * @returns {Promise<Project[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Project
 */
export default mongoose.model('Project', ProjectSchema);
