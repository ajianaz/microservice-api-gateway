import fs from 'fs/promises'
import path from 'path'

export default async function blacklistMiddleware(request, reply) {
  try {
    // Path ke file blacklist.json
    const blacklistFilePath = path.join(
      process.cwd(),
      'src/config/blacklist.json'
    )

    // Membaca file secara asynchronous
    const data = await fs.readFile(blacklistFilePath, 'utf8')
    const blacklistIPs = JSON.parse(data).blacklist_ips

    // Mengambil IP dari berbagai sumber
    const clientIP =
      request.headers['cf-connecting-ip'] || // Cloudflare
      request.headers['x-forwarded-for']?.split(',')[0].trim() || // Reverse Proxy (ambil IP pertama)
      request.ip

    // Cek apakah IP ada dalam blacklist
    if (blacklistIPs.includes(clientIP)) {
      console.warn(`Blocked Access: ${clientIP}`)
      return reply.code(403).send({ message: 'Access forbidden' })
    }

    // Logging akses normal
    console.log(
      `Access From: IP ${clientIP} - CF ${
        request.headers['x-forwarded-for'] || 'N/A'
      }`
    )
    console.log(`[REQUEST] ${request.method} ${request.url}`)
  } catch (error) {
    console.error('Error reading blacklist file:', error)
    return reply.code(500).send({ message: 'Internal Server Error' })
  }
}
