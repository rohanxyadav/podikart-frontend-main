import { useState } from "react";
import { Edit, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Image } from "@imagekit/react";
import API_BASE_URL from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const adminPin = localStorage.getItem('admin_pin') || '';
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { "x-admin-pin": adminPin }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const adminPin = localStorage.getItem('admin_pin') || '';
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-admin-pin": adminPin
        }
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const hideToggleMutation = useMutation({
    mutationFn: async ({ id, isHidden }: { id: string, isHidden: boolean }) => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const adminPin = localStorage.getItem('admin_pin') || '';
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-admin-pin": adminPin
        },
        body: JSON.stringify({ isHidden: !isHidden })
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Visibility updated" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button className="gold-gradient text-primary-foreground font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-4 text-sm font-semibold text-muted-foreground">Product</th>
              <th className="p-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Category</th>
              <th className="p-4 text-sm font-semibold text-muted-foreground">Price</th>
              <th className="p-4 text-sm font-semibold text-muted-foreground hidden md:table-cell text-center">Visibility</th>
              <th className="p-4 text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Loading products...</td></tr>
            ) : products.map((p: any) => {
              return (
                <tr key={p._id || p.id} className={`border-b border-border last:border-0 ${p.isHidden ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Image src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-sm text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell capitalize">{p.category.replace(/-/g, " ")}</td>
                  <td className="p-4 text-sm text-foreground">₹{p.trialPrice}–₹{p.valuePrice}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell text-center">
                    <button
                      onClick={() => hideToggleMutation.mutate({ id: p._id, isHidden: p.isHidden })}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                      title={p.isHidden ? "Hidden - Click to unhide" : "Visible - Click to hide"}
                    >
                      {p.isHidden ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-primary" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/edit/${p._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(p._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
