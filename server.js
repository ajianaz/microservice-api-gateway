import Fastify from "fastify";
import proxyMiddleware from "./src/middlewares/ProxyMiddleware.js";
import authMiddleware from "./src/middlewares/AuthMiddleware.js";
import accessMiddleware from "./src/middlewares/AccessMiddleware.js";
import rateLimiter from "./src/utils/RateLimiter.js";
import dotenv from "dotenv";

// Tentukan file env berdasarkan NODE_ENV
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";

// Muat environment variables dari file yang sudah ditentukan
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const LOGGER = process.env.LOGGER === "true"; // Konversi ke boolean

const fastify = Fastify({ logger: LOGGER }); // Aktifkan logger

// Middleware Logging
fastify.addHook("onRequest", async (request, reply) => {
    console.log(`[REQUEST] ${request.method} ${request.url}`);
});

// Middleware
fastify.addHook("onRequest", authMiddleware);
fastify.addHook("onRequest", accessMiddleware);
fastify.register(rateLimiter);

// Register Proxy Middleware
fastify.register(proxyMiddleware);

// Start server
fastify.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
    console.log(`API Gateway running on ${address} 🚀`);
});
