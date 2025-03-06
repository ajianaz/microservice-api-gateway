// src/utils/RateLimiter.js
import fastifyRateLimit from "@fastify/rate-limit";

export default async function rateLimiter(fastify) {
    await fastify.register(fastifyRateLimit, {
        max: 100, // Maksimal 100 request
        timeWindow: "1 minute", // Dalam waktu 1 menit
        errorResponseBuilder: (request, context) => {
            return {
                success: false,
                message: "Too many requests, please try again later.",
            };
        },
    });
}
