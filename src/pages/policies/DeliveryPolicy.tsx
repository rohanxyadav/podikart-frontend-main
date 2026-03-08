import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function DeliveryPolicy() {
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
                    <h1 className="font-display text-4xl font-bold mb-8">Delivery <span className="gold-text">Policy</span></h1>

                    <div className="prose prose-stone max-w-none text-muted-foreground space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">1. Shipping Areas</h2>
                            <p>Podikart delivers pan-India using trusted third-party courier partners. We currently do not offer international shipping.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">2. Processing Time</h2>
                            <p>Each of our podis is freshly prepared after you place your order. Please allow **1-2 business days** for processing and packaging before your order is dispatched.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">3. Delivery Timeline</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>**Within Hyderabad:** 1-2 business days across all zones.</li>
                                <li>**Other Metro Cities:** 3-5 business days.</li>
                                <li>**Rest of India:** 5-7 business days depending on location.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">4. Shipping Charges</h2>
                            <p>Shipping charges are calculated at checkout based on the weight of the products and the delivery location. Free shipping is available on orders above ₹999.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-4">5. Tracking</h2>
                            <p>Once your order is shipped, you will receive a tracking ID via WhatsApp or Email. You can use this ID on our courier partner's website to monitor your shipment.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
