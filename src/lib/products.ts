export type Product = {
  id: string;
  name: string;
  description?: string;
  fabric: "Tussar" | "Ghicha" | "Mulberry";
  weight: "Light" | "Medium" | "Heavy";
  style: "Traditional" | "Contemporary" | "Elegant";
  tier: "Everyday" | "Occasion" | "Heirloom";
  tones: string[];
  occasions: string[];
  price?: number;
  isNew?: boolean;
  images?: string[];
  // Live inventory count from the database. Optional because this same
  // Product type is also used for the static seed catalog below, which
  // has no stock concept of its own.
  stock?: number;
};

export const PRODUCTS: Product[] = [
  /* =========================
     WEDDING / FESTIVAL
  ========================== */
  {
    id: "tussar-wedding-gold",
    name: "Handwoven Tussar Silk – Warm Gold",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Warm", "Gold"],
    occasions: ["Wedding", "Festival"],
    images: ["/seed-images/tussar-wedding-gold-01.jpg", "/seed-images/tussar-wedding-gold-02.jpg", "/seed-images/tussar-wedding-gold-03.jpg"],
    isNew: true,
    price:30000,
  },
  {
    id: "tussar-maroon-bridal",
    name: "Tussar Silk – Deep Maroon Bridal",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Warm", "Deep"],
    occasions: ["Wedding"],
    images: ["/seed-images/tussar-maroon-bridal-01.jpg", "/seed-images/tussar-maroon-bridal-02.jpg", "/seed-images/tussar-maroon-bridal-03.jpg"],
    price:40000,
  },

  /* =========================
     FESTIVE / EVERYDAY
  ========================== */
  {
    id: "ghicha-festive-natural",
    name: "Bhagalpuri Ghicha Silk – Natural Texture",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Neutral"],
    occasions: ["Festival", "Everyday"],
    images: ["/seed-images/ghicha-festive-natural-01.jpg", "/seed-images/ghicha-festive-natural-02.jpg", "/seed-images/ghicha-festive-natural-03.jpg"],
    isNew: true,
    price:50000,
  },
  {
    id: "ghicha-olive-festive",
    name: "Ghicha Silk – Olive Festive Drape",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Earthy"],
    occasions: ["Festival"],
    images: ["/seed-images/ghicha-olive-festive-01.jpg", "/seed-images/ghicha-olive-festive-02.jpg", "/seed-images/ghicha-olive-festive-03.jpg"],
    price:30600,
  },

  /* =========================
     MODERN / CONTEMPORARY
  ========================== */
  {
    id: "mulberry-modern-light",
    name: "Mulberry Silk – Contemporary Drape",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Neutral", "Cool"],
    occasions: ["Everyday", "Gift"],
    images: ["/seed-images/mulberry-modern-light-01.jpg", "/seed-images/mulberry-modern-light-02.jpg", "/seed-images/mulberry-modern-light-03.jpg"],
    isNew: true,
    price:30450,
  },
  {
    id: "mulberry-pastel-office",
    name: "Mulberry Silk – Pastel Office Wear",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Soft", "Cool"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-pastel-office-01.jpg", "/seed-images/mulberry-pastel-office-02.jpg", "/seed-images/mulberry-pastel-office-03.jpg"],
    price:28900,
  },

  /* =========================
     GEN Z / LIGHTWEIGHT
  ========================== */
  {
    id: "mulberry-genz-blush",
    name: "Mulberry Silk – Blush Pink",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Warm"],
    occasions: ["Gift", "Everyday"],
    images: ["/seed-images/mulberry-genz-blush-01.jpg", "/seed-images/mulberry-genz-blush-02.jpg", "/seed-images/mulberry-genz-blush-03.jpg"],
    isNew: true,
    price:27500,
  },

  /* =========================
     GIFTS / SPECIAL
  ========================== */
  {
    id: "ghicha-gift-sand",
    name: "Ghicha Silk – Sand Beige Gift Edition",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Neutral"],
    occasions: ["Gift"],
    images: ["/seed-images/ghicha-gift-sand-01.jpg", "/seed-images/ghicha-gift-sand-02.jpg", "/seed-images/ghicha-gift-sand-03.jpg"],
    price:32000,
  },

    /* =========================
     WEDDING / HEIRLOOM
  ========================== */
  {
    id: "tussar-royal-red-wedding",
    name: "Tussar Silk – Royal Red Wedding Edit",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Warm", "Red"],
    occasions: ["Wedding"],
    images: ["/seed-images/tussar-royal-red-wedding-01.jpg", "/seed-images/tussar-royal-red-wedding-02.jpg", "/seed-images/tussar-royal-red-wedding-03.jpg"],
    price: 52000,
  },
  {
    id: "tussar-temple-border-gold",
    name: "Tussar Silk – Temple Border Gold",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Gold"],
    occasions: ["Wedding", "Festival"],
    images: ["/seed-images/tussar-temple-border-gold-01.jpg", "/seed-images/tussar-temple-border-gold-02.jpg", "/seed-images/tussar-temple-border-gold-03.jpg"],
    price: 48000,
  },
  {
    id: "tussar-bronze-heritage",
    name: "Tussar Silk – Bronze Heritage Weave",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Bronze", "Warm"],
    occasions: ["Wedding"],
    images: ["/seed-images/tussar-bronze-heritage-01.jpg", "/seed-images/tussar-bronze-heritage-02.jpg", "/seed-images/tussar-bronze-heritage-03.jpg"],
    price: 56000,
  },

  /* =========================
     FESTIVE / TRADITIONAL
  ========================== */
  {
    id: "ghicha-deep-indigo-festive",
    name: "Ghicha Silk – Deep Indigo Festive",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Cool", "Indigo"],
    occasions: ["Festival"],
    images: ["/seed-images/ghicha-deep-indigo-festive-01.jpg", "/seed-images/ghicha-deep-indigo-festive-02.jpg", "/seed-images/ghicha-deep-indigo-festive-03.jpg"],
    price: 34500,
  },
  {
    id: "ghicha-rust-orange-festive",
    name: "Ghicha Silk – Rust Orange Festive",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Warm", "Earthy"],
    occasions: ["Festival"],
    images: ["/seed-images/ghicha-rust-orange-festive-01.jpg", "/seed-images/ghicha-rust-orange-festive-02.jpg", "/seed-images/ghicha-rust-orange-festive-03.jpg"],
    price: 33000,
  },
  {
    id: "ghicha-charcoal-grey-festive",
    name: "Ghicha Silk – Charcoal Grey Festive",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Neutral"],
    occasions: ["Festival", "Evening"],
    images: ["/seed-images/ghicha-charcoal-grey-festive-01.jpg", "/seed-images/ghicha-charcoal-grey-festive-02.jpg", "/seed-images/ghicha-charcoal-grey-festive-03.jpg"],
    price: 36000,
  },

  /* =========================
     CONTEMPORARY / OFFICE
  ========================== */
  {
    id: "mulberry-slate-office",
    name: "Mulberry Silk – Slate Grey Office Wear",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Cool", "Neutral"],
    occasions: ["Everyday", "Office"],
    images: ["/seed-images/mulberry-slate-office-01.jpg", "/seed-images/mulberry-slate-office-02.jpg", "/seed-images/mulberry-slate-office-03.jpg"],
    price: 26000,
  },
  {
    id: "mulberry-ivory-minimal",
    name: "Mulberry Silk – Ivory Minimal Edit",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Neutral"],
    occasions: ["Office", "Everyday"],
    images: ["/seed-images/mulberry-ivory-minimal-01.jpg", "/seed-images/mulberry-ivory-minimal-02.jpg", "/seed-images/mulberry-ivory-minimal-03.jpg"],
    price: 24500,
  },
  {
    id: "mulberry-steel-blue-office",
    name: "Mulberry Silk – Steel Blue Office",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Cool"],
    occasions: ["Office"],
    images: ["/seed-images/mulberry-steel-blue-office-01.jpg", "/seed-images/mulberry-steel-blue-office-02.jpg", "/seed-images/mulberry-steel-blue-office-03.jpg"],
    price: 25500,
  },

  /* =========================
     GEN Z / MODERN
  ========================== */
  {
    id: "mulberry-lilac-genz",
    name: "Mulberry Silk – Lilac Gen-Z Edit",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Cool", "Soft"],
    occasions: ["Everyday", "Gift"],
    images: ["/seed-images/mulberry-lilac-genz-01.jpg", "/seed-images/mulberry-lilac-genz-02.jpg", "/seed-images/mulberry-lilac-genz-03.jpg"],
    price: 24000,
  },
  {
    id: "mulberry-mint-green",
    name: "Mulberry Silk – Mint Green Modern",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Cool"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-mint-green-01.jpg", "/seed-images/mulberry-mint-green-02.jpg", "/seed-images/mulberry-mint-green-03.jpg"],
    price: 23500,
  },
  {
    id: "mulberry-coral-soft",
    name: "Mulberry Silk – Coral Soft Drapes",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Warm"],
    occasions: ["Gift", "Everyday"],
    images: ["/seed-images/mulberry-coral-soft-01.jpg", "/seed-images/mulberry-coral-soft-02.jpg", "/seed-images/mulberry-coral-soft-03.jpg"],
    price: 25000,
  },

  /* =========================
     LUXURY / LIMITED
  ========================== */
  {
    id: "tussar-midnight-black-luxe",
    name: "Tussar Silk – Midnight Black Luxe",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Elegant",
    tier: "Heirloom",
    tones: ["Black"],
    occasions: ["Evening", "Wedding"],
    images: ["/seed-images/tussar-midnight-black-luxe-01.jpg", "/seed-images/tussar-midnight-black-luxe-02.jpg", "/seed-images/tussar-midnight-black-luxe-03.jpg"],
    price: 65000,
  },
  {
    id: "tussar-emerald-royal",
    name: "Tussar Silk – Emerald Royal Edition",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Elegant",
    tier: "Heirloom",
    tones: ["Green"],
    occasions: ["Wedding", "Reception"],
    images: ["/seed-images/tussar-emerald-royal-01.jpg", "/seed-images/tussar-emerald-royal-02.jpg", "/seed-images/tussar-emerald-royal-03.jpg"],
    price: 62000,
  },

  /* =========================
     GIFT / SPECIAL
  ========================== */
  {
    id: "ghicha-pearl-white-gift",
    name: "Ghicha Silk – Pearl White Gift",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Neutral"],
    occasions: ["Gift"],
    images: ["/seed-images/ghicha-pearl-white-gift-01.jpg", "/seed-images/ghicha-pearl-white-gift-02.jpg", "/seed-images/ghicha-pearl-white-gift-03.jpg"],
    price: 31000,
  },
  {
    id: "ghicha-rosewood-gift",
    name: "Ghicha Silk – Rosewood Gift Edition",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Warm"],
    occasions: ["Gift"],
    images: ["/seed-images/ghicha-rosewood-gift-01.jpg", "/seed-images/ghicha-rosewood-gift-02.jpg", "/seed-images/ghicha-rosewood-gift-03.jpg"],
    price: 32500,
  },

  /* =========================
     DAILY / COMFORT
  ========================== */
  {
    id: "mulberry-soft-beige-daily",
    name: "Mulberry Silk – Soft Beige Daily",
    fabric: "Mulberry",
    weight: "Light",
    style: "Elegant",
    tier: "Everyday",
    tones: ["Neutral"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-soft-beige-daily-01.jpg", "/seed-images/mulberry-soft-beige-daily-02.jpg", "/seed-images/mulberry-soft-beige-daily-03.jpg"],
    price: 22500,
  },
  {
    id: "mulberry-warm-taupe",
    name: "Mulberry Silk – Warm Taupe",
    fabric: "Mulberry",
    weight: "Light",
    style: "Elegant",
    tier: "Everyday",
    tones: ["Warm"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-warm-taupe-01.jpg", "/seed-images/mulberry-warm-taupe-02.jpg", "/seed-images/mulberry-warm-taupe-03.jpg"],
    price: 23000,
  },
  {
    id: "mulberry-soft-grey-daily",
    name: "Mulberry Silk – Soft Grey Daily",
    fabric: "Mulberry",
    weight: "Light",
    style: "Elegant",
    tier: "Everyday",
    tones: ["Cool"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-soft-grey-daily-01.jpg", "/seed-images/mulberry-soft-grey-daily-02.jpg", "/seed-images/mulberry-soft-grey-daily-03.jpg"],
    price: 22800,
  },
  /* =========================
     WEDDING / GRAND
  ========================== */
  {
    id: "tussar-crimson-zari-wedding",
    name: "Tussar Silk – Crimson Zari Wedding",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Warm", "Red"],
    occasions: ["Wedding"],
    images: ["/seed-images/tussar-crimson-zari-wedding-01.jpg", "/seed-images/tussar-crimson-zari-wedding-02.jpg", "/seed-images/tussar-crimson-zari-wedding-03.jpg"],
    price: 58000,
  },
  {
    id: "tussar-antique-gold-bridal",
    name: "Tussar Silk – Antique Gold Bridal",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Gold", "Warm"],
    occasions: ["Wedding"],
    images: ["/seed-images/tussar-antique-gold-bridal-01.jpg", "/seed-images/tussar-antique-gold-bridal-02.jpg", "/seed-images/tussar-antique-gold-bridal-03.jpg"],
    price: 61000,
  },
  {
    id: "tussar-maroon-temple",
    name: "Tussar Silk – Maroon Temple Border",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Traditional",
    tier: "Heirloom",
    tones: ["Deep", "Warm"],
    occasions: ["Wedding", "Festival"],
    images: ["/seed-images/tussar-maroon-temple-01.jpg", "/seed-images/tussar-maroon-temple-02.jpg", "/seed-images/tussar-maroon-temple-03.jpg"],
    price: 54500,
  },

  /* =========================
     FESTIVE / ETHNIC
  ========================== */
  {
    id: "ghicha-saffron-festive",
    name: "Ghicha Silk – Saffron Festive Drape",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Warm"],
    occasions: ["Festival"],
    images: ["/seed-images/ghicha-saffron-festive-01.jpg", "/seed-images/ghicha-saffron-festive-02.jpg", "/seed-images/ghicha-saffron-festive-03.jpg"],
    price: 34000,
  },
  {
    id: "ghicha-teal-festive",
    name: "Ghicha Silk – Teal Festive Weave",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Cool"],
    occasions: ["Festival"],
    images: ["/seed-images/ghicha-teal-festive-01.jpg", "/seed-images/ghicha-teal-festive-02.jpg", "/seed-images/ghicha-teal-festive-03.jpg"],
    price: 35500,
  },
  {
    id: "ghicha-plum-evening",
    name: "Ghicha Silk – Plum Evening Edit",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Deep"],
    occasions: ["Festival", "Evening"],
    images: ["/seed-images/ghicha-plum-evening-01.jpg", "/seed-images/ghicha-plum-evening-02.jpg", "/seed-images/ghicha-plum-evening-03.jpg"],
    price: 36500,
  },

  /* =========================
     CONTEMPORARY / URBAN
  ========================== */
  {
    id: "mulberry-ash-grey-modern",
    name: "Mulberry Silk – Ash Grey Modern",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Neutral"],
    occasions: ["Office", "Everyday"],
    images: ["/seed-images/mulberry-ash-grey-modern-01.jpg", "/seed-images/mulberry-ash-grey-modern-02.jpg", "/seed-images/mulberry-ash-grey-modern-03.jpg"],
    price: 24800,
  },
  {
    id: "mulberry-denim-blue",
    name: "Mulberry Silk – Denim Blue Contemporary",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Cool"],
    occasions: ["Office", "Everyday"],
    images: ["/seed-images/mulberry-denim-blue-01.jpg", "/seed-images/mulberry-denim-blue-02.jpg", "/seed-images/mulberry-denim-blue-03.jpg"],
    price: 26500,
  },
  {
    id: "mulberry-soft-olive",
    name: "Mulberry Silk – Soft Olive Modern",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Earthy"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-soft-olive-01.jpg", "/seed-images/mulberry-soft-olive-02.jpg", "/seed-images/mulberry-soft-olive-03.jpg"],
    price: 25200,
  },

  /* =========================
     GEN Z / TREND
  ========================== */
  {
    id: "mulberry-sky-blue-genz",
    name: "Mulberry Silk – Sky Blue Gen-Z",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Cool"],
    occasions: ["Everyday", "Gift"],
    images: ["/seed-images/mulberry-sky-blue-genz-01.jpg", "/seed-images/mulberry-sky-blue-genz-02.jpg", "/seed-images/mulberry-sky-blue-genz-03.jpg"],
    price: 23800,
  },
  {
    id: "mulberry-peach-soft",
    name: "Mulberry Silk – Peach Soft Edit",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Warm"],
    occasions: ["Gift", "Everyday"],
    images: ["/seed-images/mulberry-peach-soft-01.jpg", "/seed-images/mulberry-peach-soft-02.jpg", "/seed-images/mulberry-peach-soft-03.jpg"],
    price: 24200,
  },
  {
    id: "mulberry-lavender-mist",
    name: "Mulberry Silk – Lavender Mist",
    fabric: "Mulberry",
    weight: "Light",
    style: "Contemporary",
    tier: "Everyday",
    tones: ["Soft", "Cool"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-lavender-mist-01.jpg", "/seed-images/mulberry-lavender-mist-02.jpg", "/seed-images/mulberry-lavender-mist-03.jpg"],
    price: 24500,
  },

  /* =========================
     PREMIUM / LUXE
  ========================== */
  {
    id: "tussar-royal-blue-luxe",
    name: "Tussar Silk – Royal Blue Luxe",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Elegant",
    tier: "Heirloom",
    tones: ["Cool", "Blue"],
    occasions: ["Reception", "Evening"],
    images: ["/seed-images/tussar-royal-blue-luxe-01.jpg", "/seed-images/tussar-royal-blue-luxe-02.jpg", "/seed-images/tussar-royal-blue-luxe-03.jpg"],
    price: 67000,
  },
  {
    id: "tussar-ivory-gold-luxe",
    name: "Tussar Silk – Ivory Gold Luxe",
    fabric: "Tussar",
    weight: "Heavy",
    style: "Elegant",
    tier: "Heirloom",
    tones: ["Neutral", "Gold"],
    occasions: ["Wedding"],
    images: ["/seed-images/tussar-ivory-gold-luxe-01.jpg", "/seed-images/tussar-ivory-gold-luxe-02.jpg", "/seed-images/tussar-ivory-gold-luxe-03.jpg"],
    price: 69000,
  },

  /* =========================
     GIFT / CLASSIC
  ========================== */
  {
    id: "ghicha-powder-blue-gift",
    name: "Ghicha Silk – Powder Blue Gift",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Cool"],
    occasions: ["Gift"],
    images: ["/seed-images/ghicha-powder-blue-gift-01.jpg", "/seed-images/ghicha-powder-blue-gift-02.jpg", "/seed-images/ghicha-powder-blue-gift-03.jpg"],
    price: 30500,
  },
  {
    id: "ghicha-warm-beige-gift",
    name: "Ghicha Silk – Warm Beige Gift",
    fabric: "Ghicha",
    weight: "Medium",
    style: "Elegant",
    tier: "Occasion",
    tones: ["Neutral"],
    occasions: ["Gift"],
    images: ["/seed-images/ghicha-warm-beige-gift-01.jpg", "/seed-images/ghicha-warm-beige-gift-02.jpg", "/seed-images/ghicha-warm-beige-gift-03.jpg"],
    price: 31500,
  },

  /* =========================
     DAILY COMFORT
  ========================== */
  {
    id: "mulberry-soft-sand",
    name: "Mulberry Silk – Soft Sand Daily",
    fabric: "Mulberry",
    weight: "Light",
    style: "Elegant",
    tier: "Everyday",
    tones: ["Neutral"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-soft-sand-01.jpg", "/seed-images/mulberry-soft-sand-02.jpg", "/seed-images/mulberry-soft-sand-03.jpg"],
    price: 22000,
  },
  {
    id: "mulberry-mushroom-grey",
    name: "Mulberry Silk – Mushroom Grey",
    fabric: "Mulberry",
    weight: "Light",
    style: "Elegant",
    tier: "Everyday",
    tones: ["Neutral"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-mushroom-grey-01.jpg", "/seed-images/mulberry-mushroom-grey-02.jpg", "/seed-images/mulberry-mushroom-grey-03.jpg"],
    price: 22500,
  },
  {
    id: "mulberry-warm-caramel",
    name: "Mulberry Silk – Warm Caramel",
    fabric: "Mulberry",
    weight: "Light",
    style: "Elegant",
    tier: "Everyday",
    tones: ["Warm"],
    occasions: ["Everyday"],
    images: ["/seed-images/mulberry-warm-caramel-01.jpg", "/seed-images/mulberry-warm-caramel-02.jpg", "/seed-images/mulberry-warm-caramel-03.jpg"],
    price: 23200,
  }


];
