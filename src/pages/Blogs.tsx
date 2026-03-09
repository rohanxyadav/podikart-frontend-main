import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/api";
import { Button } from "@/components/ui/button";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function BlogsPage() {
    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/blogs`);
            if (!res.ok) throw new Error("Failed to fetch blogs");
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <main className="pt-24 pb-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="font-display text-2xl font-bold text-muted-foreground animate-pulse">Loading Blogs...</h1>
                </div>
            </main>
        );
    }

    return (
        <main className="pb-20">
            {/* Premium Hero Banner - More Compact */}
            <section className="relative pt-24 pb-16 overflow-hidden bg-[#FAF7F2]">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.8 }}>
                        <span className="inline-flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-3 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                            <Sparkles className="w-3 h-3" /> Podikart Stories
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
                            Our <span className="gold-text italic">Journal</span>
                        </h1>
                        <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed font-medium">
                            Discover traditional wisdom and health insights from the heritage of Indian spices.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 max-w-7xl -mt-6 relative z-20">
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-[2rem] border border-dashed border-border shadow-xl">
                        <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-bold mb-2">New stories coming soon...</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map((blog: any, i: number) => (
                            <motion.article
                                key={blog._id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Image Section - Top for 2-column layout */}
                                    <Link to={`/blog/${blog._id}`} className="relative overflow-hidden h-64">
                                        <img
                                            src={blog.images[0]}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {blog.tags.slice(0, 2).map((tag: string) => (
                                                <span key={tag} className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-primary shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>

                                    {/* Text Section */}
                                    <div className="p-8 flex flex-col flex-1 bg-white">
                                        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-primary" />
                                                {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <h2 className="font-display text-2xl font-bold mb-4 group-hover:text-primary transition-all duration-500 leading-tight line-clamp-2">
                                            {blog.title}
                                        </h2>

                                        <div
                                            className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed font-body italic"
                                            dangerouslySetInnerHTML={{ __html: blog.content }}
                                        />

                                        <div className="mt-auto">
                                            <Link to={`/blog/${blog._id}`}>
                                                <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary font-bold text-[10px] tracking-widest uppercase group/link">
                                                    Read Full Story <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
