// src/middleware/authMiddleware.js
import axios from "axios";

export default async function authMiddleware(request, reply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        request.user = null; // Tidak wajib login
        return;
    }

    try {
        const token = authHeader.split(" ")[1];
        const response = await axios.get("http://keycloak-server/validate", {
            headers: { Authorization: `Bearer ${token}` },
        });

        request.user = response.data;
    } catch (error) {
        reply.code(401).send({ success: false, message: "Invalid token" });
    }
}
