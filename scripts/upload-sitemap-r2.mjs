#!/usr/bin/env node
/**
 * Upload sitemap.xml to R2 static hosting (allworld-sites)
 * Usage: node scripts/upload-sitemap-r2.mjs
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const siteId = '26-riu-cfg-bid'
const bucket = 'allworld-sites'
const file = join(root, 'public', 'sitemap.xml')
const key = `${siteId}/sitemap.xml`

if (!existsSync(file)) {
  console.error('public/sitemap.xml missing')
  process.exit(1)
}

console.log(`PUT ${bucket}/${key}`)
execSync(
  `npx wrangler r2 object put ${bucket}/${key} --file=${JSON.stringify(file)} --content-type=${JSON.stringify('application/xml; charset=utf-8')}`,
  { stdio: 'inherit', cwd: root, shell: true },
)

console.log(`\nUploaded → r2://${bucket}/${key}`)
console.log(`Site URL → https://${siteId}.softwarelink.net/sitemap.xml`)
