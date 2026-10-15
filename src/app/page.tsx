import React from "react";
import {
  HeroSection,
  OlfactoryWheel,
  ShippingWidget,
  PromoBanner,
  BestSellersSection,
  NicheCollectionSection,
  TestimonialsSection,
  LuxuryPromiseSection,
} from "@/components/home";
import { getProductsDb } from "@/lib/supabase/service";

export default async function HomePage() {
  const allProducts = await getProductsDb();
  const featuredBestSellers = allProducts.filter((p) => p.isBestSeller && p.isActive !== false).slice(0, 3);
  const featuredNiche = allProducts.filter((p) => p.isFeatured && !p.isBestSeller && p.isActive !== false).slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* 1. Hero Principal con Frascos & Decants */}
      <HeroSection />

      {/* 2. Banner Promocional con Cupón Interactivo */}
      <PromoBanner />

      {/* 3. Fragancias Más Vendidas */}
      {featuredBestSellers.length > 0 && <BestSellersSection products={featuredBestSellers} />}

      {/* 4. Rueda & Familias Olfativas */}
      <OlfactoryWheel />

      {/* 5. Colección Nicho de Lujo */}
      {featuredNiche.length > 0 && <NicheCollectionSection products={featuredNiche} />}

      {/* 6. Cotizador Rápido de Envíos en Bolivia */}
      <section className="py-14 bg-zinc-950 border-t border-zinc-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ShippingWidget />
        </div>
      </section>

      {/* 7. Testimonios Verificados de Compradores */}
      <TestimonialsSection />

      {/* 8. Beneficios & Promesa Vibes Parfum */}
      <LuxuryPromiseSection />
    </div>
  );
}
