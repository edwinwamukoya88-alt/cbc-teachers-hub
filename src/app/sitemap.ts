import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://cbc-teachers-hub.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://cbc-teachers-hub.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://cbc-teachers-hub.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://cbc-teachers-hub.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://cbc-teachers-hub.com/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://cbc-teachers-hub.com/resources', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]
}
