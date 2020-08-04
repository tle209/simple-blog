const { isEmpty } = require('lodash');
const mongoose = require('mongoose');
const Comments = require('../models/comments');
const Posts = require('../models/posts');
const { pagination } = require('../config');
const respond = require('../utils/responses');
const { validateComment } = require('../utils/validator');
const logger = require('../utils/logger');
const responseCode = require('../const/responseCode');
const responseMessage = require('../const/responseMessages');

/**
 * Create Comment handler
 * @param {*} req
 * @param {*} res
 */
const createComment = async (req, res) => {
    const comment = { ...req.body };
    const { postId } = req.params;
    const validateResults = validateComment(comment);
    if (!isEmpty(validateResults)) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: validateResults
            });
    }
    // Start transaction
    const session = await Comments.startSession();
    session.startTransaction();
    try {
        const post = await Posts.findOne({ _id: new mongoose.Types.ObjectId(postId) });
        if (isEmpty(post)) {
            return respond(res, responseCode.BAD_REQUEST_CODE,
                {
                    error_code: responseCode.BAD_REQUEST_CODE,
                    message: responseMessage.POST_NOT_FOUND
                });
        }
        const commentResponse = await Comments.create({ post: new mongoose.Types.ObjectId(postId), ...comment });
        // eslint-disable-next-line no-underscore-dangle
        post.comments.push(commentResponse._id);
        await Posts.update({ _id: new mongoose.Types.ObjectId(postId) }, post);
        // Submit transaction: successful case
        await session.commitTransaction();
        session.endSession();
        return respond(res, responseCode.CREATED_CODE,
            {
                message: responseMessage.SUCCESS,
                data: commentResponse
            });
    } catch (error) {
        // Rollback transaction: Failure case
        await session.abortTransaction();
        session.endSession();
        logger.error(error);
        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

/**
 * Update Comment handler
 * @param {*} req
 * @param {*} res
 */
const updateComment = async (req, res) => {
    const comment = { ...req.body };
    const { postId, commentId } = req.params;
    const validateResults = validateComment(comment);
    if (!isEmpty(validateResults)) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: validateResults
            });
    }
    try {
        const response = await Comments.update({ _id: new mongoose.Types.ObjectId(commentId), postId }, comment);
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
 * Get Comment handler
 * @param {*} req
 * @param {*} res
 */
const getComments = async (req, res) => {
    const { limit = pagination.limit, page = 0 } = req.query;
    if (!page) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: [{ code: responseMessage.PARAMS_IS_MISSING, field: 'page' }]
            });
    }
    try {
        const skip = limit * (page - 1);
        const [responses, count] = await Promise.all([
            Comments.find({})
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(parseInt(limit, 10)),
            Comments.count({})
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
 * Delete Comment handler
 * @param {*} req
 * @param {*} res
 */
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        return respond(res, responseCode.BAD_REQUEST_CODE,
            {
                error_code: responseCode.BAD_REQUEST_CODE,
                message: [{ code: responseMessage.PARAMS_IS_MISSING, field: 'commentId' }]
            });
    }
    try {
        await Comments.deleteOne({ _id: new mongoose.Types.ObjectId(commentId) });
        return respond(res, responseCode.SUCCEEDED_CODE, { message: responseMessage.SUCCESS });
    } catch (error) {
        logger.error(error);
        return respond(res, responseCode.UNEXPECTED_ERROR_CODE,
            {
                error_code: responseCode.UNEXPECTED_ERROR_CODE,
                message: responseMessage.CONTACT_ADMIN
            });
    }
};

module.exports = {
    createComment,
    updateComment,
    getComments,
    deleteComment
};
