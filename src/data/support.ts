export type SupportCategoryId = "partners" | "sponsors" | "supporters";

export type SupportOrg = {
  name: string;
  /** Accessible description of the logo */
  logoAlt: string;
  href?: string;
  logo?: {
    src: string;
    width: number;
    height: number;
  };
};

export type SupportSection = {
  id: SupportCategoryId;
  title: string;
  description: string;
  items: SupportOrg[];
};

export const supportSections: SupportSection[] = [
  {
    id: "partners",
    title: "Partners",
    description:
      "Community partners who work alongside us to serve children and families.",
    items: [
      {
        name: "Alpha",
        logoAlt:
          "Alpha — lowercase wordmark with a row of five colorful squares",
        href: "https://alpha-prc.com/",
        logo: {
          src: "/images/partners/alpha.png",
          width: 1024,
          height: 338,
        },
      },
      {
        name: "COS Of Kennebunk",
        logoAlt:
          "Community Outreach Services — community outreach services wordmark with sun icon on dark teal",
        href: "https://coskennebunks.org/",
        logo: {
          src: "/images/partners/cos-of-kennebunk.png",
          width: 300,
          height: 116,
        },
      },
    ],
  },
  {
    id: "sponsors",
    title: "Sponsors",
    description:
      "Organizations whose generosity helps keep the closet stocked and running.",
    items: [
      {
        name: "Five Acre Farm",
        logoAlt:
          "Five Acre Farm logo, Kennebunkport Maine — circular mark with floral garland",
        href: "https://www.facebook.com/fiveacrefarmmaine/",
        logo: {
          src: "/images/sponsors/five-acre-farm.png",
          width: 1009,
          height: 1024,
        },
      },
      {
        name: "Coastal Kids Occupational Therapy",
        logoAlt:
          "Coastal Kids Occupational Therapy, PLLC — watercolor C and waves with organization name",
        href: "https://www.coastalkidsphysicaltherapy.com/",
        logo: {
          src: "/images/sponsors/coastal-kids-ot.png",
          width: 1024,
          height: 520,
        },
      },
      {
        name: "Sarah Elia, MPT",
        logoAlt: "Sarah Elia, MPT — pelvic health physical therapy logo",
        href: "https://www.saraheliampt.com",
        logo: {
          src: "/images/sponsors/sarah-elia-mpt.png",
          width: 1024,
          height: 463,
        },
      },
      {
        name: "Smilecraft Dental",
        logoAlt: "Smilecraft Dental logo",
        href: "https://smilecraftmaine.com/",
        logo: {
          src: "/images/sponsors/smilecraft-dental.png",
          width: 1024,
          height: 308,
        },
      },
      {
        name: "Kennebunk Savings Bank",
        logoAlt: "Kennebunk Savings logo with tree icon",
        href: "https://www.kennebunksavings.com/",
        logo: {
          src: "/images/sponsors/kennebunk-savings.png",
          width: 1024,
          height: 330,
        },
      },
    ],
  },
  {
    id: "supporters",
    title: "Supporters",
    description: "Local businesses and friends who cheer us on.",
    items: [
      {
        name: "Sweet Pea Consignment",
        logoAlt:
          "Sweet Pea Consignment — t-shirt on a clothesline with recycling symbol",
        href: "https://www.sweetpeaportsmouth.com/",
        logo: {
          src: "/images/sponsors/sweet-pea-consignment.png",
          width: 880,
          height: 738,
        },
      },
    ],
  },
];
