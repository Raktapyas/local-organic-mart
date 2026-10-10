/**
 * Single source of truth for all site content.
 *
 * Pages and components must import from here; never inline product copy,
 * prices, or farmer detail in JSX. Adding a listing means editing this file
 * only.
 */

export type Diet = "Vegan" | "Vegetarian" | "Non-Veg" | "Contains dairy";
export type Spice = "Non-spicy" | "Mild" | "Medium" | "Spicy" | "Aromatic";

/** Filter buckets for the restaurant menu. */
export type DishTag =
  | "popular"
  | "healthy"
  | "organic"
  | "nepali-traditional"
  | "snacks"
  | "drinks";

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
  /** Listing photo, square, dark-lit. */
  image: string;
  /**
   * Extra gallery frames after the main photo. Entries must not repeat
   * `image` or each other. Most products ship with a single frame today —
   * see NOTES.md for the photo top-up task.
   */
  gallery?: string[];
  /** Short provenance label above the name, e.g. "Jumla Bio". */
  badge: string;
  /** Replaces the Add button when out of stock. */
  soldOutNote?: string;
  /** Provenance chips. Gold in the product header, so premium signals only. */
  flags: { organic?: boolean; local?: boolean };
  /** Region the lot was grown or gathered in. */
  region: string;
  /** Human-readable harvest date, e.g. "6 Feb". */
  harvestedOn: string;
  /** Traceability lot code, e.g. "K-118". */
  batch: string;
  /** Freshness promise shown in the traceability strip. */
  freshness: string;
  /** Volume tiers. Omitted for items sold only in single units. */
  bulkTiers?: { label: string; note: string }[];
  /** Patron reviews. Absent means the Reviews tab shows an empty state. */
  reviews?: Review[];
}

export interface Review {
  id: string;
  author: string;
  locality: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  verified: boolean;
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
    image: "/images/spinach.jpg",
    badge: "In season: Oct–Mar",
    flags: { organic: true, local: true },
    region: "Kavre",
    harvestedOn: "6 Feb",
    batch: "K-163",
    freshness: "Picked within a day of delivery",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/cauliflower.jpg",
    badge: "Kavre Morning Harvest",
    flags: { organic: true, local: true },
    region: "Kavre",
    harvestedOn: "9 Feb",
    batch: "K-124",
    freshness: "Delivered within 24 hours of harvest",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/tomatoes.jpg",
    badge: "Harvested yesterday",
    flags: { local: true },
    region: "Kavre",
    harvestedOn: "10 Feb",
    batch: "K-131",
    freshness: "Vine-ripened, never force-ripened",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/oranges.jpg",
    badge: "In season: Oct–Dec",
    flags: { organic: true },
    region: "Gorkha",
    harvestedOn: "4 Jan",
    batch: "G-207",
    freshness: "Hand-sorted, unbruised",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/eggs.jpg",
    badge: "Kavre Valley Pasture",
    flags: { local: true },
    region: "Kathmandu Valley",
    harvestedOn: "11 Feb",
    batch: "K-142",
    freshness: "Collected daily under cold chain",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
    reviews: [
      {
        id: "r-eggs-1",
        author: "Sabina T.",
        locality: "Lalitpur",
        rating: 5,
        body: "Yolks were orange when they cracked. You can taste the difference in a fried egg.",
        verified: true,
      },
      {
        id: "r-eggs-2",
        author: "Rajan K.",
        locality: "Boudha",
        rating: 4,
        body: "Consistent every crate so far. Delivery runs a little early in the rain.",
        verified: true,
      },
    ],
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
    image: "/images/milk.jpg",
    badge: "A2 Chilled",
    flags: { organic: true, local: true },
    region: "Godavari",
    harvestedOn: "11 Feb",
    batch: "GV-058",
    freshness: "Raw, unhomogenised A2",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/rice.jpg",
    badge: "Aged 2 Years",
    flags: { organic: true, local: true },
    region: "Jumla",
    harvestedOn: "2 Nov",
    batch: "J-401",
    freshness: "Stone-milled to order",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/lentils.jpg",
    badge: "Jumla Bio",
    flags: { organic: true },
    region: "Jumla",
    harvestedOn: "28 Sep",
    batch: "J-388",
    freshness: "Hand-sorted, sun-dried on stone",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/mustard-oil.jpg",
    badge: "Stone Milled",
    flags: { organic: true, local: true },
    region: "Mustang",
    harvestedOn: "19 Dec",
    batch: "M-076",
    freshness: "Cold-pressed, low heat",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
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
    image: "/images/honey.jpg",
    badge: "Lamjung Cliff Harvest",
    flags: { organic: true, local: true },
    region: "Jumla",
    harvestedOn: "6 Feb",
    batch: "K-118",
    freshness: "Picked within a day of delivery",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
    reviews: [
      {
        id: "r-honey-1",
        author: "Aarav S.",
        locality: "Jhamsikhel",
        rating: 5,
        body: "Tastes of the cliff, not the supermarket shelf. The jar arrived still cold.",
        verified: true,
      },
      {
        id: "r-honey-2",
        author: "Pooja M.",
        locality: "Baluwatar",
        rating: 5,
        body: "I have stopped buying honey anywhere else. Worth the price for the traceability.",
        verified: true,
      },
    ],
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
    image: "/images/ghee.jpg",
    badge: "Bilona Churned",
    flags: { organic: true, local: true },
    region: "Ilam",
    harvestedOn: "22 Jan",
    batch: "I-233",
    freshness: "Bilona churned, slow-cooked",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–20 kg", note: "−5% savings" },
      { label: "21+ kg", note: "−10% savings" },
    ],
    reviews: [
      {
        id: "r-ghee-1",
        author: "Nisha R.",
        locality: "Sanepa",
        rating: 5,
        body: "Proper bilona, with the grain and nutty smell that ghee should have.",
        verified: true,
      },
      {
        id: "r-ghee-2",
        author: "Deepak G.",
        locality: "Balkhu",
        rating: 4,
        body: "Rich colour and clean taste. The jar is smaller than I expected at this price.",
        verified: false,
      },
    ],
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
    image: "/images/goat-meat.jpg",
    badge: "Ethically Raised",
    flags: { local: true },
    region: "Sindhupalchok",
    harvestedOn: "11 Feb",
    batch: "K-149",
    freshness: "Butchered on the morning of dispatch",
  },
  {
    id: "morel-mushroom",
    name: "Morel Mushroom",
    nepaliName: "सिनार",
    price: 2800,
    unit: "100 g glass jar",
    desc: "Forest-gathered after the first monsoon rains. Season closed until next year.",
    category: "Foraged",
    outOfStock: true,
    soldOutNote: "Sold out — next harvest April",
    image: "/images/morel.jpg",
    badge: "Foraged High Altitude",
    flags: { organic: true },
    region: "Nagarkot",
    harvestedOn: "14 Aug",
    batch: "N-061",
    freshness: "Next harvest opens April",
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
  /** Menu photo, 4:3, dark-lit. */
  image: string;
  /** Filter buckets. */
  tags: DishTag[];
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
    image: "/images/dal-bhat.jpg",
    tags: ["popular", "organic", "nepali-traditional"],
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
    image: "/images/momo.jpg",
    tags: ["popular", "snacks"],
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
    image: "/images/momo.jpg",
    tags: ["organic", "snacks"],
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
    image: "/images/thukpa.jpg",
    tags: ["popular", "organic", "nepali-traditional"],
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
    image: "/images/dish-dhido.jpg",
    tags: ["healthy", "organic", "nepali-traditional"],
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
    image: "/images/dish-sel-roti.jpg",
    tags: ["organic", "nepali-traditional", "snacks"],
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
    image: "/images/dish-choila.jpg",
    tags: ["popular"],
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
    image: "/images/chiya.jpg",
    tags: ["popular", "nepali-traditional", "drinks"],
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
    image: "/images/lassi.jpg",
    tags: ["snacks", "drinks"],
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
    image: "/images/dish-orange-juice.jpg",
    tags: ["healthy", "drinks"],
  },
  {
    id: "fresh-green-salad",
    name: "Fresh Green Salad",
    nepaliName: "ताजा हरियो सलाद",
    price: 240,
    portion: "350 g",
    desc: "Kavre greens, cucumber, and lemon dressed to order.",
    prepTime: "15–20 min",
    spice: "Non-spicy",
    diet: "Vegan",
    image: "/images/dish-salad.jpg",
    tags: ["healthy", "organic"],
  },
  {
    id: "honey-lemon-tea",
    name: "Honey Lemon Tea",
    nepaliName: "मह निम्बा चिया",
    price: 120,
    portion: "250 ml",
    desc: "Leaf tea steeped with wild honey, ginger, and lemon.",
    prepTime: "8–12 min",
    spice: "Aromatic",
    diet: "Vegetarian",
    image: "/images/dish-honey-tea.jpg",
    tags: ["healthy", "drinks"],
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
  { label: "Restaurant", href: "/restaurant" },
  { label: "Offers", href: "/offers" },
  { label: "Farm to Home", href: "/farmers" },
  { label: "Membership", href: "/membership" },
];

export const siteName = "Local Organic Mart";

export interface Category {
  id: string;
  name: string;
  /** One-line terroir note shown under the tile label. */
  note: string;
  href: string;
  image: string;
  /** Key into `categoryIcons`; resolved by the home screen. */
  icon: CategoryIconName;
}

export const categories: Category[] = [
  { id: "produce", name: "Fresh Produce", note: "Palung rayo & greens", href: "/mart/produce", image: "/images/category-produce.jpg", icon: "sprout" },
  { id: "fruit", name: "Fruits", note: "Mustang apples & oranges", href: "/mart/fruit", image: "/images/category-fruit.jpg", icon: "apple" },
  { id: "dairy", name: "Dairy", note: "Chhurpi & Ilam cow ghee", href: "/mart/dairy", image: "/images/category-dairy.jpg", icon: "milk" },
  { id: "essentials", name: "Daily Essentials", note: "Mustard oil & sea salt", href: "/mart/essentials", image: "/images/category-essentials.jpg", icon: "flask" },
  { id: "pantry", name: "Pantry", note: "Jumla Marsi rice & lentils", href: "/mart/pantry", image: "/images/category-pantry.jpg", icon: "wheat" },
  { id: "meat", name: "Meat & Eggs", note: "Himalayan pasture fowl", href: "/mart/meat", image: "/images/category-meat.jpg", icon: "beef" },
  { id: "herbs", name: "Herbs & Spice", note: "Wild jimbu & timur pepper", href: "/mart/herbs", image: "/images/category-herbs.jpg", icon: "candlestick" },
  { id: "local", name: "Local Products", note: "Artisanal dalle & yak butter", href: "/mart/local", image: "/images/category-local.jpg", icon: "package" },
  { id: "global", name: "Global Pantry", note: "Highland honey & tea blends", href: "/mart/global", image: "/images/category-global.jpg", icon: "globe" },
  { id: "restaurant", name: "Restaurant", note: "Steamed momos & Newari sets", href: "/restaurant", image: "/images/category-restaurant.jpg", icon: "utensils" },
];

export type CategoryIconName =
  | "sprout"
  | "apple"
  | "milk"
  | "flask"
  | "wheat"
  | "beef"
  | "candlestick"
  | "package"
  | "globe"
  | "utensils";

export const heroImage = "/images/hero-farm.jpg";
export const restaurantBandImage = "/images/restaurant-band.jpg";
export const farmerBandImage = "/images/farmers-band.jpg";

export const paymentMethods = ["eSewa", "Khalti", "Fonepay QR", "Cash on Delivery"] as const;

/** Four link columns; the brand column is rendered separately. */
export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Fresh Produce", href: "/mart/produce" },
      { label: "Fruits", href: "/mart/fruit" },
      { label: "Dairy & Chhurpi", href: "/mart/dairy" },
      { label: "Pantry & Foraged", href: "/mart/pantry" },
      { label: "Meat & Range Eggs", href: "/mart/meat" },
      { label: "Restaurant Menus", href: "/restaurant" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Farm to Home", href: "/farmers" },
      { label: "Ethical Sourcing Protocol", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Our Kitchens", href: "/restaurant" },
      { label: "Sourcing Protocol", href: "/about" },
      { label: "Membership", href: "/membership" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track Valley Order", href: "/orders" },
      { label: "Delivery Zones (Ring Road)", href: "/support" },
      { label: "Refund & Freshness Guarantee", href: "/support" },
      { label: "Privacy & Provenance", href: "/support" },
    ],
  },
];

export const contact = {
  email: "info@localorganicmart.com",
  phone: "+977 9851054917",
  address: "Kathmandu, Nepal",
};

/* ------------------------------------------------------------------ */
/* Mart listing                                                        */
/* ------------------------------------------------------------------ */

export interface MartFilterOption {
  id: string;
  label: string;
}

/** Quick attribute toggles shown above the category list. */
export const filterAttributes: MartFilterOption[] = [
  { id: "organic", label: "Organic" },
  { id: "local", label: "Local" },
  { id: "in-season", label: "In season" },
  { id: "in-stock", label: "In stock" },
];

/** Verification marks shown at the foot of the Mart sidebar. */
export const provenanceMarks: MartFilterOption[] = [
  { id: "jumla-bio", label: "Jumla Bio Protocol" },
  { id: "kavre-organic", label: "Kavre Certified Organic" },
  { id: "mustang-wild", label: "Mustang Highland Wild" },
];

export const sortOptions = [
  "Terroir & Harvest Date",
  "Price: Low to High",
  "Price: High to Low",
  "Elevation & Rarity",
] as const;

/** Ceiling of the Mart price slider, in NPR. */
export const priceCeiling = 3000;

/** When the weekly deals allocation closes. Drives the live countdown chip. */
export const dealsCloseAt = "2026-10-13T05:00:00+05:45";

/** Catalogue size shown alongside the filtered result count. */
export const catalogueTotal = 148;
/** URL segment for a product, e.g. "/product/wild-honey". */
export function productSlug(product: Product): string {
  return product.id;
}

/** Resolve a slug back to its product. */
export function productBySlug(slug: string): Product | undefined {
  return products.find((product) => product.id === slug);
}
