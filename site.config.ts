/**
 * Everything about the business lives in this one file.
 * Write all text in Serbian Latin — the Cyrillic version of the site is generated automatically.
 *
 * The values below are a fictional demo ("Bistro Lipa"). Replace them with your client's data.
 */

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
/** [open, close] in 24h "HH:MM". If close is earlier than open, the place closes after midnight. */
export type Hours = Record<DayKey, [string, string] | null>;

export type Service = { name: string; description?: string; price?: number; priceFrom?: boolean };

export const site = {
  /** Production URL, used for canonical links, sitemap and structured data. */
  url: "https://bistro-lipa.example.com",
  name: "Bistro Lipa",
  /** schema.org type: Restaurant, CafeOrCoffeeShop, HairSalon, BeautySalon, Dentist, AutoRepair, Store, LocalBusiness… */
  type: "Restaurant",
  tagline: "Domaća kuhinja u hladu stare lipe",
  description:
    "Mali porodični bistro sa domaćom kuhinjom, baštom i doručkom ceo dan. Rezervacije telefonom, WhatsApp-om ili Viber-om.",
  /** Used in titles and descriptions for local search, e.g. "restoran Zemun". */
  seoKeyword: "restoran Zemun",
  accent: "#2f6b4f",
  currency: "RSD",

  contact: {
    /** International format without spaces or "+", e.g. 381641234567 */
    phone: "381600000000",
    phoneDisplay: "060 000 0000",
    email: "info@bistro-lipa.example.com",
    whatsapp: true,
    viber: true,
    /** Optional form backend (Formspree, Basin, your own API). If empty, the form opens the visitor's email app. */
    formEndpoint: "",
  },

  address: {
    street: "Ulica Primer 1",
    city: "Beograd",
    postalCode: "11080",
    country: "RS",
    /** Optional, improves map accuracy and structured data. */
    geo: { lat: 44.8433, lng: 20.4011 },
  },

  hours: {
    mon: ["08:00", "22:00"],
    tue: ["08:00", "22:00"],
    wed: ["08:00", "22:00"],
    thu: ["08:00", "22:00"],
    fri: ["08:00", "00:30"],
    sat: ["09:00", "00:30"],
    sun: null,
  } satisfies Hours as Hours,

  servicesTitle: "Iz naše kuhinje",
  services: [
    { name: "Doručak Lipa", description: "Jaja, kajmak, domaći hleb i sezonsko povrće", price: 690 },
    { name: "Ćevapi sa lepinjom", description: "Deset komada, luk i ajvar", price: 950 },
    { name: "Pileći ražnjići", description: "Uz pomfrit i šopsku salatu", price: 1100 },
    { name: "Čorba dana", description: "Pitajte šta se danas kuva", price: 420 },
    { name: "Palačinke", description: "Eurokrem, džem od šljiva ili orasi", price: 380 },
    { name: "Ketering za proslave", description: "Meni po dogovoru", price: 1800, priceFrom: true },
  ] satisfies Service[] as Service[],

  /** Put images in /public/gallery. Alt text is required for accessibility and SEO. */
  gallery: [
    { src: "/gallery/1.svg", alt: "Bašta bistroa pod lipom" },
    { src: "/gallery/2.svg", alt: "Doručak sa kajmakom i domaćim hlebom" },
    { src: "/gallery/3.svg", alt: "Ćevapi sa lepinjom i ajvarom" },
    { src: "/gallery/4.svg", alt: "Enterijer bistroa" },
  ],

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

export type Site = typeof site;
