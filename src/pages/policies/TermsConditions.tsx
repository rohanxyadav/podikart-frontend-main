import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function TermsConditions() {
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
                    <h1 className="font-display text-4xl font-bold mb-8">Terms & <span className="gold-text">Conditions</span></h1>

                    <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                            <p>By accessing or using the Podikart website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">2. Product Information</h2>
                            <p>We make every effort to display our products, including pricing and descriptions, as accurately as possible. However, as our products are handcrafted and homemade, slight variations in color or texture may occur between batches.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">3. User Accounts</h2>
                            <p>When you create an account, you are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">4. Intellectual Property</h2>
                            <p>All content on this website, including logos, text, and images, is the property of Podikart and is protected by intellectual property laws. Unauthorized use of any material is strictly prohibited.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
                            <p>Podikart shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our products or services.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
