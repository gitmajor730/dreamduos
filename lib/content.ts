export const nav = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#duos", label: "Explore duos" },
  { href: "#duos", label: "Meet your dream duo" },
  { href: "#our-why", label: "Our why" },
] as const;

export const audiences = [
  "Care for your home",
  "Care for your family",
  "Care for yourself",
  "All in one visit",
] as const;

export const duos = [
  {
    title: "The Reset Duo",
    eyebrow: "Less overwhelm. More order.",
    body: "Let someone handle the house while you finally release that tension from your shoulders.",
    tone: "blush",
    icons: ["home", "sparkle"],
  },
  {
    title: "The Breathing Room Duo",
    eyebrow: "Less mental load. More oxygen.",
    body: "A clean surface and a quiet hour of fresh air. Outside. Take a little time back for yourself.",
    tone: "sage",
    icons: ["home", "sparkle"],
  },
  {
    title: "The Me-Time Duo",
    eyebrow: "Less caregiving. More calm.",
    body: "Support for the kids or pets while you settle into a well-earned moment of calm.",
    tone: "lilac",
    icons: ["heart", "sparkle"],
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Make it your own",
    body: "Choose the two services that would make the biggest difference in your day.",
  },
  {
    number: "02",
    title: "Find your rhythm",
    body: "Plan your ideal visit around your home, family, and your schedule.",
  },
  {
    number: "03",
    title: "Let a little help in",
    body: "Our dream duo providers arrive together, so you get more done—or do a little less.",
  },
] as const;

export const faqs = [
  {
    question: "Can I book a visit right now?",
    answer:
      "Not for a same-day visit just yet. Tell us the duo you want, and we’ll write when a pair is open near you. Nothing is charged before a visit is set.",
  },
  {
    question: "Can I choose my own combination?",
    answer:
      "Yes. You choose the two services, so the visit fits your day instead of a package we picked for you.",
  },
  {
    question: "Where will Dream Duos be available?",
    answer:
      "We’re beginning in a handful of neighborhoods. When you build your duo, tell us your city and we’ll say when we arrive.",
  },
  {
    question: "How can I become a provider?",
    answer:
      "If you clean homes, care for children, or offer massage, you can join the provider list. We’ll be in touch as visits open where you work.",
  },
] as const;
