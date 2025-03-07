// src/middlewares/ProxyMiddleware.js
import fastifyReplyFrom from '@fastify/reply-from'
import { getServiceDetails } from '../services/ServiceManager.js'
// import { checkAccess } from '../services/ApiManager.js';

export default async function proxyMiddleware(fastify) {
  fastify.register(fastifyReplyFrom)

  fastify.all(
    '/api/:service/*',
    {
      prefixTrailingSlash: 'both',
      // Nonaktifkan parsing body agar request tetap dalam bentuk stream mentah
      payload: {
        parse: false,
        output: 'stream'
      }
      //   config: { rawBody: true }
    },
    async (request, reply) => {
      console.log(
        `[PROXY] Incoming request for: /api/${request.params.service}`
      )

      try {
        const { service } = request.params
        const serviceDetails = await getServiceDetails(service)
        console.log(`[PROXY] Service Details:`, serviceDetails)

        if (serviceDetails.error) {
          console.log(`[PROXY] Service Error: ${serviceDetails.error}`)
          return reply.code(serviceDetails.status).send({
            success: false,
            message: serviceDetails.message || serviceDetails.error
          })
        }

        const targetUrl =
          serviceDetails.url + request.url.replace(`/api/${service}`, '')
        console.log(`[PROXY] Forwarding request to: ${targetUrl}`)

        if (request.headers['content-type'] && request.headers['content-type'].includes('application/x-www-form-urlencoded')) {
          // const serializedBody = JSON.stringify(request.body);
          return reply.from(targetUrl, {
            body: request.body,
            headers: {
              'content-type': 'application/json'
            }
          });
        }
        return reply.from(targetUrl)
      } catch (error) {
        console.error(`[PROXY] Error:`, error)
        return reply.code(500).send({
          success: false,
          message: error.message || 'Internal Server Error'
        })
      }
    }
  )
}
