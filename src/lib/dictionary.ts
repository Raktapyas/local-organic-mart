import type { Lang } from "@/lib/lang-store";

/**
 * UI strings, EN + नेपाली.
 *
 * Deliberately narrow: navigation, headings, buttons, badges and cart chrome.
 *
 * TODO: full i18n — product and dish copy (names, descriptions, ingredients)
 * still comes from `data.ts` in English with a Nepali name alongside. Content
 * translation belongs with the backend, where it can be edited without a
 * deploy. Nepali names in data.ts stay as they are: they are already correct
 * Nepali and are shown next to the English name.
 */
const en = {
    nav: {
      home: "Home",
      mart: "Mart",
      restaurant: "Restaurant",
      baskets: "Baskets",
      offers: "Offers",
      farmers: "Farm to Home",
      membership: "Membership",
      myHome: "My Home",
      trackOrder: "Track Order",
      help: "Help & support",
      shop: "Shop",
      explore: "Explore",
      contact: "Contact",
    },
    hero: {
      kicker: "Harvested in the valley",
      headline: "Buy local farm products online in Nepal.",
      subline: "Delivered within hours, still muddy.",
      ctaPrimary: "Shop the mart",
      ctaSecondary: "See our farmers",
    },
    sections: {
      shopByCategory: "Shop by category",
      shopByCategorySub: "Ten departments, filled from the morning harvest.",
      bigDeals: "This week's big deals",
      bigDealsSub: "Small allocations from this week's harvest.",
      baskets: "Baskets & bundles",
      basketsSub: "Curated weekly farm boxes, calibrated for Kathmandu households.",
      farmers: "From our farmers to your home",
      restaurant: "Local Organic Restaurant",
      smartBundles: "Smart bundles",
      festivalBaskets: "Festival baskets",
      recurringPlans: "Recurring plans",
    },
    buttons: {
      add: "Add",
      addBasket: "Add entire basket",
      checkout: "Checkout",
      placeOrder: "Place order",
      search: "Search",
      seeAll: "See all",
      loadMore: "Load more",
      subscribe: "Subscribe",
      remove: "Remove",
    },
    badges: {
      organic: "Organic",
      local: "Local",
      inSeason: "In season",
      soldOut: "Sold out",
    },
    cart: {
      empty: "Your bag is empty.",
      subtotal: "Subtotal",
      delivery: "Delivery",
      total: "Total",
      grocery: "Grocery",
      restaurantGroup: "Restaurant",
      basketsGroup: "Baskets & gifts",
      basket: "Bag",
    },
    trackOrder: {
      title: "Track order",
      inputLabel: "Order number",
      placeholder: "e.g. LOM-4712",
      submit: "Track",
      notFound: "We couldn't find that order.",
    },
};

const ne: typeof en = {
    nav: {
      home: "गृहपृष्ठ",
      mart: "मार्ट",
      restaurant: "रेस्टुरेन्ट",
      baskets: "टोकरीहरू",
      offers: "अफर",
      farmers: "खेतबाट घर",
      membership: "सदस्यता",
      myHome: "मेरो होम",
      trackOrder: "अर्डर ट्र्याक",
      help: "सहयोग",
      shop: "किन्नुहोस्",
      explore: "हेर्नुहोस्",
      contact: "सम्पर्क",
    },
    hero: {
      kicker: "उपत्यकामै उपलब्ध",
      headline: "नेपालमै स्थानीय कृषि उत्पादन अनलाइन किन्नुहोस्।",
      subline: "केही घण्टामै, माटोले नभिजिएको अवस्थामै।",
      ctaPrimary: "मार्ट हेर्नुहोस्",
      ctaSecondary: "हाम्रा किसान",
    },
    sections: {
      shopByCategory: "श्रेणी अनुसार किन्नुहोस्",
      shopByCategorySub: "दश वटा विभाग, बिहानको बालीबाट भरिएका।",
      bigDeals: "यो हप्ताका ठूला सौदा",
      bigDealsSub: "यो हप्ताको बालीको सानो परिमाण।",
      baskets: "टोकरी र बन्डल",
      basketsSub: "काठमाडौँका परिवारका लागि स-weekly कृषि बक्स।",
      farmers: "हाम्रा किसानदेखि तपाईंको घरसम्म",
      restaurant: "लोकल अर्गानिक रेस्टुरेन्ट",
      smartBundles: "स्मार्ट बन्डल",
      festivalBaskets: "त्योहारका टोकरी",
      recurringPlans: "नियमित योजना",
    },
    buttons: {
      add: "थप्नुहोस्",
      addBasket: "टोकरी थप्नुहोस्",
      checkout: "चेकआउट",
      placeOrder: "अर्डर दिनुहोस्",
      search: "खोज्नुहोस्",
      seeAll: "सबै हेर्नुहोस्",
      loadMore: "थप हेर्नुहोस्",
      subscribe: "सदस्यता लिनुहोस्",
      remove: "हटाउनुहोस्",
    },
    badges: {
      organic: "जैविक",
      local: "स्थानीय",
      inSeason: "मौसममा",
      soldOut: "सकियो",
    },
    cart: {
      empty: "तपाईंको टोकरी खाली छ।",
      subtotal: "जम्मा",
      delivery: "डेलिभरी",
      total: "कुल",
      grocery: "किराना",
      restaurantGroup: "रेस्टुरेन्ट",
      basketsGroup: "टोकरी र उपहार",
      basket: "टोकरी",
    },
    trackOrder: {
      title: "अर्डर ट्र्याक गर्नुहोस्",
      inputLabel: "अर्डर नम्बर",
      placeholder: "जस्तै LOM-4712",
      submit: "ट्र्याक",
      notFound: "त्यो अर्डर भेटिएन।",
    },
};

export const dictionary: Record<Lang, typeof en> = { en, ne };

export type Dictionary = typeof en;
