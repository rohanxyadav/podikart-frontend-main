import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function ReturnRefundPolicy() {
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
                    <h1 className="font-display text-4xl font-bold mb-8">Return & <span className="gold-text">Refund Policy</span></h1>

                    <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">1. Return Eligibility</h2>
                            <p>Due to the perishable nature of our products (Podis and homemade food items), we followed a strict hygiene protocol. Returns are only accepted if:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The product received is damaged during transit.</li>
                                <li>The product received is past its expiry date at the time of delivery.</li>
                                <li>The wrong item was shipped to you.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">2. Reporting an Issue</h2>
                            <p>To report an issue, please contact us within **24 hours** of delivery via WhatsApp (+91 79899 07021) or email (podikart.lmt@gmail.com). Please provide:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Your Order ID.</li>
                                <li>Clear photos of the damaged or incorrect product and the packaging.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">3. Refund Process</h2>
                            <p>Once your request is verified, we will initiate a refund or send a replacement at no extra cost. Refunds will be processed to your original payment method within 5-7 business days.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">4. Cancellations</h2>
                            <p>Orders can only be cancelled before they are dispatched. Once shipped, we cannot accept cancellations as the items are prepared fresh for each order.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
