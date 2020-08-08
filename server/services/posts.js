const { isEmpty } = require('lodash');
const mongoose = require('mongoose');
const Posts = require('../models/posts');
const Comments = require('../models/comments');
const { pagination } = require('../config');
const respond = require('../utils/responses');
const { validatePost } = require('../utils/validator');
const logger = require('../utils/logger');
const responseCode = require('../const/responseCode');
const responseMessage = require('../const/responseMessages');

/**
 * Create post handler
 * @param {*} req
 * @param {*} res
 */
const createPost = async (req, res) => {
    const post = { ...req.body };
    const validateResults = validatePost(post);
    if (!isEmpty(validateResults)) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: validateResults
            });
    }
    try {
        const response = await Posts.create(post);
        return respond(res, responseCode.CREATED_CODE,
            {
                message: responseMessage.SUCCESS,
                data: response
            });
    } catch (error) {
        logger.error(error);
        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

/**
 * Update post handler
 * @param {*} req
 * @param {*} res
 */
const updatePost = async (req, res) => {
    const post = { ...req.body };
    const { postId } = req.params;
    console.log('req.body', req.body);
    const validateResults = validatePost(post);
    if (!isEmpty(validateResults)) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: validateResults
            });
    }
    try {
        const response = await Posts.update({ _id: new mongoose.Types.ObjectId(postId) }, post);
        return respond(res, responseCode.SUCCEEDED_CODE,
            {
                message: responseMessage.SUCCESS,
                data: response
            });
    } catch (error) {
        logger.error(error);
        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

/**
 * Get posts handler
 * @param {*} req
 * @param {*} res
 */
const getPosts = async (req, res) => {
    const { limit = pagination.limit, page = 0 } = req.query;
    if (!+page) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: [{ code: responseMessage.PARAMS_IS_MISSING, field: 'page' }]
            });
    }
    try {
        const [responses, count] = await Promise.all([
            Posts.find({})
                .sort({ updatedAt: -1 })
                .skip(limit * (page - 1))
                .limit(parseInt(limit, 10)),
            Posts.count({})
        ]);
        return respond(res, responseCode.SUCCEEDED_CODE,
            {
                message: responseMessage.SUCCESS,
                pagination: {
                    page: +page,
                    limit: +limit || pagination.limit,
                    total: count
                },
                data: responses
            });
    } catch (error) {
        logger.error(error);
        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

/**
 * Get single post handler
 * @param {*} req
 * @param {*} res
 */
const getPost = async (req, res) => {
    const { postId } = req.params;
    const { limit = pagination.limit, page = 0 } = req.query;
    if (!+page) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: [{ code: responseMessage.PARAMS_IS_MISSING, field: 'page' }]
            });
    }
    try {
        const response = await Posts
            .findOne({ _id: new mongoose.Types.ObjectId(postId) })
            .populate(
                {
                    path: 'comments',
                    model: 'Comments',
                    options: {
                        sort: { updatedAt: 1 },
                        skip: +limit * (+page - 1),
                        limit
                    },
                }
            )
            .populate('totalComments');

        return respond(res, responseCode.SUCCEEDED_CODE,
            {
                message: responseMessage.SUCCESS,
                pagination: {
                    page: +page,
                    limit: +limit || pagination.limit,
                    total: response.totalComments
                },
                data: response
            });
    } catch (error) {
        logger.error(error);
        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

/**
 * Delete post handler
 * @param {*} req
 * @param {*} res
 */
const deletePost = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: [{ code: responseMessage.PARAMS_IS_MISSING, field: 'postId' }]
            });
    }
    let session;
    try {
        // Start transaction
        session = await Posts.startSession();
        session.startTransaction();

        await Posts.deleteOne({ _id: new mongoose.Types.ObjectId(postId) });
        await Comments.deleteMany({ post: postId });

        // Submit transaction: successful case
        await session.commitTransaction();
        session.endSession();

        return respond(res, responseCode.SUCCEEDED_CODE, { message: responseMessage.SUCCESS });
    } catch (error) {
        logger.error(error);

        // Rollback transaction: Failure case
        await session.abortTransaction();
        session.endSession();

        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost
};
