// src/routes/proxy.routes.js
import ProxyController from "../controllers/ProxyController.js";

export default async function proxyRoutes(fastify) {
    fastify.get("/:service/*", ProxyController.proxyRequest);
}
