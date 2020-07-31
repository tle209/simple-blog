/**
 * Build response message
 * @param {*} message
 */
const buildResponseMessage = (message) => {
    if (Array.isArray(message)) {
        return [{ code: message }];
    }
    return message;
};

/**
 * Response handler
 * @param {*} res
 * @param {*} next
 * @param {*} code
 * @param {*} response
 */
const respond = (res, code, response) => {
    const responseObject = {
        success: (code < 300),
        message: buildResponseMessage(response.message),
        pagination: response.pagination ? response.pagination : {},
        data: response.data,
        error_code: response.error_code
    };
    res.status(code);
    return res.send(responseObject);
};
module.exports = respond;
