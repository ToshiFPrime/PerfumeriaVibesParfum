import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByIdOrSlugDb, getProductsDb } from "@/lib/supabase/service";
import { ProductDetail } from "@/components/product/ProductDetail";

export const dynamicParams = true;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByIdOrSlugDb(slug);

  if (!product) {
    return {
      title: "Perfume no encontrado - Vibes Parfum",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://perfumeria-vibes-parfum.vercel.app";
  const primaryImage = product.images[0] || "/images/logo-clean.jpg";
  const fullImageUrl = primaryImage.startsWith("http") ? primaryImage : `${siteUrl}${primaryImage}`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${product.name} — ${product.brand} | Vibes Parfum`,
    description: `${product.name} de ${product.brand}. Concentración ${product.concentration}, Familia Olfativa ${product.olfactoryFamily}. Decants exclusivos de 5ml, 10ml y frascos completos. Envíos asegurados a toda Bolivia.`,
    openGraph: {
      title: `${product.name} — ${product.brand} | Vibes Parfum`,
      description: `Descubre ${product.name} (${product.concentration}) en Vibes Parfum. Presentaciones en Decants de 5ml/10ml y botellas completas con despacho a toda Bolivia.`,
      url: `${siteUrl}/producto/${product.slug}`,
      siteName: "Vibes Parfum Bolivia",
      images: [
        {
          url: fullImageUrl,
          secureUrl: fullImageUrl,
          width: 1200,
          height: 1200,
          type: "image/jpeg",
          alt: `${product.name} - ${product.brand} | Vibes Parfum Bolivia`,
        },
      ],
      type: "website",
      locale: "es_BO",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} de ${product.brand} | Vibes Parfum`,
      description: `${product.description.slice(0, 160)}... Decants y frascos completos en Bolivia.`,
      images: [fullImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProductsDb();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductByIdOrSlugDb(slug);

  if (!product) {
    notFound();
  }

  const allInFamily = await getProductsDb({ family: product.olfactoryFamily });
  const relatedProducts = allInFamily
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const inStock = product.variants.some((v) => v.stock > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: `Perfumes > ${product.gender} > ${product.olfactoryFamily}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BOB",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.variants.length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Vibes Parfum Bolivia",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: Math.max(1, product.reviewsCount),
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </>
  );
}
