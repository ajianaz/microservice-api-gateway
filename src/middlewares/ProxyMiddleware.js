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
      // Hanya contoh: proses multipart untuk membangun ulang payload jika diperlukan.
      if (request.headers['content-type']?.includes('multipart/form-data')) {
        console.log(request.body)
        // const parts = request.parts()
        // for await (const part of parts) {
        //   console.log(
        //     `Field/File: ${part.fieldname}`,
        //     part.filename ? `File: ${part.filename}` : ''
        //   )
        //   // Lakukan proses sesuai kebutuhan...
        // }
      }

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
        // console.log(`${request.body}`)
        // const parts = request.parts()
        // for await (const part of parts) {
        //   if (part.type === 'file') {
        //     console.log(`Received file: ${part.filename}`)
        //     // Anda bisa menggunakan part.toBuffer() atau memproses stream
        //   } else {
        //     console.log(`Received field: ${part.fieldname} = ${part.value}`)
        //   }
        // }

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
