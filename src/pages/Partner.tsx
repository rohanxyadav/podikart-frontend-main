import { motion } from "framer-motion";
import { Handshake, Store, Truck, Globe, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const partnerTypes = [
  { icon: Store, title: "Retail Partner", description: "Stock Podikart products in your supermarket, grocery store, or specialty food shop. Enjoy competitive margins and a fast-moving SKU." },
  { icon: Truck, title: "Distribution Partner", description: "Become our regional distributor. We're expanding across India and need trusted partners for last-mile delivery and warehousing." },
  { icon: Globe, title: "Export Partner", description: "Help us take authentic Indian podis global. Partner with us for international distribution to the Telugu diaspora worldwide." },
  { icon: Users, title: "Franchise / Manufacturing Partner", description: "Set up a Podikart production unit in your region. We provide recipes, training, branding, and quality standards." },
];

const benefits = [
  "30%+ gross margins on every product",
  "Fast-moving FMCG product with repeat buyers",
  "Full brand & marketing support from Podikart",
  "Training and quality assurance programs",
  "Flexible MOQ for new partners",
  "Growing demand for healthy, preservative-free food",
];

import { useMutation } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";

export default function Partner() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", city: "", message: "" });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch(`${API_BASE_URL}/api/partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit request");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Partnership Request Sent!", description: "Our team will contact you within 48 hours." });
      setForm({ name: "", email: "", phone: "", business: "", city: "", message: "" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.7 }}>
            <Handshake className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Become a <span className="gold-text">Partner</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join India's fastest-growing podi brand. Whether you're a retailer, distributor, or entrepreneur —
              there's a place for you in the Podikart family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-[0.15em] uppercase">Partnership Models</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              How You Can <span className="gold-text">Partner</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {partnerTypes.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="bg-background border border-border rounded-xl p-6 h-full hover:border-primary/30 transition-colors">
                  <p.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Why Partner with <span className="gold-text">Podikart?</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <div className="flex items-start gap-3 p-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">{b}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Apply to <span className="gold-text">Partner</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2">Fill in your details and our team will reach out within 48 hours.</p>
          </div>
          <motion.form onSubmit={handleSubmit} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6 }} className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Business Name / Type</label>
              <Input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder="e.g. Retail Store, Distributor, etc." required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your interest and how you'd like to partner..." rows={4} />
            </div>
            <Button type="submit" className="w-full gold-gradient text-primary-foreground font-semibold hover:opacity-90">
              Submit Partnership Request
            </Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
