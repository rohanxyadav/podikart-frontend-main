import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Image } from "@imagekit/react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login to buy",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    addToCart(product, 1);
    toast({ title: `${product.name} added to cart!`, description: `${product.weight}g × 1` });
  };

  const discountedPrice = product.trialPrice;
  const originalPrice = product.valuePrice;
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden relative">
        <div className="w-full aspect-square bg-muted/30 p-2 flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            {discountPercent}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-border/50 text-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
          {product.weight}g
        </div>
      </Link>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product.slug}`} className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-0.5 shrink-0 bg-primary/10 px-1.5 py-0.5 rounded text-primary">
            <Star className="w-3 h-3 fill-primary" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2rem] leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold text-foreground">₹{discountedPrice}</span>
            <span className="text-xs text-muted-foreground line-through opacity-60">₹{originalPrice}</span>
          </div>
          <Button onClick={handleAddToCart} size="sm" className=" gold-gradient text-primary-foreground font-bold shadow-md hover:shadow-lg transition-all rounded-lg">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        <Link to={`/product/${product.slug}`}>
          <Button variant="outline" size="sm" className="w-full text-xs font-bold border-border/50 hover:border-primary hover:text-primary transition-colors rounded-lg">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
