import { useParams, Link, useNavigate } from "react-router-dom";
import { getWhatsAppLink } from "@/data/products";
import { Star, ChevronLeft, ShoppingBag, ShoppingCart, Leaf, Shield, Clock, HelpCircle, MessageSquare, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Image } from "@imagekit/react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/products/${slug}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
    enabled: !!slug
  });
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast({
        title: "Please login to buy",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    addToCart(product, quantity);
    toast({ title: `${product.name} added to cart!`, description: `${product.weight}g × ${quantity}` });
  };

  if (isLoading) {
    return (
      <main className="pt-24 pb-20 text-center">
        <h1 className="font-display text-2xl font-bold text-muted-foreground mt-4">Loading product details...</h1>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 pb-20 text-center">
        <h1 className="font-display text-2xl font-bold mt-4">Product not found</h1>
        <Link to="/products" className="text-primary underline mt-4 inline-block">Back to Products</Link>
      </main>
    );
  }

  const discountedPrice = product.trialPrice;
  const originalPrice = product.valuePrice;
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Link to="/products" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-8 text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <Image src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold text-xs tracking-[0.15em] uppercase">{product.category.replace(/-/g, " ")}</span>
              {discountPercent > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-2">{product.name}</h1>

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-display font-bold text-foreground">₹{discountedPrice}</span>
                <span className="text-lg text-muted-foreground line-through opacity-60">₹{originalPrice}</span>
              </div>
              <div className="text-sm font-medium text-primary flex items-center gap-2">
                <Package className="w-4 h-4" /> Net Weight: {product.weight}g
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-lg hover:border-primary">−</button>
                <span className="font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-lg hover:border-primary">+</button>
                <span className="text-muted-foreground text-sm ml-3 italic">Total: ₹{discountedPrice * quantity}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button size="lg" onClick={handleAddToCart} className="flex-1 gold-gradient text-primary-foreground font-bold text-base shadow-xl hover:opacity-90 transition-opacity">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart – ₹{discountedPrice * quantity}
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="bg-card rounded-lg p-3 border border-border">
                <Leaf className="w-5 h-5 text-primary mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">100% Natural</span>
              </div>
              <div className="bg-card rounded-lg p-3 border border-border">
                <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Hygienically Made</span>
              </div>
              <div className="bg-card rounded-lg p-3 border border-border">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">{product.shelfLife} Shelf Life</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Info */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-display text-lg font-bold mb-3">Ingredients</h3>
            <ul className="space-y-1">{product.ingredients.map((i) => <li key={i} className="text-sm text-muted-foreground">• {i}</li>)}</ul>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-display text-lg font-bold mb-3">Benefits</h3>
            <ul className="space-y-1">{product.benefits.map((b) => <li key={b} className="text-sm text-muted-foreground">• {b}</li>)}</ul>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-display text-lg font-bold mb-3">How to Use</h3>
            <ul className="space-y-1">{product.usage.map((u) => <li key={u} className="text-sm text-muted-foreground">• {u}</li>)}</ul>
          </div>
        </div>

        {/* FAQs Section */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mt-16 bg-secondary/10 rounded-3xl p-8 lg:p-12 border border-border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Frequently Asked <span className="gold-text">Questions</span></h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {product.faqs.map((faq: any, i: number) => (
                <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-foreground mb-2 flex gap-2">
                    <span className="text-primary">Q:</span> {faq.question}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <span className="text-primary font-bold">A:</span> {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Customer <span className="gold-text">Reviews</span></h2>
            </div>
            <div className="flex items-center gap-4 bg-card border border-border px-4 py-2 rounded-full shadow-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating} / 5</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="grid gap-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review: any, i: number) => (
                <div key={review._id || i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{review.name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-primary text-primary" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-2xl p-12 border border-border border-dashed text-center">
                <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No reviews yet for this product.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
