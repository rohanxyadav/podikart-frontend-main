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
    addToCart(product, "value");
    toast({ title: `${product.name} added to cart!`, description: "Value Pack × 1" });
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden">
        <div className="w-full aspect-square bg-muted/30 p-2 flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.shortDescription}</p>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-sm text-muted-foreground">₹{product.trialPrice} <span className="text-xs">Trial</span></span>
          <span className="font-semibold text-foreground">₹{product.valuePrice} <span className="text-xs font-normal text-muted-foreground">Value</span></span>
        </div>

        <div className="flex gap-2">
          <Link to={`/product/${product.slug}`} className="flex-1">
            <Button variant="outline" className="w-full text-sm">View Details</Button>
          </Link>
          <Button onClick={handleAddToCart} className="flex-1 gold-gradient text-primary-foreground text-sm font-semibold hover:opacity-90">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
