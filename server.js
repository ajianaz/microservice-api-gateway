import Fastify from 'fastify'
import proxyMiddleware from './src/middlewares/ProxyMiddleware.js'
import authMiddleware from './src/middlewares/AuthMiddleware.js'
import accessMiddleware from './src/middlewares/AccessMiddleware.js'
import rateLimiter from './src/plugin/RateLimiter.js'
import corsPlugin from './src/plugin/cors.js'
import Multipart from './src/plugin/Multipart.js'
import helmetPlugin from './src/plugin/Helmet.js'
import formbody from '@fastify/formbody'
import dotenv from 'dotenv'
import UnderPressure from '@fastify/under-pressure'

// Tentukan file env berdasarkan NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local'

// Muat environment variables dari file yang sudah ditentukan
dotenv.config({ path: envFile })

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'
const LOGGER = process.env.LOGGER === 'true' // Konversi ke boolean
const MAX_SIZE_IN_MB = Number(process.env.MAX_SIZE_IN_MB) || 10

const fastify = Fastify({
  logger: LOGGER,
  bodyLimit: MAX_SIZE_IN_MB * 1024 * 1024
}) // Aktifkan logger

// Middleware Logging
fastify.addHook('onRequest', async (request, reply) => {
  console.log(`[REQUEST] ${request.method} ${request.url}`)
})

// Daftarkan plugin Helmet
await fastify.register(helmetPlugin)
await fastify.register(corsPlugin)
await fastify.register(rateLimiter)
await fastify.register(formbody)
await fastify.register(Multipart, {
  addToBody: true
})

await fastify.register(UnderPressure, {
  trustProxy: true
})

// Daftarkan parser untuk multipart (agar tidak menghasilkan error 415)
fastify.addContentTypeParser('*', async (req, payload) => {
  // Anda bisa menyimpan payload raw ke req.rawBody jika perlu
  req.rawBody = payload
  // req.file = payload
  return payload
})

// Middleware
fastify.addHook('onRequest', authMiddleware)
fastify.addHook('onRequest', accessMiddleware)

// Register Proxy Middleware
await fastify.register(proxyMiddleware)

// Start server
fastify.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
  console.log(`API Gateway running on ${address} 🚀`)
})
