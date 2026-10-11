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
  | "Meat"
  | "Spices"
  | "Fermented"
  | "Pulses"
  | "Heritage Grain";

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
  /** Listing photo, square, dark-lit. Omitted when no usable photo exists,
   *  in which case the UI renders a gradient fallback. */
  image?: string;
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
    badge: "pasture-raised, free range",
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
    badge: "aged and stone-milled",
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
    image: "/images/product-honey.jpg",
    badge: "highland cliff harvest",
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
  {
    id: "turmeric",
    name: "Turmeric",
    nepaliName: "बेसार",
    price: 120,
    unit: "100 g pouch",
    desc: "Lakpahrid hill turmeric, stone-ground low so the colour stays deep.",
    category: "Spices",
    outOfStock: false,
    image: "/images/turmeric.jpg",
    badge: "Stone Ground",
    flags: { organic: true, local: true },
    region: "Ilam",
    harvestedOn: "21 Jan",
    batch: "I-247",
    freshness: "Stone-ground, no filler",
    bulkTiers: [
      { label: "1–3 kg retail", note: "Standard" },
      { label: "4–15 kg", note: "−5% savings" },
      { label: "16+ kg", note: "−10% savings" },
    ],
  },
  {
    id: "timur-pepper",
    name: "Timur Pepper",
    nepaliName: "तिमुर",
    price: 350,
    unit: "50 g jar",
    desc: "Wild-flushed Mustang timo, whole and sun-dried for a clean citrus heat.",
    category: "Spices",
    outOfStock: false,
    image: "/images/timur-pepper.jpg",
    badge: "Wild Harvested",
    flags: { organic: true, local: true },
    region: "Mustang",
    harvestedOn: "8 Nov",
    batch: "M-082",
    freshness: "Sun-dried, whole husks",
  },
  {
    id: "cinnamon",
    name: "Cinnamon",
    nepaliName: "दालचीनी",
    price: 180,
    unit: "100 g pouch",
    desc: "Sal forest bark quills, hand-rolled and graded by length before packing.",
    category: "Spices",
    outOfStock: false,
    image: "/images/cinnamon.jpg",
    badge: "Hand Rolled",
    flags: { organic: true, local: true },
    region: "Sindhupalchok",
    harvestedOn: "3 Mar",
    batch: "S-118",
    freshness: "Whole quills, ground to order",
  },
  {
    id: "jimbu",
    name: "Wild Jimbu",
    nepaliName: "जिम्बु",
    price: 90,
    unit: "20 g jar",
    desc: "Shrouded high-altitude fruit picked after the first frost, then dried.",
    category: "Spices",
    outOfStock: false,
    image: "/images/jimbu.jpg",
    badge: "Frost Picked",
    flags: { organic: true, local: true },
    region: "Mustang",
    harvestedOn: "26 Dec",
    batch: "M-091",
    freshness: "Dried in the open air",
  },
  {
    id: "gundruk",
    name: "Gundruk",
    nepaliName: "गुन्द्रुक",
    price: 250,
    unit: "200 g bundle",
    desc: "Sunkhoto greens wilted, sun-cured and sour-sweet for a winter kitchen.",
    category: "Fermented",
    outOfStock: false,
    image: "/images/gundruk.jpg",
    badge: "Naturally Fermented",
    flags: { local: true },
    region: "Kathmandu Valley",
    harvestedOn: "12 Jan",
    batch: "K-181",
    freshness: "Fermented 6 weeks",
  },
  {
    id: "chhurpi",
    name: "Chhurpi",
    nepaliName: "छुर्पी",
    price: 450,
    unit: "100 g block",
    desc: "Hard yak cheese, smoked over juniper and cured until crumbly.",
    category: "Fermented",
    outOfStock: false,
    image: "/images/chhurpi.jpg",
    badge: "Juniper Smoked",
    flags: { organic: true, local: true },
    region: "Gorkha",
    harvestedOn: "9 Feb",
    batch: "GV-064",
    freshness: "Cured 3 months",
  },
  {
    id: "jumla-simi-beans",
    name: "Jumla Simi Beans",
    nepaliName: "जुम्ला सिमी",
    price: 380,
    unit: "500 g pouch",
    desc: "Black simi beans grown above 2,800 m and hand-sorted for colour.",
    category: "Pulses",
    outOfStock: false,
    image: "/images/simi-beans.jpg",
    badge: "Jumla Organic",
    flags: { organic: true, local: true },
    region: "Jumla",
    harvestedOn: "30 Oct",
    batch: "J-412",
    freshness: "Hand-sorted, unpolished",
    bulkTiers: [
      { label: "1–5 kg retail", note: "Standard" },
      { label: "6–25 kg", note: "−5% savings" },
      { label: "26+ kg", note: "−10% savings" },
    ],
  },
  {
    id: "marshi-rice",
    name: "Marshi Rice",
    nepaliName: "मार्सी चामल",
    price: 520,
    unit: "1 kg bag",
    desc: "Cold-terrace paddy from Jumla, milled to order so the bran stays on.",
    category: "Heritage Grain",
    outOfStock: false,
    image: "/images/marshi-rice.jpg",
    badge: "Cold Terrace",
    flags: { organic: true, local: true },
    region: "Jumla",
    harvestedOn: "17 Nov",
    batch: "J-418",
    freshness: "Milled to order",
    bulkTiers: [
      { label: "1–10 kg retail", note: "Standard" },
      { label: "11–40 kg", note: "−5% savings" },
      { label: "41+ kg", note: "−10% savings" },
    ],
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
  /** Extra gallery frames after the main photo. Must not repeat `image`. */
  gallery?: string[];
  /** Extra serving sizes beyond the base `portion`. First entry is the default. */
  portions: DishPortion[];
  /** Optional sides that can be added to the order. */
  addons: DishAddon[];
}

export interface DishPortion {
  id: string;
  label: string;
  /** Added to the base price in NPR. */
  price: number;
  /** Replaces the base `portion` string when this option is selected. */
  serves: string;
}

export interface DishAddon {
  id: string;
  label: string;
  /** Added to the line total in NPR. */
  price: number;
}

/** Spice levels offered on the detail page. Mapped onto `Dish.spice`. */
export const spiceLevels: { id: DishSpice; label: string }[] = [
  { id: "mild", label: "Mild" },
  { id: "medium", label: "Medium" },
  { id: "fiery", label: "Fiery" },
];

export type DishSpice = "mild" | "medium" | "fiery";

/** Which spice pill to preselect for a dish. */
export function spicePreset(dish: { spice: Spice }): DishSpice {
  if (dish.spice === "Spicy") return "fiery";
  if (dish.spice === "Medium") return "medium";
  return "mild";
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
    gallery: ["/images/gallery-dal-1.jpg", "/images/gallery-dal-2.jpg"],
    tags: ["popular", "organic", "nepali-traditional"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "1 Thali" },
      { id: "large", label: "Large", price: 120, serves: "2 Thali" },
    ],
    addons: [
      { id: "papad", label: "Extra papad", price: 30 },
      { id: "ghee", label: "Ghee (warm cup)", price: 40 },
      { id: "dal", label: "Extra dal", price: 60 },
    ],
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
    image: "/images/dish-chicken-momo.jpg",
    gallery: ["/images/gallery-momo-1.jpg", "/images/gallery-momo-2.jpg"],
    tags: ["popular", "snacks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "10 pcs" },
      { id: "large", label: "Large", price: 120, serves: "15 pcs" },
    ],
    addons: [
      { id: "chutney", label: "Extra chutney", price: 20 },
      { id: "soup", label: "Side soup", price: 60 },
    ],
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
    image: "/images/dish-veg-momo.jpg",
    gallery: ["/images/gallery-veg-momo-1.jpg"],
    tags: ["organic", "snacks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "10 pcs" },
      { id: "large", label: "Large", price: 120, serves: "15 pcs" },
    ],
    addons: [
      { id: "chutney", label: "Extra chutney", price: 20 },
      { id: "soup", label: "Side soup", price: 60 },
    ],
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
    gallery: ["/images/gallery-thukpa-1.jpg"],
    tags: ["popular", "organic", "nepali-traditional"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "650 ml bowl" },
      { id: "large", label: "Large", price: 120, serves: "900 ml bowl" },
    ],
    addons: [
      { id: "papad", label: "Extra papad", price: 30 },
      { id: "greens", label: "Extra greens", price: 40 },
    ],
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
    gallery: ["/images/gallery-dhido-1.jpg", "/images/gallery-dhido-2.jpg"],
    tags: ["healthy", "organic", "nepali-traditional"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "1 Thali" },
      { id: "large", label: "Large", price: 120, serves: "2 Thali" },
    ],
    addons: [
      { id: "papad", label: "Extra papad", price: 30 },
      { id: "ghee", label: "Ghee (warm cup)", price: 40 },
      { id: "dal", label: "Extra dal", price: 60 },
    ],
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
    gallery: ["/images/gallery-sel-roti-1.jpg"],
    tags: ["organic", "nepali-traditional", "snacks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "2 pcs" },
      { id: "large", label: "Large", price: 120, serves: "4 pcs" },
    ],
    addons: [
      { id: "papad", label: "Extra papad", price: 30 },
      { id: "ghee", label: "Ghee (warm cup)", price: 40 },
    ],
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
    gallery: ["/images/gallery-choila-1.jpg"],
    tags: ["popular"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "300 g" },
      { id: "large", label: "Large", price: 120, serves: "450 g" },
    ],
    addons: [
      { id: "mustard", label: "Mustard oil drizzle", price: 30 },
      { id: "greens", label: "Extra greens", price: 40 },
    ],
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
    gallery: ["/images/gallery-chiya-1.jpg"],
    tags: ["popular", "nepali-traditional", "drinks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "250 ml" },
      { id: "large", label: "Large", price: 120, serves: "350 ml" },
    ],
    addons: [
      { id: "ginger", label: "Extra ginger", price: 20 },
    ],
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
    gallery: ["/images/gallery-lassi-1.jpg"],
    tags: ["snacks", "drinks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "300 ml" },
      { id: "large", label: "Large", price: 120, serves: "450 ml" },
    ],
    addons: [
      { id: "pistachio", label: "Pistachio crumble", price: 40 },
    ],
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
    gallery: ["/images/gallery-orange-juice-1.jpg"],
    tags: ["healthy", "drinks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "400 ml" },
      { id: "large", label: "Large", price: 120, serves: "500 ml" },
    ],
    addons: [
      { id: "mint", label: "Mint", price: 15 },
    ],
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
    gallery: ["/images/gallery-salad-1.jpg"],
    tags: ["healthy", "organic"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "350 g" },
      { id: "large", label: "Large", price: 120, serves: "500 g" },
    ],
    addons: [
      { id: "dressing", label: "Dressing on the side", price: 30 },
      { id: "paneer", label: "Paneer", price: 80 },
    ],
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
    gallery: ["/images/gallery-honey-tea-1.jpg"],
    tags: ["healthy", "drinks"],
    portions: [
      { id: "regular", label: "Regular", price: 0, serves: "250 ml" },
      { id: "large", label: "Large", price: 120, serves: "350 ml" },
    ],
    addons: [
      { id: "honey", label: "Extra honey", price: 20 },
    ],
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
  /** Collective portrait, square, dark-lit. */
  photo: string;
  /** Elevation range shown beside the location pin. */
  elevation: string;
  /**
   * `Product["region"]` values this collective supplies. Every chip on the
   * page is derived from real products filed against these regions, so no
   * listing or category can be invented here.
   */
  regions: string[];
  /** Why this collective's lot is worth the premium. */
  special: string;
}

export const farmers: Farmer[] = [
  {
    id: "kavre-growers-group",
    name: "Kavre Growers Group",
    location: "Kavre Valley",
    story:
      "Fourteen families growing chemical-free greens on terrace plots watered by mountain springs, harvested strictly to order at dawn.",
    photo: "/images/farmer-kavre.jpg",
    elevation: "1,500m",
    regions: ["Kavre"],
    special:
      "Palung spinach, cauliflower and vine tomatoes off the same spring-fed terrace block, picked the morning they ship.",
  },
  {
    id: "hill-producers-network",
    name: "Hill Producers Network",
    location: "Jumla & High Hills",
    story:
      "Indigenous high-altitude agro-pastoral methods passed down through generations, with no synthetic intervention at any stage.",
    photo: "/images/farmer-highlands.jpg",
    elevation: "2,400–3,200m",
    regions: ["Jumla", "Mustang", "Nagarkot", "Ilam", "Sindhupalchok"],
    special:
      "Marshi rice and Jumla simi beans from cold terraces, plus Mustang mustard oil and Ilam turmeric that no supermarket stocks.",
  },
  {
    id: "local-dairy-poultry-partners",
    name: "Local Dairy & Poultry Partners",
    location: "Kathmandu Valley Foothills & Godavari",
    story:
      "Pasture-grazed native cows and country hens fed organic fodder, milked and collected the same day under cold-chain handling.",
    photo: "/images/farmer-valley.jpg",
    elevation: "900–1,300m",
    regions: ["Kathmandu Valley", "Godavari", "Gorkha"],
    special:
      "Raw A2 milk and country eggs moved on a same-day cold chain, alongside gundruk cured in the valley winter air.",
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

/** Farm to Home hero copy. Lives here so the page inlines no strings. */
export const farmToHome = {
  heroImage: "/images/farm-hero.jpg",
  heroAlt:
    "Terraced highland fields and farmhouses above a Nepali valley at first light",
  kicker: "Local → Trusted → Organic → Healthy",
  headline: "From our farmers to your home",
  subline:
    "Three collectives, one cold chain. Every lot below names the household that grew it, the elevation it was grown at, and the batch it shipped under.",
};

/** The six custody steps shown in the traceability bar. */
export const traceabilitySteps: { label: string; note: string }[] = [
  { label: "Farm", note: "Terrace plot named on the lot" },
  { label: "Farmer", note: "Collective steward verified" },
  { label: "Production", note: "No synthetic intervention" },
  { label: "Processing", note: "Stone ground or sun dried" },
  { label: "Packing", note: "Sealed at the valley depot" },
  { label: "Delivery", note: "Same-day cold-chain drop" },
];

export const paymentMethods = ["eSewa", "Khalti", "Fonepay QR", "Cash on Delivery"] as const;

/** Four link columns; the brand column is rendered separately. */
/** Shop links are derived from `categories` so the two can never drift. */
export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: categories.map((category) => ({
      label: category.name,
      href: category.href,
    })),
  },
  {
    title: "Company",
    links: [
      { label: "Farm to Home", href: "/farmers" },
      { label: "Our Story", href: "/about" },
      { label: "Membership", href: "/membership" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "Delivery Zones", href: "/support" },
      { label: "Refund Policy", href: "/support" },
      { label: "Privacy Policy", href: "/support" },
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
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
] as const;

/** Ceiling of the Mart price slider, in NPR. */
export const priceCeiling = 3000;

/** When the weekly deals allocation closes. Drives the live countdown chip. */
export const dealsCloseAt = "2026-10-13T05:00:00+05:45";

// TODO: delivery zones — one flat fee for now, not zone-dependent.
export const DELIVERY_FEE_FLAT = 120;

/* ------------------------------------------------------------------ */
/* Checkout demo content                                              */
/*                                                                     */
/* These are demo user records, not brand copy. They stand in for the  */
/* data a real account and dispatch API would return.                  */
/* ------------------------------------------------------------------ */

export interface SavedAddress {
  id: string;
  label: string;
  detail: string;
}

export const ADDRESSES: SavedAddress[] = [
  { id: "home", label: "Home", detail: "Baluwatar, Kathmandu" },
  { id: "office", label: "Office", detail: "Durbar Marg, Kathmandu" },
];

export interface DeliverySlot {
  id: string;
  label: string;
}

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: "asap", label: "ASAP" },
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

export interface Rider {
  name: string;
  role: string;
}

export const RIDER: Rider = {
  name: "Suman",
  role: "Delivery partner",
};
/** URL segment for a product, e.g. "/product/wild-honey". */
export function productSlug(product: Product): string {
  return product.id;
}

/** Resolve a slug back to its product. */
export function productBySlug(slug: string): Product | undefined {
  return products.find((product) => product.id === slug);
}

/** Nav categories that own a `/mart/[category]` route. Restaurant is not one. */
export const martCategories = categories.filter(
  (category) => category.href.startsWith("/mart/"),
);

/**
 * Which `Product.category` values belong under each nav category.
 *
 * The two vocabularies are deliberately different: `Product.category` is a
 * merchandising label ("Dairy & Eggs"), while the nav slug is a department
 * ("dairy"). Nothing derives one from the other, so the membership is stated
 * here rather than inferred. Each department owns its own label so the sets
 * stay disjoint — "Pulses" and "Heritage Grain" are separate from "Grains &
 * Pulses" purely so the two Jumla lots can sit under `local` without dragging
 * the pantry's rice and lentils across with them.
 */
const categoryMembership: Record<string, ProductCategory[]> = {
  produce: ["Leafy Greens", "Vegetables"],
  fruit: ["Fruit"],
  dairy: ["Dairy & Eggs"],
  essentials: ["Oils & Ghee"],
  pantry: ["Grains & Pulses", "Heritage Grain"],
  meat: ["Meat"],
  herbs: ["Spices"],
  local: ["Fermented", "Pulses", "Heritage Grain"],
  global: ["Foraged"],
};

/** Resolve a `/mart/[category]` slug. */
export function categoryBySlug(
  slug: string,
): (typeof martCategories)[number] | undefined {
  return martCategories.find((category) => category.id === slug);
}

/** Products filed under a nav category. Empty for an unknown slug. */
export function productsInCategory(slug: string): Product[] {
  const groups = categoryMembership[slug];
  if (!groups) return [];
  return products.filter((product) => groups.includes(product.category));
}

/** Products a collective supplies, matched on `Product.region`. */
export function productsFromFarmer(farmer: Farmer): Product[] {
  return products.filter((product) => farmer.regions.includes(product.region));
}

/**
 * Nav categories a collective's lots appear under, as live `/mart/[category]`
 * targets. Derived from the same membership map the Mart pages use, so a chip
 * can never point at a department with nothing in it.
 */
export function categoriesFromFarmer(
  farmer: Farmer,
): { id: string; name: string; href: string }[] {
  const supplied = new Set(
    productsFromFarmer(farmer).map((product) => product.category),
  );
  return martCategories
    .filter((category) =>
      (categoryMembership[category.id] ?? []).some((group) =>
        supplied.has(group),
      ),
    )
    .map((category) => ({
      id: category.id,
      name: category.name,
      href: category.href,
    }));
}

/** Resolve a slug back to its dish. */
export function dishBySlug(slug: string): Dish | undefined {
  return dishes.find((dish) => dish.id === slug);
}
