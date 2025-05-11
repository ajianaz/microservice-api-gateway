// src/plugin/Cors.js
import fastifyCors from '@fastify/cors'

export default async function corsPlugin(fastify) {
  const corsOptions = {
    origin: '*', // Mengizinkan semua origin atau tentukan origin tertentu
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Bearer',
      'unixtime',
      'gateway_key',
      'x-api-key',
      'api_access_token'
    ],
    credentials: true // Mengizinkan kredensial
  }
  await fastify.register(fastifyCors, corsOptions)
}
