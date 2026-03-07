import { motion } from "framer-motion";
import { Shield, Users, Heart, Leaf, Award, Target } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const values = [
  { icon: Shield, title: "100% Homemade", description: "Every podi is handcrafted in small batches using traditional stone-grinding methods." },
  { icon: Heart, title: "Hygienic Production", description: "Strict quality control and food-safe packaging ensure every jar reaches you fresh." },
  { icon: Leaf, title: "No Preservatives", description: "Zero artificial colors, flavors, or preservatives. Just pure, natural ingredients." },
  { icon: Users, title: "Women Empowerment", description: "We provide dignified employment to women aged 45–65 from local communities." },
  { icon: Award, title: "Consistent Taste", description: "Standardized recipes ensure the same authentic taste in every batch, every time." },
  { icon: Target, title: "FMCG Ready", description: "Built for scale — from local kitchens to national retail shelves and global exports." },
];

export default function About() {
  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.7 }}>
            <span className="text-primary font-semibold text-sm tracking-[0.15em] uppercase">About Podikart</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-6">
              Building India's Most Loved <span className="gold-text">Podi Brand</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Podikart was born from a simple yet powerful belief — every Indian household deserves access to
              authentic, hygienic, and consistently delicious podis. We're on a mission to replace oily,
              unhealthy pickles with nutrient-rich podi varieties that taste exactly like homemade — because they are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6 }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Our <span className="gold-text">Story</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Growing up in Telugu households, podi was never just a condiment — it was an emotion.
                The aroma of freshly ground kandi podi mixed with hot rice and ghee is a memory every
                South Indian carries. But as families moved to cities, that authentic taste started fading.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We started Podikart to bridge this gap. By working with experienced home cooks — women
                who have perfected these recipes over decades — we bring the same love, care, and authenticity
                to your dining table, no matter where you are.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Podikart serves thousands of happy customers across India and the global Telugu diaspora,
                delivering a taste of home in every jar.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 space-y-6">
                <div>
                  <div className="font-display text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Women Employed</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">6+</div>
                  <div className="text-sm text-muted-foreground">Podi Varieties</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Homemade & Natural</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-[0.15em] uppercase">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              Our <span className="gold-text">Values</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/30 transition-colors">
                  <v.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-secondary-foreground mb-6">
              Our <span className="gold-text">Vision</span>
            </h2>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              To become India's most trusted everyday podi brand — present in every urban kitchen,
              loved by the global Telugu diaspora, and recognized as a premium, export-ready FMCG product
              that empowers women and preserves culinary heritage.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
