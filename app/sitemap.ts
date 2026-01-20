import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// Yeh line website ko majboor karegi ke har baar naya data fetch kare
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pak-vape-store-pods.vercel.app'

  // Supabase client initialize karein
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Database se saare products uthayein (Bina kisi limit ke)
  const { data: products } = await supabase
    .from('products')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  // Product links ki list tyaar karein
  const productEntries = products?.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  })) || []

  // Static Pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ]

  return [...staticPages, ...productEntries]
}
