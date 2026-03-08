import { useState } from "react";
import ChatModal from "@/components/ChatModal";
import OrderTrackingModal from "@/components/OrderTrackingModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User, Mail, Phone, ShoppingBag, LogOut, Package,
  MapPin, Clock, MessageSquare, ChevronRight, Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { format } from "date-fns";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const [chatOrder, setChatOrder] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const { data: myOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
    enabled: !!isAuthenticated
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const lastOrder = myOrders[0];
  const address = lastOrder?.shippingAddress;

  return (
    <>
      <main className="pt-24 pb-20 bg-muted/20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <h1 className="font-display text-4xl font-bold mb-10">Welcome back, <span className="gold-text">{user?.name}</span></h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Profile information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center p-1 mb-4 shadow-lg">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center ring-4 ring-white/10">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <h2 className="font-display text-2xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Premium Member</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Email Address</p>
                      <p className="text-sm font-semibold truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Mobile Number</p>
                      <p className="text-sm font-semibold">{user?.phone || "Not linked"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <Button variant="ghost" onClick={logout} className="w-full text-destructive hover:bg-destructive/10 rounded-xl font-bold">
                    <LogOut className="w-4 h-4 mr-2" /> Logout Session
                  </Button>
                </div>
              </div>

              <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                <h3 className="font-display font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Have questions about your orders or our podis?</p>
                <Link to="/contact">
                  <Button className="w-full gold-gradient text-primary-foreground font-bold rounded-xl shadow-lg ring-offset-2 hover:scale-[1.02] transition-transform">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Address Map & Order History */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Location Map */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Preferred Delivery Location
                  </h3>
                </div>

                {address ? (
                  <div className="space-y-4">
                    <div className="h-[250px] rounded-xl overflow-hidden border border-border relative z-0">
                      <MapContainer center={[address.lat, address.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[address.lat, address.lng]} icon={icon}>
                          <Popup>{address.address}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                      <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md mb-2 inline-block">
                        {address.type} Address
                      </span>
                      <p className="text-sm font-medium">{address.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {address.district}, {address.state} — {address.pincode}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-border">
                    <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Complete your first order to pin your address.</p>
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display font-bold text-xl flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" /> Order History
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">{myOrders.length} Orders</span>
                </div>

                {ordersLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">No orders yet</h4>
                    <p className="text-muted-foreground text-sm mb-6">Explore our curated collections of authentic podis.</p>
                    <Link to="/products">
                      <Button className="gold-gradient text-primary-foreground font-bold px-8">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order: any) => (
                      <div key={order._id} className="group border border-border rounded-2xl p-5 hover:border-primary transition-all bg-muted/10 hover:bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                              {format(new Date(order.createdAt), "PPP")} at {format(new Date(order.createdAt), "p")}
                            </p>
                            <h4 className="font-display font-bold text-lg">Order #{order._id.slice(-8).toUpperCase()}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === "Done" ? "bg-green-500 text-white" :
                              order.status === "Cancelled" ? "bg-red-500 text-white" :
                                order.status === "Pending" ? "bg-amber-500 text-white" :
                                  "bg-blue-500 text-white"
                              }`}>
                              {order.status}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 rounded-xl border-2 font-bold gap-2"
                              onClick={() => { setChatOrder(order); setIsChatOpen(true); }}
                            >
                              <MessageSquare className="w-4 h-4 text-primary" /> Raise Doubt
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{order.totalItems} Items</span>
                            <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                            <span className="text-sm font-bold gold-text">₹{order.totalPrice}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold group-hover:text-primary transition-colors"
                            onClick={() => { setTrackingOrder(order); setIsTrackingOpen(true); }}
                          >
                            Track Details <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {chatOrder && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          order={chatOrder}
        />
      )}

      {trackingOrder && (
        <OrderTrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          order={trackingOrder}
        />
      )}
    </>
  );
}
