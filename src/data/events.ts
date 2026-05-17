export type EventGalleryImage = {
  filename: string;
  alt: string;
};

export type EventFlier = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
};

export const SPRING_2026_GALLERY_BASE = "/images/popup-spring-2026/gallery";

export const SPRING_2026_GALLERY: EventGalleryImage[] = [
  {
    filename: "hero-room-wide.jpeg",
    alt: "Families browsing tables of children's clothing at the KBK Kids Community Closet spring event",
  },
  {
    filename: "room-overview.jpeg",
    alt: "Wide view of the community hall filled with clothing tables and attendees",
  },
  {
    filename: "hall-full-room.jpeg",
    alt: "Volunteers and families gathered around round tables of sorted children's clothes",
  },
  {
    filename: "community-browsing.jpeg",
    alt: "Parents and children looking through colorful piles of donated clothing",
  },
  {
    filename: "tables-clothing.jpeg",
    alt: "Round tables covered with neatly folded children's shirts and pants",
  },
  {
    filename: "organizer-at-tables.jpeg",
    alt: "Volunteer organizing clothing between tables at the pop-up",
  },
  {
    filename: "folded-shirts.jpeg",
    alt: "Close-up of folded shirts stacked on a white table",
  },
  {
    filename: "summer-clothes-table.jpeg",
    alt: "Bright summer children's clothing piled on a round table near a shoe display",
  },
  {
    filename: "baby-clothes-table.jpeg",
    alt: "Table overflowing with baby and toddler onesies and outfits",
  },
  {
    filename: "baby-clothes-pile.jpeg",
    alt: "Colorful pile of infant clothing with floral prints and stripes",
  },
  {
    filename: "clothing-heap.jpeg",
    alt: "Large assortment of children's jackets, dresses, and pants ready to browse",
  },
  {
    filename: "shoes-table.jpeg",
    alt: "Rows of children's shoes arranged on a folding table",
  },
  {
    filename: "toddler-shoes.jpeg",
    alt: "Toddler sitting on the floor surrounded by donated children's shoes",
  },
  {
    filename: "blueberry-scones.jpeg",
    alt: "Box of Maine wild blueberry scones from Five Acre Farm at the event",
  },
  {
    filename: "gluten-free-cake.jpeg",
    alt: "Gluten-free chocolate bundt cake with handwritten label at the refreshment table",
  },
];

export function getSpring2026GallerySrc(filename: string) {
  return `${SPRING_2026_GALLERY_BASE}/${encodeURIComponent(filename)}`;
}

export const SWAP_2025_GALLERY: EventGalleryImage[] = [
  { filename: "FullSizeRender (1).jpeg", alt: "Families at the 2025 swap event" },
  { filename: "FullSizeRender (2).jpeg", alt: "Clothing tables at the 2025 swap" },
  { filename: "FullSizeRender (3).jpeg", alt: "Volunteers sorting donations at the swap" },
  { filename: "FullSizeRender (4).jpeg", alt: "Community members browsing clothing" },
  { filename: "FullSizeRender.jpeg", alt: "Overview of the swap event space" },
  { filename: "IMG_2040.JPG", alt: "Donated children's items on display" },
  { filename: "IMG_4283.jpeg", alt: "Folded clothing ready for families" },
  { filename: "IMG_4284.jpeg", alt: "Tables of sorted children's clothes" },
  { filename: "IMG_4285.jpeg", alt: "Families selecting items at the swap" },
  { filename: "IMG_4286.jpeg", alt: "Volunteers at the clothing swap" },
  { filename: "IMG_4292.jpeg", alt: "Piles of donated children's clothing" },
  { filename: "IMG_4293.jpeg", alt: "Community gathering at the swap" },
  { filename: "IMG_4295.jpeg", alt: "Children's apparel on tables" },
  { filename: "IMG_4296.jpeg", alt: "Swap event activity in the hall" },
  { filename: "IMG_4297.jpeg", alt: "Donated items organized for distribution" },
  { filename: "IMG_4298.jpeg", alt: "Families browsing at the swap" },
  { filename: "IMG_4299.jpeg", alt: "Clothing and essentials at the swap event" },
];

export const SWAP_2025_GALLERY_BASE = "/images/swap-2025";

export function getSwap2025GallerySrc(filename: string) {
  return `${SWAP_2025_GALLERY_BASE}/${encodeURIComponent(filename)}`;
}

export const EVENT_FLIERS: EventFlier[] = [
  {
    id: "spring-2026",
    src: "/images/popup-spring-2026/event-promo.png",
    alt: "Spring pop-up flyer: KBK Kids Community Closet spring event details and donation information",
    width: 612,
    height: 816,
    label: "Spring Pop-up 2026",
  },
  {
    id: "swap-2025",
    src: "/images/swap-2025/swap-promo.png",
    alt: "Swap 2025 flyer: community clothing swap and donation information",
    width: 612,
    height: 816,
    label: "Community Swap 2025",
  },
];

export const SPRING_2026_EVENT_DATE = new Date(2026, 4, 10);

export const SPRING_2026_EVENT_TITLE = "Spring Pop-up";

export const SPRING_2026_PARTNER_PROGRAMS = [
  {
    name: "Impacto Ministries",
    description:
      "Happy Tummy\u2019s program in San Juan, Guatemala, feeding and nourishing more than 600 children every day from local villages.",
  },
  {
    name: "Alpha",
    description:
      "A pregnancy resource center in Sanford, Maine offering free, confidential services for individuals facing unplanned pregnancies.",
  },
  {
    name: "Community Baptist Church",
    description:
      "A community closet in Waterboro, Maine supporting local families.",
  },
] as const;

export const SPRING_2026_SPONSORS = [
  "Five Acre Farm",
  "Sarah Elia",
  "Kennebunk Savings",
  "Coastal Kids Occupational Therapy, PLLC",
] as const;

export function formatEventMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
