import { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
}

const BASE_DIR = path.join(process.cwd(), 'public', 'mobilevr')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params

  if (pathSegments.some(seg => seg === '..' || seg.includes('\0'))) {
    return new Response('Forbidden', { status: 403 })
  }

  const filePath = path.join(BASE_DIR, ...pathSegments)
  const resolved = path.resolve(filePath)

  if (!resolved.startsWith(path.resolve(BASE_DIR))) {
    return new Response('Forbidden', { status: 403 })
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return new Response('Not Found', { status: 404 })
  }

  const ext = path.extname(resolved).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'
  const fileBuffer = fs.readFileSync(resolved)

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
