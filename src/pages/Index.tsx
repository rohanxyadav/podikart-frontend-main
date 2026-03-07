import heroBg from "@/assets/hero-bg.jpg";
import storyImage from "@/assets/logo.jpeg";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Shield, Heart, Leaf, Users, ChevronRight, MessageCircle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const trustIcons = [
  { icon: Shield, label: "100% Homemade" },
  { icon: Users, label: "Women Empowered Manufacturing" },
  { icon: Heart, label: "Hygienically Packed" },
  { icon: Leaf, label: "No Artificial Preservatives" },
];

const testimonials = [
  { name: "Lakshmi R.", location: "Hyderabad", quote: "Tastes exactly like my mother used to make. The Kandi Podi is absolutely authentic!", rating: 5 },
  { name: "Priya S.", location: "Bangalore", quote: "Finally found a healthy alternative to pickles for my kids. They love the Palli Podi!", rating: 5 },
  { name: "Venkat M.", location: "USA", quote: "As a Telugu NRI, Podikart brings the taste of home to my dining table. Premium quality!", rating: 5 },
];

const faqs = [
  { q: "How long do the podis stay fresh?", a: "Our podis have a shelf life of 2–3 months when stored in an airtight container in a cool, dry place." },
  { q: "Are these podis suitable for children?", a: "Yes! Our mild podis are perfect for children. We also have spicier variants for adults." },
  { q: "Do you deliver across India?", a: "Yes, we deliver pan-India through trusted courier partners. Order via WhatsApp for fastest processing." },
  { q: "Are any preservatives used?", a: "Absolutely not. All our podis are 100% natural with no artificial preservatives, colors, or flavors." },
  { q: "What is the best way to consume podi?", a: "Mix with hot rice and ghee/oil, use as a dry chutney with idli/dosa, or sprinkle on snacks for extra flavor." },
];

// ... (existing TextScroller)
const TextScroller = ({ items }: { items: string[] }) => {
  return (
    <div className="bg-primary/10 border-y border-primary/20 py-4 overflow-hidden flex items-center whitespace-nowrap">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 items-center"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-4">
            {item} <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ... (trustIcons, testimonials, faqs kept as is)

export default function Index() {
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/products?featured=true`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    }
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });

  const bestsellerNames = featuredProducts.map((p: any) => p.name);

  return (
    <main className="pt-16 overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Premium South Indian Podis" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.8 }}>
            <span className="inline-block gold-gradient text-primary-foreground text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
              Homemade Authentic Podis
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-foreground leading-tight mb-4">
              Old-School Recipes.
              <br />
              <span className="gold-text">New-Age Impact.</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-8 font-body">
              Healthy, Hygienic & Authentic Everyday Podis – A Better Alternative to Pickles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {localStorage.getItem('user') ? (
                <Link to="/account">
                  <Button size="lg" className="gold-gradient text-primary-foreground font-bold text-base shadow-2xl hover:opacity-90 transition-opacity px-8">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Go to Account
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="gold-gradient text-primary-foreground font-bold text-base shadow-2xl hover:opacity-90 transition-opacity px-8">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Start Ordering
                  </Button>
                </Link>
              )}
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold text-base px-8">
                  View Menu <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Scroller */}
      {featuredProducts.length > 0 && <TextScroller items={bestsellerNames} />}

      {/* 1. Our Story */}
      <section id="story" className="py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-secondary/50"
            >
              <img src={storyImage} alt="Our Heritage" className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4 block">Crafting Tradition</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Authenticity in Every <span className="gold-text">Spoonful</span>
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  At Podikart, we believe that the best flavors are those passed down through generations. Our journey started with a simple mission: to bring the true essence of South Indian homemade podis to every dining table, without compromise.
                </p>
                <p>
                  Every recipe we use is aged and authentic, sourced from the kitchens of experienced homemakers who know that patience and purity are the most important ingredients. We’re not just making condiments; we’re preserving a heritage of health and taste.
                </p>
                <div className="pt-6 border-t border-border mt-8 flex gap-8">
                  <div>
                    <div className="text-3xl font-bold text-foreground">100%</div>
                    <div className="text-xs uppercase tracking-wider font-bold text-primary">Natural</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">Aged</div>
                    <div className="text-xs uppercase tracking-wider font-bold text-primary">Recipes</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">Clean</div>
                    <div className="text-xs uppercase tracking-wider font-bold text-primary">Manufacturing</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Selection (Browse by Category) */}
      <section className="py-20 bg-secondary/20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase">Selection</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
              Browse by <span className="gold-text">Category</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Explore our diverse range of authentic flavors, from spicy treats to savory essentials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {isLoadingCategories ? (
              <div className="col-span-full text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              categories.map((c: any) => (
                <Link
                  key={c._id || c.id}
                  to={`/products?category=${c.slug}`}
                  className="group relative h-64 overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-muted flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700" />
                    ) : (
                      <span className="text-muted-foreground/30 font-display text-4xl opacity-50 select-none">{c.name.split(' ')[0]}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-white font-display text-2xl font-bold mb-2">{c.name}</div>
                    <div className="flex items-center text-primary-foreground/90 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Explore <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. Bestsellers */}
      <section id="bestsellers" className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase">Bestsellers</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
                Our Most Loved <span className="gold-text">Podis</span>
              </h2>
            </div>
            <Link to="/products">
              <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto self-start md:self-auto">
                View All Products <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="relative overflow-hidden py-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse h-96 rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="flex">
                <motion.div
                  animate={{ x: [0, -1200] }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="flex gap-8"
                  style={{ width: "fit-content" }}
                >
                  {[...featuredProducts, ...featuredProducts, ...featuredProducts].map((p: any, idx) => (
                    <div key={`${p._id}-${idx}`} className="min-w-[320px] w-[320px]">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Empowering Women */}
      <section className="py-24 gold-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Heart className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Users className="w-16 h-16 mx-auto mb-8 opacity-90" />
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Empowering Women, <br />
              <span className="text-white">One Podi at a Time</span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90 mb-12 font-medium">
              Every creation at Podikart is handcrafted with love by women aged 45–65. We provide dignified employment, fair wages, and a platform for their culinary wisdom to reach the world.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <div className="text-4xl font-bold mb-1">50+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Livelihoods Created</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <div className="text-4xl font-bold mb-1">10k+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Home Kitchens</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <div className="text-4xl font-bold mb-1">100%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Hand-Pounded</div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <div className="text-4xl font-bold mb-1">Pura</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Ingredients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
              Stories from Our <span className="gold-text">Customers</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border p-10 rounded-[40px] shadow-sm relative overflow-hidden"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-xl italic leading-relaxed mb-8 relative z-10 line-clamp-4">
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-4 border-t border-border pt-6">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{t.name}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold font-display">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar (Relocated or kept if subtle) */}
      <section className="bg-secondary py-12 border-y border-border">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24">
          {trustIcons.map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <t.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary-foreground mb-6">
            A <span className="gold-text">₹500 Crore</span> Market Opportunity
          </h2>
          <p className="text-secondary-foreground/70 text-lg mb-8">
            The Indian condiment market is evolving. Health-conscious consumers are seeking authentic,
            preservative-free alternatives. Podikart is positioned at the intersection of tradition and modern FMCG.
          </p>
          <div className="flex justify-center gap-12 flex-wrap">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-primary">30%+</div>
              <div className="text-sm text-secondary-foreground/60">Gross Margins</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-primary">FMCG</div>
              <div className="text-sm text-secondary-foreground/60">Ready Model</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-primary">Export</div>
              <div className="text-sm text-secondary-foreground/60">Ready Product</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Frequently Asked <span className="gold-text">Questions</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group bg-card border border-border rounded-lg">
                <summary className="cursor-pointer p-5 font-semibold text-foreground flex justify-between items-center">
                  {f.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground text-sm">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Taste <span className="gold-text">Authenticity?</span>
            </h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Order your favorite podis now and experience the true taste of tradition delivered right to your doorstep.
            </p>
            <a
              href="https://wa.me/917989907021?text=Hi!%20I%27d%20like%20to%20order%20from%20Podikart."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gold-gradient text-primary-foreground font-bold text-xl shadow-2xl hover:opacity-90 transition-opacity px-12 py-8 h-auto rounded-3xl">
                <MessageCircle className="w-6 h-6 mr-3" />
                Order on WhatsApp
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
