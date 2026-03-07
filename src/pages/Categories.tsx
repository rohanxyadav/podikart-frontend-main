import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Leaf, Flame, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

import spiceHistoryImg from "@/assets/spice-history.png";
import howToEatImg from "@/assets/how-to-eat-podi.png";
import healthyLentilsImg from "@/assets/healthy-lentils.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoriesPage() {
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  return (
    <main className="pt-24 pb-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-secondary/20 py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.6 }}>
            <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4 block">Our Expertise</span>
            <h1 className="font-display text-4xl md:text-6xl font-black mb-6 leading-tight">
              Explore Our <span className="gold-text">Traditions</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
              From fiery spice blends to nutritional powerhouses, discover the authentic categories of homemade podis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 1. Categories Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12 gap-4 flex-wrap">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Browse by <span className="gold-text">Flavor Profile</span></h2>
            <div className="h-px bg-border flex-grow hidden md:block mx-8" />
            <span className="bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-primary/20">
              {categories.length} Handcrafted Categories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingCategories ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-muted animate-pulse border border-border" />
              ))
            ) : categories.map((c: any, i: number) => {
              const productCount = allProducts.filter((p: any) => p.category === c.slug).length;
              return (
                <motion.div
                  key={c._id || c.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative bg-card border border-border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-secondary/50 flex items-center justify-center font-display text-4xl text-primary/20">{c.name.charAt(0)}</div>
                    )}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                      {productCount} {productCount === 1 ? 'Product' : 'Products'}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{c.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed">
                      {c.description || "Authentic, handcrafted flavors passed down through generations. Made with pure ingredients and lots of love."}
                    </p>
                    <Link to={`/products?category=${c.slug}`} className="block">
                      <Button className="w-full rounded-2xl py-6 bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all duration-500 font-bold group-hover:shadow-xl">
                        Explore Collection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Indian Spice History */}
      <section className="py-24 bg-secondary/10 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-card">
                <img src={spiceHistoryImg} alt="Indian Spice Heritage" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-primary rounded-[2rem] p-8 shadow-2xl text-white max-w-[240px] hidden md:block">
                <Flame className="w-10 h-10 mb-4 animate-pulse" />
                <p className="font-display text-xl font-bold leading-tight">Tradition dating back 5000 years.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4 block">The Heritage</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
                A Journey Through <br /> <span className="gold-text">Flavor & History</span>
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Since ancient times, spices have been the soul of Indian kitchens. They weren't just about taste; they were a form of medicine, a symbol of royalty, and the heart of legendary trade routes that shaped the world.
                </p>
                <p>
                  In every Podikart blend, we carry forward this 5,000-year-old heritage. Our podis use age-old proportions of chilies, lentils, and rare spices, hand-pounded to preserve the volatile oils and original zest that modern processing loses.
                </p>
                <div className="flex gap-6 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-foreground">Sun Dried</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-foreground">Hand Pounded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-foreground">Local Sourced</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Art of Eating Podi */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4 block">The Ritual</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
                The Simple Way <br /> <span className="gold-text">to Pure Joy</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                There is an art to enjoying podi. It's the ultimate comfort food for millions — a simple, healthy, and incredibly flavorful experience that transforms an everyday meal.
              </p>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-display text-xl font-bold text-primary">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-lg">Steaming Hot Rice</h4>
                    <p className="text-sm text-muted-foreground">Start with a mound of hot, fluffy white rice or a fresh plate of Idlis.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-display text-xl font-bold text-primary">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-lg">A Generous Spoonful</h4>
                    <p className="text-sm text-muted-foreground">Add your favorite Podikart blend on top. Don't be shy with the portions!</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-none w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-display text-xl font-bold text-primary">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-lg">The Golden Ghee</h4>
                    <p className="text-sm text-muted-foreground">Drizzle hot, melted ghee (or cold-pressed sesame oil). Mix it well and enjoy the heaven on your plate.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img src={howToEatImg} alt="How to eat Podi" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
                    <p className="italic text-lg font-medium">"A better alternative to heavy pickles, making every meal light and nutritional."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Healthy/Nutritional Powerhouse */}
      <section className="py-24 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase block mb-4">Nutritional Powerhouse</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Goodness in <span className="gold-text">Every Grain</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our podis are not just condiments; they are carefully balanced nutritional supplements made from premium lentils and seeds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-background border border-border rounded-3xl text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-xl mb-3">High Protein</h4>
              <p className="text-sm text-muted-foreground">Made from roasted lentils, providing a clean plant-based protein boost with every meal.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-background border border-border rounded-3xl text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-bold text-xl mb-3">Zero Preservatives</h4>
              <p className="text-sm text-muted-foreground">100% natural. We use nothing but pure spices, seeds, and salt. No hidden additives.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-background border border-border rounded-3xl text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-xl mb-3">Digestive Health</h4>
              <p className="text-sm text-muted-foreground">Includes ingredients like cumin and asafoetida that aid digestion and metabolic health.</p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-background border border-border rounded-3xl text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h4 className="font-bold text-xl mb-3">Heart Healthy</h4>
              <p className="text-sm text-muted-foreground">Contains heart-healthy seeds and spices known for their anti-inflammatory properties.</p>
            </motion.div>
          </div>

          <div className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl relative h-[400px]">
            <img src={healthyLentilsImg} alt="Healthy Lentils" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center p-8">
              <div className="max-w-xl">
                <h3 className="text-white font-display text-3xl md:text-5xl font-extrabold mb-6">Fuel Your Day Naturally</h3>
                <p className="text-white/90 text-xl font-medium">Clean label. Whole ingredients. Authentic power.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Spacer to avoid overlap with existing footer */}
      <div className="h-20" />
    </main>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
