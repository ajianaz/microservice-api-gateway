// src/middleware/accessMiddleware.js
import axios from "axios";

export default async function accessMiddleware(request, reply) {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
        request.apiAccess = null; // Tidak wajib API Key
        return;
    }

    try {
        const response = await axios.get("http://api-manager/validate", {
            headers: { "x-api-key": apiKey },
        });

        request.apiAccess = response.data;
    } catch (error) {
        reply.code(403).send({ success: false, message: "Invalid API Key" });
    }
}
