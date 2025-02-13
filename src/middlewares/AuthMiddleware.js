import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const KEYCLOAK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\n${process.env.KEYCLOAK_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

/**
 * Middleware for authenticating requests using Keycloak JWT tokens.
 */
export default async function authMiddleware(request, reply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        request.user = null; // Allow unauthenticated access
        return;
    }

    try {
        const token = authHeader.split(" ")[1];

        // Validate token locally with JWT
        const decoded = jwt.verify(token, KEYCLOAK_PUBLIC_KEY, { algorithms: ["RS256"] });

        request.user = {
            id: decoded.sub,
            username: decoded.preferred_username,
            email: decoded.email,
            roles: decoded.realm_access?.roles || [],
        };
    } catch (error) {
        console.error("Invalid Token:", error.message);
        return reply.code(401).send({ success: false, message: "Invalid or expired token" });
    }
}
