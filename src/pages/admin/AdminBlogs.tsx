import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff, LayoutGrid, List } from "lucide-react";
import API_BASE_URL from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlogs() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ["admin-blogs"],
        queryFn: async () => {
            const userStr = localStorage.getItem("user");
            const token = userStr ? JSON.parse(userStr).token : "";
            const res = await fetch(`${API_BASE_URL}/api/blogs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch blogs");
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const userStr = localStorage.getItem("user");
            const token = userStr ? JSON.parse(userStr).token : "";
            const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete blog");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            toast({ title: "Blog deleted", description: "The blog post has been removed successfully." });
        },
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async ({ id, isHidden }: { id: string; isHidden: boolean }) => {
            const userStr = localStorage.getItem("user");
            const token = userStr ? JSON.parse(userStr).token : "";
            const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isHidden: !isHidden }),
            });
            if (!res.ok) throw new Error("Failed to update visibility");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
            toast({ title: "Visibility updated", description: "Blog visibility has been toggled." });
        },
    });

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading blogs...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-primary" />
                        Manage <span className="gold-text">Blogs</span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Create, edit, and manage your blog posts.</p>
                </div>
                <Link to="/admin/blogs/new">
                    <Button className="gold-gradient text-primary-foreground font-bold shadow-lg">
                        <Plus className="w-4 h-4 mr-2" /> Create New Blog
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Preview</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Title</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Date Created</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {blogs.map((blog: any) => (
                                <tr key={blog._id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4">
                                        <img src={blog.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg border border-border" />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-foreground line-clamp-1">{blog.title}</div>
                                        <div className="flex gap-1 mt-1">
                                            {blog.tags.slice(0, 3).map((t: string) => (
                                                <span key={t} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleVisibilityMutation.mutate({ id: blog._id, isHidden: blog.isHidden })}
                                                className={`hover:bg-primary/10 ${blog.isHidden ? "text-muted-foreground" : "text-primary"}`}
                                                title={blog.isHidden ? "Unhide" : "Hide"}
                                            >
                                                {blog.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Link to={`/admin/blogs/edit/${blog._id}`}>
                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-muted-foreground hover:text-primary">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this blog?")) {
                                                        deleteMutation.mutate(blog._id);
                                                    }
                                                }}
                                                className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {blogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                                        No blogs found. Go ahead and create your first story!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
