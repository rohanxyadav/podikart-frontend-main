import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Share2, Link2, Quote, User } from "lucide-react";
import API_BASE_URL from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function BlogDetailPage() {
    const { id } = useParams();
    const { toast } = useToast();

    const { data: blog, isLoading } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
            if (!res.ok) throw new Error("Blog not found");
            return res.json();
        },
        enabled: !!id,
    });

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "The blog link has been copied to your clipboard." });
    };

    if (isLoading) {
        return (
            <main className="pt-24 pb-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="font-display text-2xl font-bold text-muted-foreground animate-pulse">Loading Story...</h1>
                </div>
            </main>
        );
    }

    if (!blog) {
        return (
            <main className="pt-24 pb-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="font-display text-2xl font-bold mt-4">Story Not Found</h1>
                    <Link to="/blogs" className="text-primary underline mt-4 inline-block">Back to Blogs</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="pb-20">
            <article className="relative">
                {/* Luxury Hero Section */}
                <section className="relative min-h-[60vh] flex items-center pt-24 pb-24">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={blog.images[0]}
                            className="w-full h-full object-cover brightness-[0.4]"
                            alt={blog.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <Link to="/blogs" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-[0.2em] group transition-colors">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-primary" /> Back to Journal
                            </Link>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {blog.tags.map((tag: string) => (
                                    <span key={tag} className="bg-primary/20 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-display font-bold text-white text-lg">
                                        P
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">Podikart Editorial</div>
                                        <div className="text-[10px] text-white/50 flex items-center gap-2 mt-0.5 uppercase tracking-widest">
                                            <Calendar className="w-3 h-3 text-primary" />
                                            {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="container mx-auto px-4 -mt-16 relative z-20">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-2xl border border-border">
                                <div className="mb-12 relative">
                                    <Quote className="absolute -top-8 -left-8 w-16 h-16 text-primary/5 -z-10" />
                                    <p className="text-xl md:text-2xl font-display font-medium text-foreground leading-relaxed italic">
                                        {blog.title} is a journey through traditional flavors and heritage.
                                    </p>
                                </div>

                                <div
                                    className="blog-content prose prose-lg prose-stone max-w-none font-body space-y-6"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* Additional Gallery */}
                                {blog.images.length > 1 && (
                                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {blog.images.slice(1).map((img: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className="aspect-square rounded-[2rem] overflow-hidden border border-border shadow-md"
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:w-1/3 space-y-8">
                            {/* About Author */}
                            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 text-7xl font-display font-black text-black/[0.02] select-none">P</div>
                                <h4 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> The Storyteller
                                </h4>
                                <div className="flex items-center gap-3 mb-4 pt-4 border-t border-border/50">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">PK</div>
                                    <div>
                                        <div className="font-bold text-sm">Podikart Team</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Experts</div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                                    Preserving rich culinary heritage of India, one podi at a time.
                                </p>
                                <Link to="/about">
                                    <Button className="w-full gold-gradient text-primary-foreground font-bold rounded-xl py-5 text-xs uppercase tracking-widest">Learn About Us</Button>
                                </Link>
                            </div>

                            {/* Share */}
                            <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl text-center">
                                <h4 className="font-display text-xl font-bold mb-3">Share Story</h4>
                                <p className="text-white/70 text-xs mb-6">Spread traditional wisdom.</p>
                                <Button onClick={copyLink} className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl py-5 shadow-lg text-xs uppercase tracking-widest">
                                    <Share2 className="w-4 h-4 mr-2" /> Copy Link
                                </Button>
                            </div>
                        </aside>
                    </div>
                </section>
            </article>

            <style>{`
        .blog-content p { color: hsl(var(--muted-foreground)); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1.05rem; }
        .blog-content h2 { font-family: var(--font-display); font-size: 1.875rem; font-weight: 800; color: hsl(var(--foreground)); margin-top: 3rem; margin-bottom: 1.5rem; }
        .blog-content ul { list-style: none; padding: 0; margin-bottom: 2rem; }
        .blog-content li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; color: hsl(var(--muted-foreground)); font-size: 1rem; }
        .blog-content li::before { content: ""; position: absolute; left: 0; top: 0.65rem; width: 6px; height: 6px; background-color: hsl(var(--primary)); border-radius: 999px; }
        .blog-content blockquote { border-left: 6px solid hsl(var(--primary)); padding: 1.5rem 2rem; font-style: italic; color: hsl(var(--foreground)); margin: 2.5rem 0; font-size: 1.25rem; background-color: hsl(var(--primary) / 0.03); border-radius: 0 2rem 2rem 0; font-family: var(--font-display); }
      `}</style>
        </main>
    );
}
