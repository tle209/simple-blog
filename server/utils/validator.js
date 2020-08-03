const Validator = require('fastest-validator');
const { isEmpty } = require('lodash');
const logger = require('./logger');
const convertResponseCode = require('../const/convertResponseCode');
const { validateConfig } = require('../config');

/**
 * Create new validator instance
 */
const validator = new Validator();

/**
 * Validate for name
 * Excluded: all special characters
 * Min: 3
 * Max: 100
 */
validator.add('name', (value) => { // Register a custom name type
    if (value.length < validateConfig.name.min || value.length > validateConfig.name.max) {
        return validator.makeError('nameLength', null, value);
    }
  const regex = /[$&+,:;=?@#|<>\-^*()%!`{}~\\\/_"]/gm; // eslint-disable-line
    if (isEmpty(value.match(regex))) { return true; }
    return validator.makeError('nameValue', null, value);
});

/**
 * Validate for phone number
 * Length: 10
 * Viettel: 09, 03
 * MobiFone: 09, 07
 * VinaPhone: 09, 08
 * Vietnamobile and Gmobile: 09, 05
 */
validator.add('phone', (value) => { // Register a custom email type
    const phoneRegex = /(([+(84)]{3})+(9|3|7|8|5)+([0-9]{8})\b)|((09|03|07|08|05)+([0-9]{8})\b)/i;
    if (value.match(phoneRegex)) {
        return true;
    }
    return validator.makeError('phone', null, value);
});

/**
 * Validate for email
 */
validator.add('email', (value) => { // Register a custom email type
    const emailRegex = /^[a-z0-9]+(?:\.[a-z0-9]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (value.match(emailRegex)) {
        return true;
    }
    return validator.makeError('email', null, value);
});

/**
 * Validate for phone number
 * Length: 10
 * Viettel: 09, 03
 * MobiFone: 09, 07
 * VinaPhone: 09, 08
 * Vietnamobile and Gmobile: 09, 05
 */
validator.add('phone', (value) => { // Register a custom email type
    const phoneRegex = /(([+(84)]{3})+(9|3|7|8|5)+([0-9]{8})\b)|((09|03|07|08|05)+([0-9]{8})\b)/i;
    if (value.match(phoneRegex)) {
        return true;
    }
    return validator.makeError('phone', null, value);
});

/**
 * Build output errors
 * @param {*} errors
 */
const buildValidateError = (errors) => {
    const returnErrors = errors.map((error) => ({
        code: convertResponseCode[error.type],
        field: error.field
    }));
    logger.debug('returnErrors', returnErrors);
    return returnErrors;
};

/**
 * Validate input data
 * @param {*} fields
 * @param {*} schema
 */
const validate = (fields, schema) => {
    let results = validator.validate(fields, schema);
    if (results && results.length) {
        results = buildValidateError(results);
    }
    logger.debug('validate result:', results);
    return results;
};

const validatePost = (item) => validate(item, {
    title: {
        type: 'string', empty: false, min: 10, max: 255
    },
    body: {
        type: 'string', empty: false, min: 100
    },
    author: {
        type: 'string', empty: false, min: 2, max: 255
    },
});

module.exports = {
    validatePost
};
