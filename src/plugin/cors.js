// src/plugin/Cors.js
import fastifyCors from '@fastify/cors'

export default async function corsPlugin(fastify) {
  const corsOptions = {
    origin: '*', // Izinkan akses dari semua domain
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders:
      'Content-Type,Authorization,Bearer,unixtime,gateway_key,x-api-key,api_access_token'
  }
  // Daftarkan plugin CORS
  await fastify.register(fastifyCors, corsOptions)
}
