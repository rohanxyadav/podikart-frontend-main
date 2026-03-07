import { useRef } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function CategoryRow({ categoryId, categoryName, categoryDescription, categoryProducts }: { categoryId: string; categoryName: string; categoryDescription: string, categoryProducts: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!categoryProducts || categoryProducts.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ duration: 0.5 }} className="mb-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{categoryName}</h2>
          <p className="text-muted-foreground text-sm mt-1">{categoryDescription}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {categoryProducts.map((p) => (
          <div key={p._id || p.id} className="min-w-[280px] max-w-[300px] snap-start shrink-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterCategory = searchParams.get("category");
  const sortBy = searchParams.get("sort") || "";

  const { data: allProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", filterCategory, sortBy],
    queryFn: async () => {
      let url = `${API_BASE_URL}/api/products`;
      const params = new URLSearchParams();
      if (filterCategory) params.append("category", filterCategory);
      if (sortBy) params.append("sort", sortBy);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    }
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("sort", e.target.value);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
  };

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    }
  });

  const displayCategories = filterCategory
    ? categories.filter((c: any) => c.slug === filterCategory)
    : categories;

  if (isLoadingProducts || isLoadingCategories) {
    return <main className="pt-24 pb-20 text-center text-muted-foreground">Loading products...</main>;
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <span className="text-primary font-semibold text-sm tracking-[0.15em] uppercase">Our Collection</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
              All <span className="gold-text">Premium Podis</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-card border border-border p-2 pr-4 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground cursor-pointer outline-none"
            >
              <option value="">Newest First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {displayCategories.map((c: any) => (
          <CategoryRow
            key={c._id || c.id}
            categoryId={c.slug}
            categoryName={c.name}
            categoryDescription={c.description}
            categoryProducts={allProducts.filter((p: any) => p.category === c.slug)}
          />
        ))}
      </div>
    </main>
  );
}
