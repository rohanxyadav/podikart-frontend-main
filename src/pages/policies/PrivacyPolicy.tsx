import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen pt-24 pb-12">
            <Navbar />
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="font-display text-4xl font-bold mb-8">Privacy <span className="gold-text">Policy</span></h1>

                    <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you create an account or place an order.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                            <p>Our goal is to provide you with the best experience possible. We use your information to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Process and fulfill your orders.</li>
                                <li>Communicate with you regarding order updates or promotions (if opted-in).</li>
                                <li>Improve our website and customer service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">3. Data Protection</h2>
                            <p>We take security seriously and use industry-standard measures to protect your personal data from unauthorized access, disclosure, or alteration.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">4. Sharing Your Information</h2>
                            <p>We do not sell or rent your personal information to third parties. We only share necessary details with partners who help us fulfill orders (e.g., shipping carriers).</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">5. Cookies</h2>
                            <p>Our website uses cookies to enhance your browsing experience and remember your preferences. You can disable cookies in your browser settings, though it may limit some features.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
