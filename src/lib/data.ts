/**
 * Single source of truth for all site content.
 *
 * Pages and components must import from here; never inline product copy,
 * prices, or farmer detail in JSX. Adding a listing means editing this file
 * only.
 */

export type Diet = "Vegan" | "Vegetarian" | "Non-Veg" | "Contains dairy";
export type Spice = "Non-spicy" | "Mild" | "Medium" | "Spicy" | "Aromatic";

export type ProductCategory =
  | "Leafy Greens"
  | "Vegetables"
  | "Fruit"
  | "Dairy & Eggs"
  | "Grains & Pulses"
  | "Oils & Ghee"
  | "Foraged"
  | "Meat";

export interface Product {
  id: string;
  name: string;
  nepaliName: string;
  /** Selling price in NPR. Authoritative — the figure shown to customers. */
  price: number;
  /** Pre-discount price in NPR. Omitted when the item is not reduced. */
  oldPrice?: number;
  /** Selling unit as printed on the listing, e.g. "500g bunch". */
  unit: string;
  desc: string;
  category: ProductCategory;
  /** Harvest window, e.g. "Oct–Mar". Absent for year-round staples. */
  season?: string;
  outOfStock: boolean;
}

/** Percent off, derived from the price pair so a badge can never go stale. */
export function discountPercent(product: {
  price: number;
  oldPrice?: number;
}): number | null {
  if (!product.oldPrice || product.oldPrice <= product.price) return null;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

/** Absolute rupee saving, or null when the item is not reduced. */
export function savings(product: {
  price: number;
  oldPrice?: number;
}): number | null {
  if (!product.oldPrice || product.oldPrice <= product.price) return null;
  return product.oldPrice - product.price;
}

export const products: Product[] = [
  {
    id: "palung-spinach",
    name: "Fresh Palung Spinach",
    nepaliName: "पालुंगो",
    price: 43,
    oldPrice: 50,
    unit: "1 bunch",
    desc: "Tender highland leaves picked pre-dawn from chemical-free terrace soil.",
    category: "Leafy Greens",
    season: "Oct–Mar",
    outOfStock: false,
  },
  {
    id: "cauliflower",
    name: "Local Cauliflower",
    nepaliName: "काउली",
    price: 60,
    unit: "1 kg",
    desc: "Dense white curds from Kavre morning fields, cooled within the hour.",
    category: "Vegetables",
    outOfStock: false,
  },
  {
    id: "tomatoes",
    name: "Hill Tomatoes",
    nepaliName: "टमाटर",
    price: 90,
    unit: "1 kg",
    desc: "Ripened on the vine in thin valley air for a deeper, less watery flesh.",
    category: "Vegetables",
    outOfStock: false,
  },
  {
    id: "sweet-oranges",
    name: "Fresh Sweet Oranges",
    nepaliName: "सुन्तला",
    price: 176,
    oldPrice: 220,
    unit: "1 kg crate",
    desc: "Orchard-picked Gorkha citrus, hand-sorted for brix and left unbruised.",
    category: "Fruit",
    season: "Oct–Dec",
    outOfStock: false,
  },
  {
    id: "farm-eggs",
    name: "Farm Eggs",
    nepaliName: "गाउँले अण्डा",
    price: 480,
    unit: "1 crate, 30 pcs",
    desc: "Free-roaming country hens on pesticide-free fodder, delivered chilled.",
    category: "Dairy & Eggs",
    outOfStock: false,
  },
  {
    id: "fresh-milk",
    name: "Fresh Milk",
    nepaliName: "दूध",
    price: 130,
    unit: "1 L glass bottle",
    desc: "Raw unhomogenised A2 milk from pasture-grazed native cows.",
    category: "Dairy & Eggs",
    outOfStock: false,
  },
  {
    id: "himali-basmati-rice",
    name: "Himali Basmati Rice",
    nepaliName: "बासमती",
    price: 357,
    oldPrice: 420,
    unit: "5 kg bag",
    desc: "Aged long-grain Himali basmati, stone-milled to order for whole-grain bite.",
    category: "Grains & Pulses",
    outOfStock: false,
  },
  {
    id: "red-lentil",
    name: "Red Lentil",
    nepaliName: "मसुर दाल",
    price: 250,
    unit: "1 kg",
    desc: "Split Masoor from Jumla terraces, hand-sorted and sun-dried on stone.",
    category: "Grains & Pulses",
    outOfStock: false,
  },
  {
    id: "mustard-oil",
    name: "Mustard Oil",
    nepaliName: "तोरीको तेल",
    price: 320,
    unit: "1 L glass",
    desc: "Cold-pressed Mustang seed, low-heat so the pungency stays bright.",
    category: "Oils & Ghee",
    outOfStock: false,
  },
  {
    id: "wild-honey",
    name: "Wild Honey",
    nepaliName: "सिस्नो मह",
    price: 1232,
    oldPrice: 1400,
    unit: "500 g jar",
    desc: "Raw cliff honey gathered at 2,400m, unheated and unfiltered.",
    category: "Foraged",
    outOfStock: false,
  },
  {
    id: "cow-ghee",
    name: "Cow Ghee",
    nepaliName: "गाईको घ्यू",
    price: 1440,
    unit: "500 g jar",
    desc: "Bilona churned from cultured butter, slow-cooked to a nutty aroma.",
    category: "Oils & Ghee",
    outOfStock: false,
  },
  {
    id: "goat-meat",
    name: "Goat Meat",
    nepaliName: "खसीको मासु",
    price: 1150,
    unit: "1 kg",
    desc: "Whole pasture-grazed cuts, butchered to order on the morning of dispatch.",
    category: "Meat",
    outOfStock: false,
  },
  {
    id: "morel-mushroom",
    name: "Morel Mushroom",
    nepaliName: "सिनार",
    price: 1440,
    unit: "100 g glass jar",
    desc: "Forest-gathered after the first monsoon rains. Season closed until next year.",
    category: "Foraged",
    outOfStock: true,
  },
];

export interface Dish {
  id: string;
  name: string;
  nepaliName: string;
  price: number;
  /** Serving size as printed, e.g. "10 pcs" or "1 Thali". */
  portion: string;
  desc: string;
  /** Kitchen time window, e.g. "25–35 min". */
  prepTime: string;
  spice: Spice;
  diet: Diet;
}

export const dishes: Dish[] = [
  {
    id: "dal-bhat-set",
    name: "Dal Bhat Set",
    nepaliName: "दाल भात सेट",
    price: 450,
    portion: "1 Thali",
    desc: "Yellow dal, steamed rice, tarkari, and achar on a brass thali.",
    prepTime: "25–35 min",
    spice: "Mild",
    diet: "Vegan",
  },
  {
    id: "chicken-momo",
    name: "Chicken Momo",
    nepaliName: "कुखुराको मःम",
    price: 320,
    portion: "10 pcs",
    desc: "Minced country chicken with ginger and scallion, folded thin.",
    prepTime: "20–30 min",
    spice: "Medium",
    diet: "Non-Veg",
  },
  {
    id: "veg-momo",
    name: "Veg Momo",
    nepaliName: "भेज मःम",
    price: 260,
    portion: "10 pcs",
    desc: "Buckwheat dough wrapped around cabbage, carrot, and wild herbs.",
    prepTime: "20–25 min",
    spice: "Mild",
    diet: "Vegetarian",
  },
  {
    id: "veg-thukpa",
    name: "Veg Thukpa",
    nepaliName: "भेज थुक्पा",
    price: 280,
    portion: "650 ml bowl",
    desc: "Hand-pulled noodles in a warming broth of greens and tomato.",
    prepTime: "20–30 min",
    spice: "Medium",
    diet: "Vegan",
  },
  {
    id: "millet-dhido-set",
    name: "Millet Dhido Set",
    nepaliName: "कोदोको ढिँडो सेट",
    price: 380,
    portion: "1 Thali",
    desc: "Ancient millet cooked soft, served with gundruk and fried lentil.",
    prepTime: "30–40 min",
    spice: "Medium",
    diet: "Vegetarian",
  },
  {
    id: "sel-roti-aloo-tarkari",
    name: "Sel Roti + Aloo Tarkari",
    nepaliName: "सेल रोटी र आलु",
    price: 220,
    portion: "2 pcs + Curry",
    desc: "Ring-shaped rice bread griddled fresh, with mustard-oil potato curry.",
    prepTime: "15–25 min",
    spice: "Mild",
    diet: "Vegan",
  },
  {
    id: "chicken-choila",
    name: "Chicken Choila",
    nepaliName: "कुखुराको छोइला",
    price: 340,
    portion: "300 g",
    desc: "Charred chicken tossed with mustard oil, fenugreek, and green chilli.",
    prepTime: "25–35 min",
    spice: "Spicy",
    diet: "Non-Veg",
  },
  {
    id: "masala-chiya",
    name: "Masala Chiya",
    nepaliName: "मसाला चिया",
    price: 80,
    portion: "250 ml clay kulhad",
    desc: "Leaf tea boiled with ginger, cardamom, clove, and a splash of milk.",
    prepTime: "10–15 min",
    spice: "Aromatic",
    diet: "Contains dairy",
  },
  {
    id: "sweet-lassi",
    name: "Sweet Lassi",
    nepaliName: "मिठो लस्सी",
    price: 150,
    portion: "300 ml",
    desc: "Churned buffalo milk with cardamom, sugar, and a pistachio crumb.",
    prepTime: "5–10 min",
    spice: "Non-spicy",
    diet: "Vegetarian",
  },
  {
    id: "fresh-orange-juice",
    name: "Fresh Orange Juice",
    nepaliName: "सुन्तलाको जुस",
    price: 180,
    portion: "400 ml",
    desc: "Cold-pressed Gorkha oranges, no sugar and no concentrate.",
    prepTime: "5 min",
    spice: "Non-spicy",
    diet: "Vegan",
  },
];

export interface Basket {
  id: string;
  name: string;
  nepaliName: string;
  price: number;
  oldPrice?: number;
  /** Short shelf-life framing line, e.g. "Nutrient Dense". */
  tag: string;
  desc: string;
  /** Line items summarised for the basket detail view. */
  includes: string[];
}

export const baskets: Basket[] = [
  {
    id: "complete-kitchen",
    name: "Complete Kitchen Basket",
    nepaliName: "सम्पूर्ण भान्सा टोकरी",
    price: 1974,
    oldPrice: 2320,
    tag: "Daily Pantry Essential",
    desc: "Everyday staples for a working kitchen, assembled before the 5:00 AM cutoff.",
    includes: [
      "Palung spinach (2 bunches)",
      "Cauliflower (1 kg)",
      "Hill tomatoes (1 kg)",
      "Farm eggs (12 pcs)",
      "Red lentil (1 kg)",
      "Mustard oil (500 ml)",
    ],
  },
  {
    id: "healthy-family",
    name: "Healthy Family Basket",
    nepaliName: "स्वस्थ परिवार टोकरी",
    price: 2988,
    oldPrice: 3450,
    tag: "Nutrient Dense",
    desc: "Protein-forward weekly haul for a family of four.",
    includes: [
      "Farm eggs (24 pcs)",
      "Fresh milk (2 L)",
      "Cow ghee (500 g)",
      "Palung spinach (3 bunches)",
      "Hill tomatoes (2 kg)",
      "Himali basmati rice (5 kg)",
    ],
  },
  {
    id: "traditional-nepali",
    name: "Traditional Nepali Basket",
    nepaliName: "परम्परागत नेपाली टोकरी",
    price: 2330,
    oldPrice: 2710,
    tag: "Heritage Heirloom",
    desc: "The valley's own pantry: fermented, milled, and pressed the old way.",
    includes: [
      "Red lentil (2 kg)",
      "Mustard oil (1 L)",
      "Cow ghee (500 g)",
      "Fresh milk (1 L)",
      "Himali basmati rice (5 kg)",
      "Seasonal valley roots (1 kg)",
    ],
  },
  {
    id: "dashain-family",
    name: "Dashain Family Basket",
    nepaliName: "दशैं पारिवारिक सौगात",
    price: 9329,
    tag: "Highland Festival Reserve",
    desc: "A ceremonial reserve for the biggest days of the year, allocated by request.",
    includes: [
      "Aged Jumla red rice (5 kg)",
      "Pure hand-churned bilona ghee (1 L earthen pot)",
      "Mustang wild walnuts (500 g)",
      "Wild honey (500 g jar)",
      "Goat meat butcher reserve voucher",
    ],
  },
];

export interface Farmer {
  id: string;
  name: string;
  location: string;
  /** Single-line summary of what makes this group distinct. */
  story: string;
}

export const farmers: Farmer[] = [
  {
    id: "kavre-growers-group",
    name: "Kavre Growers Group",
    location: "Kavre Valley, 1,500m",
    story:
      "Fourteen families growing chemical-free greens on terrace plots watered by mountain springs, harvested strictly to order at dawn.",
  },
  {
    id: "hill-producers-network",
    name: "Hill Producers Network",
    location: "Jumla & High Hills, 2,400–3,200m",
    story:
      "Indigenous high-altitude agro-pastoral methods passed down through generations, with no synthetic intervention at any stage.",
  },
  {
    id: "local-dairy-poultry-partners",
    name: "Local Dairy & Poultry Partners",
    location: "Kathmandu Valley Foothills & Godavari",
    story:
      "Pasture-grazed native cows and country hens fed organic fodder, milked and collected the same day under cold-chain handling.",
  },
];

export interface Offer {
  /** Product id from `products`, kept as a reference so prices stay in one place. */
  productId: Product["id"];
  /** Units held in this allocation. */
  allocation: number;
  /** Date the allocation window shuts, ISO 8601. */
  closesAt: string;
}

const OPEN_OFFERS: Offer[] = [
  { productId: "palung-spinach", allocation: 120, closesAt: "2026-10-12T05:00:00+05:45" },
  { productId: "sweet-oranges", allocation: 80, closesAt: "2026-10-12T05:00:00+05:45" },
  { productId: "wild-honey", allocation: 40, closesAt: "2026-10-13T05:00:00+05:45" },
  { productId: "himali-basmati-rice", allocation: 60, closesAt: "2026-10-13T05:00:00+05:45" },
];

/** Reduced lines that are genuinely on offer, paired with their allocation. */
export const offers: Offer[] = OPEN_OFFERS.filter((offer) =>
  products.some((p) => p.id === offer.productId && discountPercent(p) !== null),
);

/** Resolve an offer's product, or undefined if the id no longer resolves. */
export function offerProduct(offer: Offer): Product | undefined {
  return products.find((product) => product.id === offer.productId);
}

/* ------------------------------------------------------------------ */
/* Site chrome                                                         */
/* ------------------------------------------------------------------ */

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Mart", href: "/mart" },
  { label: "Tasting Menus", href: "/restaurant" },
  { label: "Seasonal Batches", href: "/offers" },
  { label: "Farm Provenance", href: "/farmers" },
  { label: "Membership", href: "/membership" },
];

export interface Category {
  id: string;
  name: string;
  /** One-line terroir note shown under the tile label. */
  note: string;
  href: string;
  image: string;
}

export const categories: Category[] = [
  { id: "produce", name: "Fresh Produce", note: "Palung rayo & greens", href: "/mart/produce", image: "/img/cat-produce.jpg" },
  { id: "fruit", name: "Fruits", note: "Mustang apples & oranges", href: "/mart/fruit", image: "/img/cat-fruit.jpg" },
  { id: "dairy", name: "Dairy", note: "Chhurpi & Ilam cow ghee", href: "/mart/dairy", image: "/img/cat-dairy.jpg" },
  { id: "essentials", name: "Daily Essentials", note: "Mustard oil & sea salt", href: "/mart/essentials", image: "/img/cat-essentials.jpg" },
  { id: "pantry", name: "Pantry", note: "Jumla Marsi rice & lentils", href: "/mart/pantry", image: "/img/cat-pantry.jpg" },
  { id: "meat", name: "Meat & Eggs", note: "Himalayan pasture fowl", href: "/mart/meat", image: "/img/cat-meat.jpg" },
  { id: "herbs", name: "Herbs & Spice", note: "Wild jimbu & timur pepper", href: "/mart/herbs", image: "/img/cat-herbs.jpg" },
  { id: "local", name: "Local Products", note: "Artisanal dalle & yak butter", href: "/mart/local", image: "/img/cat-local.jpg" },
  { id: "global", name: "Global Pantry", note: "Highland honey & tea blends", href: "/mart/global", image: "/img/cat-global.jpg" },
  { id: "restaurant", name: "Restaurant", note: "Steamed momos & Newari sets", href: "/restaurant", image: "/img/cat-restaurant.jpg" },
];

export const heroImage = "/img/hero-farm.jpg";
export const restaurantBandImage = "/img/band-restaurant.jpg";
export const farmerBandImage = "/img/band-farmers.jpg";

export const paymentMethods = ["eSewa", "Khalti", "Fonepay QR", "Cash on Delivery"] as const;

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Fresh Produce", href: "/mart/produce" },
      { label: "Valley Terroirs", href: "/mart" },
      { label: "Pantry & Foraged", href: "/mart/pantry" },
      { label: "Dairy & Chhurpi", href: "/mart/dairy" },
      { label: "Meat & Range Eggs", href: "/mart/meat" },
      { label: "Restaurant Menus", href: "/restaurant" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Farm to Home", href: "/farmers" },
      { label: "Ethical Sourcing Protocol", href: "/about" },
      { label: "Baluwatar Depot", href: "/about" },
      { label: "Sanepa Kitchens", href: "/restaurant" },
      { label: "Jhamsikhel Cellars", href: "/about" },
      { label: "Guild Membership", href: "/membership" },
    ],
  },
  {
    title: "Assistance",
    links: [
      { label: "Track Valley Order", href: "/orders" },
      { label: "Delivery Zones (Ring Road)", href: "/about" },
      { label: "Refund & Freshness Guarantee", href: "/support" },
      { label: "Privacy & Provenance", href: "/support" },
    ],
  },
  {
    title: "Depots & Kitchens",
    links: [
      { label: "Baluwatar Central Depot", href: "/about" },
      { label: "Sanepa Botanical Kitchens", href: "/restaurant" },
      { label: "Jhamsikhel Ferment Cellars", href: "/about" },
      { label: "Nagarkot Forage Reserve", href: "/farmers" },
    ],
  },
];

export const contact = {
  email: "info@localorganicmart.com",
  phone: "+977 9851054917",
  address: "Lazimpat, Kathmandu 44600, Nepal",
};