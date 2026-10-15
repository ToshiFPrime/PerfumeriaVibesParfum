import type { MetadataRoute } from "next";
import { getProductsDb } from "@/lib/supabase/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://perfumeria-vibes-parfum.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/envios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/politicas`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const allProducts = await getProductsDb();

  const productPages: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${baseUrl}/producto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: product.isBestSeller ? 0.9 : 0.8,
  }));

  return [...staticPages, ...productPages];
}
