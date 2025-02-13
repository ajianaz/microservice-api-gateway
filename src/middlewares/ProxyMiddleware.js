// src/middlewares/ProxyMiddleware.js
import fastifyReplyFrom from "@fastify/reply-from";
import { getServiceDetails } from "../services/ServiceManager.js";
import { checkAccess } from "../services/ApiManager.js";

export default async function proxyMiddleware(fastify) {
    fastify.register(fastifyReplyFrom);

    fastify.all("/api/:service/*", { prefixTrailingSlash: "both" }, async (request, reply) => {
        console.log(`[PROXY] Incoming request for: /api/${request.params.service}`);

        try {
            const { service } = request.params;
            const serviceDetails = await getServiceDetails(service);

            console.log(`[PROXY] Service Details:`, serviceDetails);

            // Handle service errors (not found, down, or maintenance)
            if (serviceDetails.error) {
                console.log(`[PROXY] Service Error: ${serviceDetails.error}`);
                return reply.code(serviceDetails.status).send({
                    success: false,
                    message: serviceDetails.message || serviceDetails.error,
                });
            }

            // Check Access Control (API Manager)
            // const accessGranted = await checkAccess(request.user, service);
            // if (!accessGranted) {
            //     console.log(`[PROXY] Access Denied for service: ${service}`);
            //     return reply.code(403).send({
            //         success: false,
            //         message: "Forbidden",
            //     });
            // }

            // 🔥 Perbaiki path tujuan
            const targetUrl = serviceDetails.url + request.url.replace(`/api/${service}`, "");

            console.log(`[PROXY] Forwarding request to: ${targetUrl}`);

            // Forward request to the target service
            return reply.from(targetUrl, {
                // rewriteRequestHeaders: (headers) => {
                //     headers["X-Forwarded-For"] = request.ip;
                //     return headers;
                // },
            });
        } catch (error) {
            console.error(`[PROXY] Error:`, error);
            return reply.code(500).send({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    });
}
