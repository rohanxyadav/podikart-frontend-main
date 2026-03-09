import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, Image, ShoppingCart, Lock, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const sidebarLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Add Product", to: "/admin/products/new", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Tag },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", to: "/admin/users", icon: Users },
  { label: "Banners", to: "/admin/banners", icon: Image },
  { label: "Blogs", to: "/admin/blogs", icon: LayoutDashboard },
  { label: "Contacts", to: "/admin/contacts", icon: Mail },
  { label: "Partners", to: "/admin/partners", icon: Tag }
];

export default function AdminLayout() {
  const location = useLocation();
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedPin = localStorage.getItem("admin_pin");
    if (storedPin) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      localStorage.setItem("admin_pin", pin);
      setIsAuthenticated(true);
      toast({ title: "Admin Access Granted" });
    } else {
      toast({ title: "Invalid PIN", description: "Please enter a 6-digit PIN", variant: "destructive" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold">Admin <span className="gold-text">Access</span></h1>
            <p className="text-muted-foreground mt-2">Enter your 6-digit protection PIN</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
            <Button type="submit" className="w-full gold-gradient text-primary-foreground font-bold">
              Access Dashboard
            </Button>
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to Store</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border text-center">
          <Link to="/" className="font-display text-xl font-bold gold-text">PODIKART</Link>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">Admin Control Center</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <button
            onClick={() => { localStorage.removeItem("admin_pin"); setIsAuthenticated(false); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors text-left"
          >
            Logout Admin
          </button>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">← Back to Store</Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
