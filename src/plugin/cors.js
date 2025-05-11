// src/plugin/Cors.js
import fastifyCors from '@fastify/cors'

export default async function corsPlugin(fastify) {
  await fastify.register(fastifyCors, {
    origin: '*', // Mengizinkan semua origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Authorization',
      'Bearer',
      'unixtime',
      'gateway_key',
      'x-api-key',
      'api_access_token'
    ],
    credentials: false, // Tidak mengizinkan kredensial
    strictPreflight: true, // Memastikan permintaan preflight memiliki header yang benar
    optionsSuccessStatus: 204, // Status sukses untuk permintaan OPTIONS
    preflightContinue: false, // Tidak meneruskan permintaan preflight ke handler berikutnya
    maxAge: 86400 // Menyimpan hasil preflight selama 24 jam
  })
}
