import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Task from './task.model'; // eslint-disable-line no-unused-vars
import User from './user.model'; // eslint-disable-line no-unused-vars
import APIError from '../helpers/APIError';

/**
 * Project Schema
 */
const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
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
ProjectSchema.method({});

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
      .populate('tasks')
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
  getByAdminEmail(email) {
    return this.find({ owner: email })
      .populate('tasks')
      .then((project) => {
        if (project) {
          return project;
        }
        const err = new APIError('No such project exists for this user!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List projects in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of projects to be skipped.
   * @param {number} limit - Limit number of projects to be returned.
   * @returns {Promise<Project[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate('tasks')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit);
  }
};

/**
 * @typedef Project
 */
export default mongoose.model('Project', ProjectSchema);
