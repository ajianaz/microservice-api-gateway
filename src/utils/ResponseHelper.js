// src/utils/ResponseHelper.js

export function resSuccess(reply, data, statusCode = 200) {
    return reply.code(statusCode).send({
        success: true,
        message: "Success",
        data,
    });
}

export function resError(reply, error, statusCode = 500) {
    return reply.code(statusCode).send({
        success: false,
        message: error.message || "Internal Server Error",
        data: null,
    });
}
