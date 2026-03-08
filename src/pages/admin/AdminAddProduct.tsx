import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Package, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/api";

export default function AdminAddProduct() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const { data: categories = [] } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const adminPin = localStorage.getItem('admin_pin') || '';
            const res = await fetch(`${API_BASE_URL}/api/categories`, {
                headers: { "x-admin-pin": adminPin }
            });
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        }
    });

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        category: "",
        trialPrice: "", // Discounted Price
        valuePrice: "", // Original Price
        weight: "",
        ingredients: "",
        benefits: "",
        usage: "",
        shelfLife: "3 months",
        rating: "0",
    });
    const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
    const [reviews, setReviews] = useState([
        { name: "", rating: 5, comment: "" },
        { name: "", rating: 5, comment: "" }
    ]);
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index][field] = value;
        setFaqs(newFaqs);
    };

    const addFaq = () => {
        if (faqs.length < 5) {
            setFaqs([...faqs, { question: "", answer: "" }]);
        }
    };

    const removeFaq = (index: number) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const handleReviewChange = (index: number, field: string, value: any) => {
        const newReviews = [...reviews];
        (newReviews[index] as any)[field] = value;
        setReviews(newReviews);
    };

    const addReview = () => {
        setReviews([...reviews, { name: "", rating: 5, comment: "" }]);
    };

    const removeReview = (index: number) => {
        if (reviews.length > 2) {
            setReviews(reviews.filter((_, i) => i !== index));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (['ingredients', 'benefits', 'usage'].includes(key)) {
                    form.append(key, JSON.stringify(value.split(',').map((item) => item.trim())));
                } else {
                    form.append(key, value);
                }
            });

            form.append("faqs", JSON.stringify(faqs.filter(f => f.question && f.answer)));
            form.append("reviews", JSON.stringify(reviews.filter(r => r.name && r.comment)));

            if (image) {
                form.append("image", image);
            }
            // ... rest of submit logic ...

            // Note: Assuming token is stored in localStorage by your frontend auth implementation.
            // Or you might use cookies if backend sends it as httpOnly.
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : '';
            const adminPin = localStorage.getItem('admin_pin') || '';

            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-admin-pin': adminPin
                },
                body: form,
            });

            if (res.ok) {
                toast({ title: "Product created successfully!" });
                navigate('/admin/products');
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create product');
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Package className="w-8 h-8 text-primary" />
                <h1 className="font-display text-2xl font-bold">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. Kandi Podi" required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. kandi-podi" required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e: any) => handleChange(e)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((c: any) => (
                                    <option key={c._id || c.id} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="trialPrice">Discounted price (₹)</Label>
                                <Input id="trialPrice" type="number" value={formData.trialPrice} onChange={handleChange} placeholder="100" required className="mt-1.5" />
                            </div>
                            <div>
                                <Label htmlFor="valuePrice">Original price (₹)</Label>
                                <Input id="valuePrice" type="number" value={formData.valuePrice} onChange={handleChange} placeholder="150" required className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (Grams)</Label>
                            <Input id="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="e.g. 500" required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="shelfLife">Shelf Life</Label>
                            <Input id="shelfLife" value={formData.shelfLife} onChange={handleChange} placeholder="e.g. 3 months" required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="rating">Overall Rating (0-5)</Label>
                            <Input id="rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} required className="mt-1.5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="image">Product Image</Label>
                            <div className="relative mt-1.5 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                                <ImagePlus className="w-8 h-8 text-muted-foreground mb-3" />
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {image && <p className="text-sm text-green-600 mt-2">Selected: {image.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Input id="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief summary for cards" required className="mt-1.5" />
                        </div>
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold">FAQs (Max 5)</Label>
                        {faqs.length < 5 && (
                            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                                <Plus className="w-4 h-4 mr-1" /> Add FAQ
                            </Button>
                        )}
                    </div>
                    {faqs.map((faq, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-lg relative">
                            <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => removeFaq(index)}>
                                <X className="w-3 h-3" />
                            </Button>
                            <div>
                                <Label>Question</Label>
                                <Input value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} placeholder="Question" className="mt-1" />
                            </div>
                            <div>
                                <Label>Answer</Label>
                                <Textarea value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} placeholder="Answer" className="mt-1" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reviews Section */}
                <div className="space-y-4 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold">Admin Reviews (Min 2)</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addReview}>
                            <Plus className="w-4 h-4 mr-1" /> Add Review
                        </Button>
                    </div>
                    {reviews.map((review, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-border rounded-lg relative">
                            {reviews.length > 2 && (
                                <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => removeReview(index)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            )}
                            <div>
                                <Label>Reviewer Name</Label>
                                <Input value={review.name} onChange={(e) => handleReviewChange(index, 'name', e.target.value)} placeholder="Name" className="mt-1" />
                            </div>
                            <div>
                                <Label>Rating (1-5)</Label>
                                <Input type="number" min="1" max="5" value={review.rating} onChange={(e) => handleReviewChange(index, 'rating', parseInt(e.target.value))} className="mt-1" />
                            </div>
                            <div className="md:col-span-3">
                                <Label>Comment</Label>
                                <Textarea value={review.comment} onChange={(e) => handleReviewChange(index, 'comment', e.target.value)} placeholder="Comment" className="mt-1" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                    <div>
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Detailed product description..." required className="mt-1.5 min-h-[120px]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                            <Input id="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="Dal, Chili, Salt..." required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                            <Input id="benefits" value={formData.benefits} onChange={handleChange} placeholder="Rich in Iron, Healthy..." required className="mt-1.5" />
                        </div>
                        <div>
                            <Label htmlFor="usage">Usage (comma-separated)</Label>
                            <Input id="usage" value={formData.usage} onChange={handleChange} placeholder="With rice, with idli..." required className="mt-1.5" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <Button type="submit" disabled={loading} className="gold-gradient text-primary-foreground font-bold shadow-lg md:w-auto w-full">
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
