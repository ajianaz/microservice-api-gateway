import Fastify from 'fastify'
import dotenv from 'dotenv'

// 🔹 Middleware
import blacklistMiddleware from './src/middlewares/blacklist.js'
import proxyMiddleware from './src/middlewares/ProxyMiddleware.js'
import authMiddleware from './src/middlewares/AuthMiddleware.js'
import accessMiddleware from './src/middlewares/AccessMiddleware.js'

// 🔹 Plugins
import rateLimiter from './src/plugin/RateLimiter.js'
import corsPlugin from './src/plugin/cors.js'
import Multipart from './src/plugin/Multipart.js'
import helmetPlugin from './src/plugin/Helmet.js'
import formbody from '@fastify/formbody'
import UnderPressure from '@fastify/under-pressure'

// 🔹 Load the `.env` file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local'
dotenv.config({ path: envFile }) // Load environment variables

// 🔹 Fastify Configuration
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'
const LOGGER = process.env.LOGGER === 'true' // Convert to boolean
const MAX_SIZE_IN_MB = Number(process.env.MAX_SIZE_IN_MB) || 10

const fastify = Fastify({
  logger: LOGGER,
  bodyLimit: MAX_SIZE_IN_MB * 1024 * 1024
})

// =========================
//  🔹 REGISTER PLUGINS
// =========================
await Promise.all([
  fastify.register(helmetPlugin), // Security: Prevent common attacks
  fastify.register(corsPlugin), // Allow cross-origin requests
  fastify.register(rateLimiter), // Prevent request spamming
  fastify.register(UnderPressure, { trustProxy: true }), // Monitor server health
  fastify.register(formbody), // Parse x-www-form-urlencoded requests
  fastify.register(Multipart, { addToBody: true }), // Parse multipart/form-data
  fastify.register(proxyMiddleware) // Middleware for proxying requests to microservices
])

// =========================
//  🔹 REGISTER MIDDLEWARE (onRequest Hook)
// =========================
fastify.addHook('onRequest', blacklistMiddleware) // 🚨 Block requests from blacklisted IPs first
fastify.addHook('onRequest', authMiddleware) // 🔑 Validate user authentication
fastify.addHook('onRequest', accessMiddleware) // 🔐 Ensure user has access permissions

// =========================
//  🔹 REGISTER CONTENT TYPE PARSER (Optional)
// =========================
fastify.addContentTypeParser('*', async (req, payload) => {
  req.rawBody = payload
  return payload
})

// =========================
//  🔹 START SERVER
// =========================
fastify.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
  console.log(`API Gateway running on ${address} 🚀`)
})
