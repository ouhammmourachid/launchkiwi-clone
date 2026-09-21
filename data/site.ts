export interface Product {
  id: string;
  name: string;
  badge?: "PRIORITY" | "PREMIUM";
  description: string;
  tags: string[];
  votes: number;
  iconBg: string;
  iconType: string;
  linkUrl?: string;
  highlighted?: boolean;
}

export const navLinks = [
  { href: "/browse", label: "Browse Products" },
  { href: "/reviews", label: "Reviews" },
  { href: "/pricing", label: "Pricing" },
  { href: "/advertise", label: "Advertise" },
];

export const leftSidebarProducts = [
  {
    name: "DrawGenie",
    blurb: "Create custom AI-generated coloring books starring yo...",
    bg: "bg-[#3b82f6]",
    icon: "✏️",
  },
  {
    name: "Honeyfield ...",
    blurb: "Run Google Ads, GA4 and GTM from your AI chat",
    bg: "bg-[#8b5cf6]",
    icon: "⬡",
  },
  {
    name: "LinkedIn MC...",
    blurb: "Reach MCP connects your real LinkedIn account to...",
    bg: "bg-[#1e293b]",
    icon: "💼",
  },
  {
    name: "PageCub",
    blurb: "Custom and personalized illustrated kids books, from...",
    bg: "bg-[#f59e0b]",
    icon: "🐻",
  },
  {
    name: "Kwip",
    blurb: "Malta's courier for online shops. Book a pickup whe...",
    bg: "bg-[#ea580c]",
    icon: "📦",
  },
];

export const rightSidebarProducts = [
  {
    name: "ReviewTurbo",
    blurb: "AI replies for your customer reviews.",
    bg: "bg-[#7c3aed]",
    icon: "⚡",
  },
  {
    name: "Porn blocke...",
    blurb: "Protect yourself and your family with a blocker built t...",
    bg: "bg-[#0d9488]",
    icon: "🔘",
  },
  {
    name: "Personal Bla...",
    blurb: "Physics-inspired black holes for any web page — Solo,...",
    bg: "bg-[#18181b]",
    icon: "🕳️",
  },
  {
    name: "CoRegulateAI",
    blurb: "The Personalized Operating System for Emotional...",
    bg: "bg-[#ec4899]",
    icon: "🌸",
  },
  {
    name: "Advertise",
    blurb: "Book this slot",
    isAd: true,
  },
];

export const thisWeeksHunts: Product[] = [
  {
    id: "pagecub",
    name: "PageCub",
    badge: "PRIORITY",
    description: "Custom and personalized illustrated kids books, from scratch every time. Make them the hero!",
    tags: ["Freemium", "Design", "E-commerce", "SaaS", "Other"],
    votes: 7,
    iconBg: "bg-[#fffbeb]",
    iconType: "bear",
    linkUrl: "https://launchkiwi.com/p/pagecub",
    highlighted: true,
  },
  {
    id: "linkedin-mcp",
    name: "LinkedIn MCP Server",
    badge: "PRIORITY",
    description: "Reach MCP connects your real LinkedIn account to Claude, ChatGPT, Cursor or n8n. Six ready playbooks.",
    tags: ["Paid", "SaaS", "Marketing", "AI"],
    votes: 6,
    iconBg: "bg-[#0f172a]",
    iconType: "linkedin",
  },
  {
    id: "coregulateai",
    name: "CoRegulateAI",
    badge: "PRIORITY",
    description: "The Personalized Operating System for Emotional Regulation",
    tags: ["Freemium", "Health Tech", "AI"],
    votes: 9,
    iconBg: "bg-[#f472b6]",
    iconType: "coregulate",
  },
  {
    id: "kwip",
    name: "Kwip",
    badge: "PREMIUM",
    description: "Malta's courier for online shops. Book a pickup when your order's ready, we deliver next day. No contracts, no minimums.",
    tags: ["Paid", "E-commerce", "Other"],
    votes: 6,
    iconBg: "bg-[#ea580c]",
    iconType: "kwip",
    linkUrl: "https://launchkiwi.com/p/kwip",
  },
  {
    id: "personal-black-hole",
    name: "Personal Black Hole",
    badge: "PREMIUM",
    description: "Physics-inspired black holes for any web page — Solo, Binary and Screensaver modes",
    tags: ["Free", "Other"],
    votes: 14,
    iconBg: "bg-[#18181b]",
    iconType: "blackhole",
  },
  {
    id: "honeyfield-mcp",
    name: "Honeyfield Marketing MCP",
    badge: "PREMIUM",
    description: "Run Google Ads, GA4 and GTM from your AI chat",
    tags: ["Free", "AI", "Marketing", "SEO", "SaaS"],
    votes: 13,
    iconBg: "bg-[#7c3aed]",
    iconType: "honeyfield",
  },
  {
    id: "porn-blocked",
    name: "Porn blocked. No OFF switch.",
    badge: "PREMIUM",
    description: "Protect yourself and your family with a blocker built...",
    tags: ["Free", "Other"],
    votes: 18,
    iconBg: "bg-[#0d9488]",
    iconType: "blocker",
  },
];

export const pastMonthHunts: Product[] = [
  {
    id: "mmw",
    name: "MMW",
    description: "Governed memory and an MCP gateway for AI agents",
    tags: ["Free", "AI", "Developer Tools", "APIs", "SaaS"],
    votes: 15,
    iconBg: "bg-[#052e16]",
    iconType: "mmw",
  },
  {
    id: "cheapfax",
    name: "Cheapfax",
    description: "Send outbound faxes from your iPhone for 50¢ per page with no monthly subscription",
    tags: ["Paid", "Productivity"],
    votes: 16,
    iconBg: "bg-[#1e293b]",
    iconType: "cheapfax",
  },
  {
    id: "flightfinder",
    name: "FlightFinder",
    description: "Aviation safety data for any flight, aircraft or airline",
    tags: ["Freemium", "APIs", "SaaS", "Other"],
    votes: 15,
    iconBg: "bg-[#0284c7]",
    iconType: "flightfinder",
    linkUrl: "https://launchkiwi.com/p/flightfinder",
  },
  {
    id: "jern-cloud",
    name: "Jern Cloud",
    badge: "PRIORITY",
    description: "Deploy a governed coding agent that operates in isolated cloud environments",
    tags: ["Free", "Developer Tools"],
    votes: 26,
    iconBg: "bg-[#0f172a]",
    iconType: "jerncloud",
    highlighted: true,
  },
  {
    id: "u4ria",
    name: "U4RIA",
    description: "Your all in one wellness app",
    tags: ["Free", "Health Tech", "AI"],
    votes: 17,
    iconBg: "bg-[#042f2e]",
    iconType: "u4ria",
  },
  {
    id: "mirotalk",
    name: "Mirotalk WebRTC Story",
    description: "Jitsi, Zoom, Teams, Meet alternative",
    tags: ["Free", "Productivity", "Developer Tools", "SaaS"],
    votes: 16,
    iconBg: "bg-[#0f172a]",
    iconType: "mirotalk",
  },
  {
    id: "hostersale",
    name: "HosterSale",
    description: "Web Hosting Company",
    tags: ["Free", "Developer Tools"],
    votes: 4,
    iconBg: "bg-[#1e293b]",
    iconType: "hostersale",
  },
  {
    id: "melaya",
    name: "Melaya",
    description: "Build high trust AI Agent systems. Give your AI hands.",
    tags: ["Freemium", "AI", "Developer Tools", "SaaS", "Productivity"],
    votes: 4,
    iconBg: "bg-[#0f172a]",
    iconType: "melaya",
  },
  {
    id: "words-to-worlds",
    name: "Words to Worlds",
    description: "Describe a place in a hundred words; get back a small living world.",
    tags: ["Free", "AI", "Design", "Other"],
    votes: 4,
    iconBg: "bg-[#15803d]",
    iconType: "wordstoworlds",
  },
];

export const pastWeekHunts: Product[] = [
  {
    id: "tavi",
    name: "Tavi",
    description: "Vaccines, meds, weight & vet visits for your cat or dog — private, offline app. Free - tavi.pet",
    tags: ["Freemium", "Health Tech"],
    votes: 14,
    iconBg: "bg-[#0d9488]",
    iconType: "tavi",
  },
  {
    id: "filex-ai",
    name: "Filex AI",
    description: "Automatically rename, organize, and find every file using AI",
    tags: ["Free", "AI", "SaaS", "Productivity"],
    votes: 12,
    iconBg: "bg-[#0284c7]",
    iconType: "filexai",
  },
  {
    id: "imaginode",
    name: "Imaginode",
    description: "Chain 48 AI models on one node canvas to make images and videos",
    tags: ["Paid", "AI", "SaaS", "Design"],
    votes: 11,
    iconBg: "bg-[#15803d]",
    iconType: "imaginode",
  },
];

export interface ReviewItem {
  id: string;
  badge: string;
  date: string;
  rating: string;
  title: string;
  description: string;
  iconType: string;
  slug: string;
}

export const reviewsData: ReviewItem[] = [
  {
    id: "pagecub-review",
    badge: "PAGECUB",
    date: "September 19, 2026",
    rating: "8.8",
    title: "PageCub: Custom Illustrated Kids Books Built from Scratch",
    description: "Custom and personalized illustrated kids books, from scratch every time. Make them the hero!",
    iconType: "bear",
    slug: "pagecub",
  },
  {
    id: "linkedin-mcp-review",
    badge: "LINKEDIN MCP SERVER",
    date: "September 18, 2026",
    rating: "8.8",
    title: "LinkedIn MCP Server: Bringing AI Automation to LinkedIn Management",
    description: "Reach MCP connects your real LinkedIn account to Claude, ChatGPT, Cursor or n8n. Six ready playbooks.",
    iconType: "linkedin",
    slug: "linkedin-mcp-server",
  },
  {
    id: "coregulateai-review",
    badge: "COREGULATEAI",
    date: "September 16, 2026",
    rating: "9",
    title: "CoRegulateAI Review: Personalized AI Emotional Regulation",
    description: "The Personalized Operating System for Emotional Regulation",
    iconType: "coregulate",
    slug: "coregulateai",
  },
  {
    id: "jerncloud-review",
    badge: "JERN CLOUD",
    date: "September 4, 2026",
    rating: "9.3",
    title: "Jern Cloud Review: Governed Cloud AI Coding for Security-Conscious Teams",
    description: "Deploy a governed coding agent that operates in isolated cloud environments",
    iconType: "jerncloud",
    slug: "jern-cloud",
  },
  {
    id: "certyneo-review",
    badge: "CERTYNEO",
    date: "August 21, 2026",
    rating: "7",
    title: "Certyneo Review: Sovereign European eSignatures and AI Contract Generation",
    description: "Sovereign eIDAS-compliant electronic signature platform hosted in Europe",
    iconType: "cheapfax",
    slug: "certyneo",
  },
  {
    id: "reviewturbo-review",
    badge: "REVIEWTURBO",
    date: "August 20, 2026",
    rating: "6.8",
    title: "ReviewTurbo: AI-Powered Customer Review Replies Examined",
    description: "AI replies for your customer reviews.",
    iconType: "honeyfield",
    slug: "reviewturbo",
  },
];

// ---------------------------------------------------------------------------
// Browse page data
// ---------------------------------------------------------------------------

export const categories = [
  { name: "All", count: 279 },
  { name: "AI", count: 119 },
  { name: "Developer Tools", count: 62 },
  { name: "SaaS", count: 109 },
  { name: "APIs", count: 21 },
  { name: "Productivity", count: 94 },
  { name: "Design", count: 17 },
  { name: "AR/VR", count: 0 },
  { name: "Marketing", count: 48 },
  { name: "Health Tech", count: 13 },
  { name: "E-commerce", count: 11 },
  { name: "Hardware", count: 5 },
  { name: "Robotics", count: 0 },
  { name: "SEO", count: 17 },
  { name: "UI/UX", count: 14 },
  { name: "Other", count: 38 },
];

export const priceFilters = ["All", "Free", "Freemium", "Paid"];

// ---------------------------------------------------------------------------
// Pricing page data
// ---------------------------------------------------------------------------

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for side projects and first-time launches.",
    features: ["Basic listing", "Community voting", "Launch on a permanent page"],
  },
  {
    name: "Featured",
    price: "$29",
    description: "Boost visibility and get more attention from the LaunchKiwi audience.",
    features: ["Priority placement", "Landing page highlight", "Social promotion support"],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$79",
    description: "For founders ready to turn launches into a repeatable growth engine.",
    features: ["High-priority placement", "Weekly report", "Dedicated founder support"],
  },
];

// ---------------------------------------------------------------------------
// Home page hero data
// ---------------------------------------------------------------------------

export interface StatItem {
  value: string;
  label: string;
  sub?: string;
}

export const siteStats: StatItem[] = [
  { value: "11,030", label: "Upvotes" },
  { value: "DR 53", label: "Domain authority", sub: "Powered by Ahrefs" },
  { value: "107,730", label: "Monthly visitors", sub: "Powered by Cloudflare" },
  { value: "358 +", label: "Products submitted" },
];

export const heroFeatures = [
  "Free forever",
  "Takes 30 seconds",
  "358+ products listed",
];

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

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

