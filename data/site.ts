/**
 * Static site configuration (navigation, marketing copy).
 * All product, review, pricing and stats data lives in PocketBase.
 */

export const navLinks = [
  { href: "/browse", label: "Browse Products" },
  { href: "/reviews", label: "Reviews" },
  { href: "/pricing", label: "Pricing" },
  { href: "/advertise", label: "Advertise" },
];

/** Marketing figures that aren't tracked in the database. */
export const marketingStats = [
  { value: "DR 53", label: "Domain authority", sub: "Powered by Ahrefs" },
  { value: "107,730", label: "Monthly visitors", sub: "Powered by Cloudflare" },
];

export const heroFeatures = ["Free forever", "Takes 30 seconds", "Permanent dofollow backlink"];

export const footerGroups = [

  {
    heading: "PLATFORM",
    links: [
      { href: "/browse", label: "Browse Products" },
      { href: "/launch", label: "Submit a Project" },
      { href: "/pricing", label: "Pricing & Premium" },
      { href: "/reviews", label: "Reviews" },
      { href: "/advertise", label: "Advertise" },
    ],
  },
  {
    heading: "RESOURCES",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/compare", label: "Platform Comparisons" },
      { href: "/faq", label: "Frequently Asked Questions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/contact", label: "Help & Support" },
    ],
  },
];
