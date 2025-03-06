// src/plugin/Helmet.js
import helmet from '@fastify/helmet'

export default async function helmetPlugin(fastify) {
  await fastify.register(helmet, {
    // Security Headers
    hidePoweredBy: true,
    noSniff: true,
    frameguard: { action: 'deny' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'no-referrer' },
    // (opsional)
    dnsPrefetchControl: { allow: false },
    expectCt: { enforce: true, maxAge: 86400 }
  })
}
