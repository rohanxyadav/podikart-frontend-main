import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MapPin } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/products";
import API_BASE_URL from "@/lib/api";
import { useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleLocationSelect = async (loc: any) => {
    try {
      const orderData = {
        orderItems: items.map(i => ({
          name: i.product.name,
          quantity: i.quantity,
          image: i.product.image,
          price: i.product.trialPrice, // Discounted Price
          pack: `Trial Pack (${i.product.weight}g)`,
          product: (i.product as any)._id || i.product.id
        })),
        shippingAddress: {
          address: loc.address,
          type: loc.type,
          pincode: loc.pincode,
          district: loc.district,
          state: loc.state,
          lat: loc.lat,
          lng: loc.lng
        },
        paymentMethod: "WhatsApp/Manual",
        totalPrice: totalPrice,
        totalItems: totalItems,
        customerDetails: {
          email: user?.email || 'Guest',
          phone: user?.phone || 'N/A'
        }
      };

      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save order to database");
      }

      const createdOrder = await res.json();
      setShowLocationPicker(false);

      const lines = items.map(
        (i) =>
          `• ${i.product.name} (${i.product.weight}g) x${i.quantity} (Price: ₹${i.product.trialPrice})`
      );

      const message = `Hi! I'd like to place an order from Podikart:

*Order ID:* #${createdOrder._id.slice(-8).toUpperCase()}

*User Details:*
Email: ${user?.email || 'N/A'}
Mobile: ${user?.phone || 'N/A'}

*Product Details:*
${lines.join("\n")}

*Order Summary:*
No. of Products: ${totalItems}
Final Amount: ₹${totalPrice}

*Delivery Location:*
Address: ${loc.address}
Type: ${loc.type}
PIN Code: ${loc.pincode}
District: ${loc.district}
State: ${loc.state}

Please confirm my order.`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
      clearCart();
    } catch (err: any) {
      toast({ title: "Order Error", description: err.message, variant: "destructive" });
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some delicious podis to get started!</p>
          <Link to="/products">
            <Button className="gold-gradient text-primary-foreground font-semibold">Browse Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <Link to="/products" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="font-display text-3xl font-bold mb-8">Your <span className="gold-text">Cart</span></h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const discountedPrice = item.product.trialPrice;
            const originalPrice = item.product.valuePrice;
            const productId = (item.product as any)._id || item.product.id;

            return (
              <div key={productId} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-foreground truncate">{item.product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">₹{discountedPrice}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{originalPrice}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase">{item.product.weight}g</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(productId, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-primary">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(productId, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:border-primary">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="font-bold text-foreground w-16 text-right">₹{discountedPrice * item.quantity}</span>
                <button onClick={() => removeFromCart(productId)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Items ({totalItems})</span>
            <span className="font-semibold">₹{totalPrice}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-lg">
            <span className="font-display font-bold">Total</span>
            <span className="font-display font-bold gold-text">₹{totalPrice}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearCart} className="text-sm">Clear Cart</Button>
            <Button
              onClick={() => setShowLocationPicker(true)}
              className="flex-1 gold-gradient text-primary-foreground font-bold shadow-xl hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Select Location & Order – ₹{totalPrice}
            </Button>
          </div>
        </div>

        <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Select Delivery Location
              </DialogTitle>
            </DialogHeader>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              onCancel={() => setShowLocationPicker(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
