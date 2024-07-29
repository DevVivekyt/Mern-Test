const createSuccessResponse = (message, result) => {
    return {
        status: 1,
        message,
        result,
    };
};

const createErrorResponse = (message, error = null) => {
    return {
        status: 0,
        message,
        error: error ? error.message : undefined,
    };
};
module.exports = { createSuccessResponse, createErrorResponse };
