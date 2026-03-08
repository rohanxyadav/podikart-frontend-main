import productPodi1 from "@/assets/product-podi-1.jpg";
import productPodi2 from "@/assets/product-podi-2.jpg";
import productPodi3 from "@/assets/product-podi-3.jpg";
import productPodi4 from "@/assets/product-podi-4.jpg";
import productPodi5 from "@/assets/product-podi-5.jpg";
import productPodi6 from "@/assets/product-podi-6.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  trialPrice: number;
  valuePrice: number;
  ingredients: string[];
  benefits: string[];
  usage: string[];
  shelfLife: string;
  weight: number;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Kandi Podi",
    slug: "kandi-podi",
    shortDescription: "Classic Andhra-style toor dal podi with rich, earthy flavors.",
    description: "Our signature Kandi Podi is made from premium toor dal, slow-roasted to perfection and blended with hand-picked red chilies and cumin. A staple on every Telugu dining table, this podi delivers authentic taste that takes you back to Grandma's kitchen.",
    image: productPodi1,
    category: "traditional-andhra",
    rating: 4.8,
    reviewCount: 124,
    trialPrice: 100,
    valuePrice: 150,
    ingredients: ["Toor Dal", "Red Chilies", "Cumin Seeds", "Garlic", "Salt", "Cold-pressed Oil"],
    benefits: ["High in Protein", "Rich in Iron", "No Preservatives", "Low Oil Content"],
    usage: ["Mix with hot rice and ghee", "Sprinkle on idli or dosa", "Use as a dry chutney", "Add to buttermilk rice"],
    shelfLife: "3 months",
    weight: 250,
    featured: true,
  },
  {
    id: "2",
    name: "Nuvvula Podi",
    slug: "nuvvula-podi",
    shortDescription: "Nutty sesame podi packed with calcium and flavor.",
    description: "Made from white sesame seeds, gently roasted and ground with aromatic spices. Nuvvula Podi is a calcium-rich powerhouse that pairs beautifully with rice, ghee, and traditional South Indian meals.",
    image: productPodi5,
    category: "protein-podis",
    rating: 4.7,
    reviewCount: 98,
    trialPrice: 100,
    valuePrice: 150,
    ingredients: ["White Sesame Seeds", "Dry Red Chilies", "Cumin", "Salt", "Asafoetida"],
    benefits: ["Rich in Calcium", "Good for Bones", "Heart Healthy", "No Artificial Colors"],
    usage: ["Mix with steamed rice and sesame oil", "Pair with dosa and ghee", "Add to roti rolls"],
    shelfLife: "3 months",
    weight: 200,
    featured: true,
  },
  {
    id: "3",
    name: "Palli Podi",
    slug: "palli-podi",
    shortDescription: "Crunchy peanut podi with a bold, spicy kick.",
    description: "Roasted peanuts blended with fiery red chilies and aromatic garlic. This protein-rich podi is a favorite across Telangana households and adds the perfect crunch to any meal.",
    image: productPodi3,
    category: "spicy-podis",
    rating: 4.6,
    reviewCount: 87,
    trialPrice: 100,
    valuePrice: 150,
    ingredients: ["Peanuts", "Red Chilies", "Garlic", "Cumin", "Salt"],
    benefits: ["High in Protein", "Energy Boosting", "Rich in Healthy Fats", "No MSG"],
    usage: ["Mix with rice and oil", "Stuff in dosa", "Sprinkle on upma", "Mix with curd rice"],
    shelfLife: "2 months",
    weight: 250,
    featured: true,
  },
  {
    id: "4",
    name: "Karivepaku Podi",
    slug: "karivepaku-podi",
    shortDescription: "Aromatic curry leaf podi – iron-rich and flavorful.",
    description: "Fresh curry leaves dried in shade and ground with lentils and spices. This unique podi brings incredible aroma and is known for its hair and health benefits in traditional Ayurveda.",
    image: productPodi4,
    category: "mild-podis",
    rating: 4.5,
    reviewCount: 76,
    trialPrice: 100,
    valuePrice: 150,
    ingredients: ["Curry Leaves", "Urad Dal", "Chana Dal", "Dry Red Chilies", "Tamarind", "Salt"],
    benefits: ["Rich in Iron", "Good for Hair", "Aids Digestion", "Antioxidant Rich"],
    usage: ["Mix with hot rice and ghee", "Pair with idli", "Add to buttermilk"],
    shelfLife: "2 months",
    weight: 200,
    featured: true,
  },
  {
    id: "5",
    name: "Flaxseed Podi",
    slug: "flaxseed-podi",
    shortDescription: "Modern health podi with omega-3 rich flaxseeds.",
    description: "A contemporary take on traditional podi, using nutrient-dense flaxseeds combined with classic South Indian spices. Perfect for health-conscious families who don't want to compromise on taste.",
    image: productPodi2,
    category: "protein-podis",
    rating: 4.7,
    reviewCount: 65,
    trialPrice: 120,
    valuePrice: 180,
    ingredients: ["Flaxseeds", "Sesame Seeds", "Red Chilies", "Cumin", "Garlic", "Salt"],
    benefits: ["Rich in Omega-3", "High Fiber", "Heart Healthy", "Weight Management"],
    usage: ["Mix with rice and oil", "Add to smoothies", "Sprinkle on salads", "Mix with yogurt"],
    shelfLife: "2 months",
    weight: 250,
    featured: true,
  },
  {
    id: "6",
    name: "Minapa Podi",
    slug: "minapa-podi",
    shortDescription: "Traditional urad dal podi with authentic Telangana taste.",
    description: "Black gram dal roasted to a golden hue and ground with aromatic spices. Minapa Podi is a Telangana classic that adds depth and protein to every meal.",
    image: productPodi6,
    category: "telangana-specials",
    rating: 4.6,
    reviewCount: 91,
    trialPrice: 100,
    valuePrice: 150,
    ingredients: ["Urad Dal", "Red Chilies", "Cumin", "Garlic", "Asafoetida", "Salt"],
    benefits: ["Protein Rich", "Aids Muscle Health", "Traditional Recipe", "No Preservatives"],
    usage: ["Mix with rice and ghee", "Pair with pesarattu", "Add to dosa batter mix"],
    shelfLife: "3 months",
    weight: 200,
    featured: true,
  },
];

export const categories = [
  { id: "spicy-podis", name: "Spicy Podis", description: "Bold, fiery flavors for spice lovers", count: 4 },
  { id: "mild-podis", name: "Mild Podis", description: "Gentle flavors for everyday meals", count: 3 },
  { id: "protein-podis", name: "Protein Podis", description: "Nutrient-dense podis for health-conscious families", count: 3 },
  { id: "traditional-andhra", name: "Traditional Andhra Style", description: "Authentic recipes from Andhra Pradesh", count: 5 },
  { id: "telangana-specials", name: "Telangana Specials", description: "Classic Telangana household favorites", count: 4 },
  { id: "combo-packs", name: "Combo Packs", description: "Curated packs for the complete podi experience", count: 3 },
];

export const WHATSAPP_NUMBER = "917989907021"; // Replace with actual number

export function getWhatsAppLink(productName: string, packSize: string, quantity: number = 1) {
  const message = encodeURIComponent(
    `Hi! I'd like to order from Podikart:\n\nProduct: ${productName}\nPack: ${packSize}\nQuantity: ${quantity}\n\nPlease confirm availability and total.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
