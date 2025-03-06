// src/plugin/Multipart.js
import fastifyMultipart from '@fastify/multipart'
import dotenv from 'dotenv'

// Tentukan file env berdasarkan NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local'

// Muat environment variables dari file yang sudah ditentukan
dotenv.config({ path: envFile })

// Pastikan MAX_SIZE_IN_MB dikonversi ke number
const MAX_SIZE_IN_MB = Number(process.env.MAX_SIZE_IN_MB) || 10

export default async function Multipart(fastify) {
  // Daftarkan plugin Multipart untuk menangani file upload
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_SIZE_IN_MB * 1024 * 1024 // Batas maksimal file dalam byte (contoh: 10 MB)
    }
    // Opsi lain dapat disesuaikan
  })
}
