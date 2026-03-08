import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 79899 07021" },
  { icon: Mail, label: "Email", value: "podikart.lmt@gmail.com" },
  { icon: MapPin, label: "Location", value: "Hyderabad, Telangana, India" },
  { icon: Clock, label: "Working Hours", value: "Mon – Sat, 9 AM – 7 PM" },
];

import { useMutation } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", message: "" });
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
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.7 }} className="text-center mb-14">
            <span className="text-primary font-semibold text-sm tracking-[0.15em] uppercase">Get In Touch</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">
              Contact <span className="gold-text">Us</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions about our products, bulk orders, or partnerships? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6 }}>
              <div className="space-y-6 mb-8">
                {contactInfo.map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{c.label}</div>
                      <div className="text-muted-foreground text-sm">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/917989907021?text=Hi!%20I%20have%20a%20query%20about%20Podikart."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.6, delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you need..." rows={4} required />
                </div>
                <Button type="submit" className="w-full gold-gradient text-primary-foreground font-semibold hover:opacity-90">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
