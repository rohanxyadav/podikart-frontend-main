import { useState, useRef } from "react";
import { Plus, Edit, Trash2, ImagePlus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from "@/lib/api";

export default function AdminCategories() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const createCategory = useMutation({
    mutationFn: async (newCategory: any) => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const adminPin = localStorage.getItem('admin_pin') || '';

      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("slug", newCategory.slug);
      formData.append("description", newCategory.description);
      if (image) formData.append("image", image);

      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-admin-pin": adminPin
        },
        body: formData,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to create category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setSlug("");
      setDescription("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Category added successfully!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const adminPin = localStorage.getItem('admin_pin') || '';

      const formData = new FormData();
      formData.append("description", data.description);
      if (editImage) {
        formData.append("image", editImage);
      }

      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-admin-pin": adminPin
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setEditImage(null);
      toast({ title: "Category updated!" });
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const adminPin = localStorage.getItem('admin_pin') || '';
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-admin-pin": adminPin
        },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category deleted!" });
    }
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    createCategory.mutate({ name, slug, description });
  };

  const startEdit = (c: any) => {
    setEditingId(c._id);
    setEditDesc(c.description || "");
    setEditImage(null);
  };

  const handleUpdate = (id: string) => {
    updateCategory.mutate({ id, data: { description: editDesc } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Traditional Andhra" required />
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. traditional-andhra" required />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short desc" />
            </div>
            <div>
              <label className="text-sm font-medium">Image (Optional)</label>
              <div className="flex gap-2">
                <Input type="file" ref={fileInputRef} onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-xs" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={createCategory.isPending} className="gold-gradient text-primary-foreground font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </div>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center text-muted-foreground p-8">Loading categories...</div>
        ) : categories.map((c: any) => (
          <div key={c._id || c.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                {c.image && (
                  <img src={c.image} alt={c.name} className="w-16 h-16 rounded-lg object-cover border border-border" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{c.name}</h3>
                  <p className="text-xs text-primary font-medium">Slug: {c.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteCategory.mutate(c._id)} className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingId === c._id ? (
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Edit Description</label>
                  <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Image</label>
                  <Input type="file" onChange={(e) => setEditImage(e.target.files?.[0] || null)} className="text-xs" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                  <Button size="sm" className="gold-gradient" disabled={updateCategory.isPending} onClick={() => handleUpdate(c._id)}>
                    <Save className="w-4 h-4 mr-2" /> {updateCategory.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
