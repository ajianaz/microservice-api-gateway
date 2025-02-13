// src/controllers/BaseController.js
class BaseController {
    resSuccess(reply, data, statusCode = 200) {
        return reply.code(statusCode).send({ success: true, data });
    }

    resError(reply, error, statusCode = 500) {
        return reply.code(statusCode).send({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

export default BaseController;