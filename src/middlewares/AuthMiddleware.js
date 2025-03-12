import fs from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local'
dotenv.config({ path: envFile })

const KEYCLOAK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\n${process.env.KEYCLOAK_PUBLIC_KEY.replace(
  /\\n/g,
  '\n'
)}\n-----END PUBLIC KEY-----`

/**
 * Middleware for authenticating requests using Keycloak JWT tokens or API keys.
 */
export default async function authMiddleware(request, reply) {
  const authHeader = request.headers.authorization || ''
  const forceAuth = process.env.FORCE_AUTH === 'true' // Convert to boolean

  console.log(`ENV Auth: ${process.env.FORCE_AUTH}`)
  console.log(`Force Auth: ${forceAuth}`)

  // Extract token from Authorization header (if present)
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader

  // If FORCE_AUTH is enabled, authentication is required
  if (forceAuth && !token) {
    return reply
      .code(401)
      .send({ success: false, message: 'Authentication required' })
  }

  try {
    if (token.startsWith('adk_')) {
      // Handle API Key authentication
      const apikey = token.substring(4)
      console.log(`API Key: ${apikey}`)

      // Read the API key list file asynchronously
      const apikeyFilePath = path.join(
        process.cwd(),
        'src/config/apikey-list.json'
      )
      const data = await fs.readFile(apikeyFilePath, 'utf8')
      const apikeyList = JSON.parse(data).apikey_list

      if (!apikeyList.includes(apikey)) {
        return reply.code(403).send({
          success: false,
          message: 'Access forbidden: Invalid API key'
        })
      }

      request.user = { apiKey: apikey } // Store API key info in request.user
    } else if (token) {
      // Handle JWT Authentication
      const decodedToken = jwt.decode(token, { complete: true })
      if (!decodedToken) {
        throw new Error('Malformed JWT token')
      }

      // Verify JWT signature using Keycloak public key
      const decoded = jwt.verify(token, KEYCLOAK_PUBLIC_KEY, {
        algorithms: ['RS256']
      })
      console.log('Decoded JWT:', decoded)

      request.user = {
        id: decoded.sub,
        username: decoded.preferred_username,
        email: decoded.email,
        roles: decoded.realm_access?.roles || []
      }
    } else if (forceAuth) {
      // If FORCE_AUTH is enabled, reject unauthenticated access
      return reply
        .code(401)
        .send({ success: false, message: 'Authentication required' })
    } else {
      // If FORCE_AUTH is disabled, allow access without authentication
      request.user = null
    }
  } catch (error) {
    console.error('Authentication Error:', error.message)
    return reply
      .code(401)
      .send({ success: false, message: 'Invalid or expired authentication' })
  }
}
