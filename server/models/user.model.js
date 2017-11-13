import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Business from './business.model'; // eslint-disable-line no-unused-vars

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // business: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Business'
  // }],
  business: String,
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'MANAGER'],
    default: 'USER'
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
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId}
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      // .populate('business')
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Get user by email address
   * @param {email}
   * @returns {Promise<User, APIError>}
   */
  getByEmail(mail) {
    return this.findOne({ email: mail })
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
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
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit);
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
