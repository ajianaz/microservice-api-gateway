// src/routes/proxy.routes.js
import ProxyController from "../controllers/ProxyController.js";

export default async function proxyRoutes(fastify) {
    fastify.get("/api/:service", async (req, reply) => {
        const controller = new ProxyController();
        return controller.proxyRequest(req, reply);
    });
}
