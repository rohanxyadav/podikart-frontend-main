import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus, X, LayoutGrid, Save, ArrowLeft, Loader2, Link } from "lucide-react";
import API_BASE_URL from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function BlogForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        tags: "",
        content: "",
        isHidden: false,
    });

    // Images already on the server (for editing)
    const [existingImages, setExistingImages] = useState<string[]>([]);
    // New image files selected by the user
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    // Previews for new image files
    const [previews, setPreviews] = useState<string[]>([]);

    const { data: blog, isLoading } = useQuery({
        queryKey: ["blog-edit", id],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
            if (!res.ok) throw new Error("Blog not found");
            return res.json();
        },
        enabled: isEdit,
    });

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title,
                slug: blog.slug,
                tags: blog.tags.join(", "),
                content: blog.content,
                isHidden: blog.isHidden,
            });
            setExistingImages(blog.images);
        }
    }, [blog]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (id === "title" && !isEdit) {
            setFormData((prev) => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const totalImages = existingImages.length + newImageFiles.length + files.length;

            if (totalImages > 5) {
                toast({ title: "Limit reached", description: "Max 5 images allowed in total.", variant: "destructive" });
                return;
            }

            setNewImageFiles(prev => [...prev, ...files]);

            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        // Revoke the URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("tags", formData.tags);
            data.append("content", formData.content);
            data.append("isHidden", String(formData.isHidden));

            // Send already uploaded images that were kept
            data.append("existingImages", JSON.stringify(existingImages));

            // Append new files
            newImageFiles.forEach((file) => {
                data.append("images", file);
            });

            const userStr = localStorage.getItem("user");
            const token = userStr ? JSON.parse(userStr).token : "";
            const adminPin = localStorage.getItem('admin_pin') || '';

            const res = await fetch(`${API_BASE_URL}/api/blogs${isEdit ? `/${id}` : ""}`, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-admin-pin": adminPin
                },
                body: data,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to save blog");
            }

            toast({ title: `Blog ${isEdit ? "updated" : "created"} successfully!` });
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            navigate("/admin/blogs");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (isEdit && isLoading) return <div className="p-8 text-center">Loading blog data...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blogs")} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-primary" />
                        <h1 className="font-display text-2xl font-bold">{isEdit ? "Edit" : "Create"} <span className="gold-text">Blog</span></h1>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Blog Title</Label>
                            <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Art of Making Kandi Podi" required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. art-of-kandi-podi" required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input id="tags" value={formData.tags} onChange={handleChange} placeholder="Tradition, Health, Recipe..." required className="mt-1.5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label>Blog Images (Max 5 Total)</Label>
                            <div className="relative mt-1.5 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                                <ImagePlus className="w-8 h-8 text-muted-foreground mb-3" />
                                <p className="text-sm font-medium">Click to upload images</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                                <input
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    disabled={existingImages.length + newImageFiles.length >= 5}
                                />
                            </div>

                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {/* Render existing images */}
                                {existingImages.map((img, idx) => (
                                    <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(idx)}
                                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">EXISTING</div>
                                    </div>
                                ))}

                                {/* Render new previews */}
                                {previews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[8px] text-white text-center py-0.5">NEW</div>
                                    </div>
                                ))}

                                {/* Placeholders */}
                                {Array.from({ length: Math.max(0, 5 - (existingImages.length + newImageFiles.length)) }).map((_, i) => (
                                    <div key={`placeholder-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                                        <Plus className="w-5 h-5 opacity-20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                    <div>
                        <Label htmlFor="content">Content (HTML supported)</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your blog story here..."
                            required
                            className="mt-1.5 min-h-[300px] font-mono text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isHidden"
                            checked={formData.isHidden}
                            onChange={(e) => setFormData(prev => ({ ...prev, isHidden: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="isHidden" className="text-sm font-medium">Hide from public view</Label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                    <Link to="/admin/blogs">
                        <Button type="button" variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="gold-gradient text-primary-foreground font-bold shadow-xl px-8 min-w-[140px]">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {isEdit ? "Update Story" : "Publish Story"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
