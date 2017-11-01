import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Project from './project.model'; // eslint-disable-line no-unused-vars
import User from './user.model'; // eslint-disable-line no-unused-vars
import APIError from '../helpers/APIError';

/**
 * Task Schema
 */
const TaskSchema = new mongoose.Schema({
  taskName: String,
  content: String,
  notes: [{
    actor: String,
    verb: String,
    objectTask: String,
    comments: String,
    time: Date
  }],
  url: String,
  // assignees: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
  assignees: [String],
  createdOn: {
    type: Date,
    default: Date.now
  },
  percentage: Number,
  dueDate: Date,
  isActive: Boolean,
  completed: Boolean,
  priority: Number,
  projectBelonged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
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
TaskSchema.method({
});

/**
 * Statics
 */
TaskSchema.statics = {
  /**
   * Get task by id
   * @param {ObjectId} id - The objectId of task.
   * @returns {Promise<Task, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('projectBelonged')
      .then((task) => {
        if (task) {
          return task;
        }
        const err = new APIError('No such task exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Get tasks by ProjectId
   * @param (ObjectId} projectId - the ObjectId of project.
   * @returns {Promise<Task, APIError>}
   */
  getByProjectId(id) {
    return this.find({ projectBelonged: id })
      .then((task) => {
        if (task) {
          return task;
        }
        const err = new APIError('No such task for this project!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Get tasks by assignee(email)
   * @param (email) email - the email of assignees
   * @returns {Promise<Task, APIError>}
   */
  getByAssigneeEmail(email) {
    return this.find({ assignees: email })
      .then((task) => {
        if (task) {
          console.log(task);
          return task;
        }
        const err = new APIError('No such task for this project!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Get tasks by assignee(email) and projectId
   * @param (email) email, (id) id
   * @returns {Promise<Task, APIError>}
   */
  getByAssigneeProject(id, email) {
    return this.find({ projectBelonged: id }, { assignees: email })
      .then((task) => {
        if (task) {
          console.log('get by Assignee Project', task);
          return task;
        }
        const err = new APIError('No such task for this project!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdOn: -1 })
      .skip(+skip)
      .limit(+limit);
  }
};

/**
 * @typedef Task
 */
export default mongoose.model('Task', TaskSchema);
