const responseMessage = require('./responseMessages');

module.exports = {
    required: responseMessage.FIELD_IS_REQUIRED_CODE,
    string: responseMessage.FIELD_IS_INVALID_TYPE_CODE,
    stringEmpty: responseMessage.FIELD_IS_REQUIRED_CODE,
    stringMin: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
    stringMax: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
    stringLength: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
    stringPattern: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    stringContains: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    stringEnum: responseMessage.FIELD_IS_INVALID_VALUE_CODE,

    number: responseMessage.FIELD_IS_INVALID_TYPE_CODE,
    numberMin: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    numberMax: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    numberEqual: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    numberNotEqual: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    numberInteger: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    numberPositive: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    numberNegative: responseMessage.FIELD_IS_INVALID_VALUE_CODE,

    array: responseMessage.FIELD_IS_INVALID_TYPE_CODE,
    arrayEmpty: responseMessage.FIELD_IS_REQUIRED_CODE,
    arrayMin: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
    arrayMax: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
    arrayLength: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
    arrayContains: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    arrayEnum: responseMessage.FIELD_IS_INVALID_VALUE_CODE,

    boolean: responseMessage.FIELD_IS_INVALID_TYPE_CODE,

    function: responseMessage.FIELD_IS_INVALID_TYPE_CODE,

    date: responseMessage.FIELD_IS_INVALID_TYPE_CODE,
    dateMin: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    dateMax: responseMessage.FIELD_IS_INVALID_VALUE_CODE,

    forbidden: responseMessage.FIELD_IS_INVALID_TYPE_CODE,

    email: responseMessage.FIELD_IS_INVALID_TYPE_CODE,

    nameValue: responseMessage.FIELD_IS_INVALID_VALUE_CODE,
    nameLength: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,

    phone: responseMessage.FIELD_IS_INVALID_VALUE_CODE,

    // Password response code
    passwordRequire: responseMessage.FIELD_IS_REQUIRED_CODE,
    passwordLength: responseMessage.FIELD_IS_INVALID_LENGTH_CODE,
};
