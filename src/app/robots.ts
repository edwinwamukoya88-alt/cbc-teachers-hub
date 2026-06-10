import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Robots - CBC Teachers Hub',
}

export default function Robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/'],
      },
    ],
    sitemap: 'https://cbc-teachers-hub.com/sitemap.xml',
  }
}
