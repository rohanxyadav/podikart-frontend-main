import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Circle, Package, Truck, Box, CreditCard, Calendar, Info } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";

interface OrderTrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

const statuses = [
    { id: "Pending", label: "Order Placed", icon: Package },
    { id: "Payment Pending", label: "Payment Verification", icon: CreditCard },
    { id: "In Packing", label: "Packing & Quality Check", icon: Box },
    { id: "In Delivery", label: "Out for Delivery", icon: Truck },
    { id: "Done", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTrackingModal({ isOpen, onClose, order }: OrderTrackingModalProps) {
    if (!order) return null;

    const currentStatusIndex = statuses.findIndex(s => s.id === order.status);
    const isCancelled = order.status === "Cancelled";
    const orderDate = new Date(order.createdAt);
    const expectedDelivery = addDays(orderDate, 10);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between gold-gradient">
                            <div>
                                <h3 className="text-xl font-display font-bold text-primary-foreground">Track Order</h3>
                                <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-wider">Order #{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-white/20 text-primary-foreground"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {isCancelled ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                                        <X className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-destructive">Order Cancelled</h4>
                                    <p className="text-muted-foreground mt-2">This order has been cancelled. Please contact support for more details.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Delivery Estimation */}
                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-8 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Expected Delivery</p>
                                            <p className="text-lg font-bold text-foreground">{format(expectedDelivery, "PPP")}</p>
                                            <p className="text-[10px] text-primary font-bold mt-1">
                                                Usually delivered in 3-5 business days based on your location.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted-foreground/10">
                                        {statuses.map((status, index) => {
                                            const isCompleted = index <= currentStatusIndex;
                                            const isCurrent = index === currentStatusIndex;
                                            const Icon = status.icon;

                                            return (
                                                <div key={status.id} className="relative pl-12">
                                                    {/* Dot/Line Connector */}
                                                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${isCompleted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                                        }`}>
                                                        {isCompleted ? <Icon className="w-5 h-5 shrink-0" /> : <Circle className="w-5 h-5 shrink-0 fill-current opacity-20" />}
                                                    </div>

                                                    <div>
                                                        <h4 className={`text-sm font-bold tracking-tight transition-colors ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                                                            {status.label}
                                                        </h4>
                                                        {isCurrent && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="flex items-center gap-1.5 mt-1"
                                                            >
                                                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Current Status</span>
                                                            </motion.div>
                                                        )}
                                                        {isCompleted && (
                                                            <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                                                {index === 0 ? format(orderDate, "PPP p") : "Details updated via system"}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* Info Box */}
                            <div className="mt-8 pt-6 border-t border-border/50 flex items-start gap-3">
                                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                    Order status updates may take up to 24 hours to reflect. If you have any doubts, use the "Raise Doubt" feature on the account page.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
                            <Button onClick={onClose} className="rounded-xl px-8 font-bold">Close</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
