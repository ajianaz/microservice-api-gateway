import Fastify from "fastify";
import proxyRoutes from "./src/routes/proxy.routes.js";
import authMiddleware from "./src/middlewares/AuthMiddleware.js";
import accessMiddleware from "./src/middlewares/AccessMiddleware.js";
import rateLimiter from "./src/utils/RateLimiter.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const LOGGER = process.env.LOGGER === "true"; // Konversi ke boolean

const fastify = Fastify({ logger: LOGGER });

// Middleware
fastify.addHook("onRequest", authMiddleware);
fastify.addHook("onRequest", accessMiddleware);
fastify.register(rateLimiter);

// Register Routes
fastify.register(proxyRoutes);

// Start server
fastify.listen({ port: PORT, host: HOST }, () => {
    console.log(`API Gateway running on http://${HOST}:${PORT} 🚀`);
});
