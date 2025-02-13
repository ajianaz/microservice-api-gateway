// src/controllers/BaseController.js
export default class BaseController {
    resSuccess(reply, data, message = "Success") {
        return reply.send({ success: true, message, data });
    }

    resError(reply, error, statusCode = 500) {
        return reply.status(statusCode).send({ success: false, message: error.message || "An error occurred" });
    }
}
