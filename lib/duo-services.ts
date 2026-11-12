export const duoServices = [
  {
    id: "cleaning",
    title: "Home cleaning",
    line: "A fresher space, handled.",
    image: "/duo-cleaning.jpg",
    promise: "A clean home. A deep exhale.",
  },
  {
    id: "massage",
    title: "Massage",
    line: "Your moment to unwind.",
    image: "/duo-massage.jpg",
    promise: "An hour that belongs to you.",
  },
  {
    id: "organizing",
    title: "Organizing",
    line: "A calmer house.",
    image: "/hero-living-room.jpg",
    promise: "Space you can actually enjoy.",
  },
  {
    id: "childcare",
    title: "Childcare",
    line: "Time that's yours.",
    image: "/duo-cleaning.jpg",
    promise: "Help with the little ones.",
  },
  {
    id: "laundry",
    title: "Laundry",
    line: "The piles, handled.",
    image: "/duo-cleaning.jpg",
    promise: "Fresh, folded, and done.",
  },
  {
    id: "pets",
    title: "Pet care",
    line: "They stay happy.",
    image: "/hero-living-room.jpg",
    promise: "Company for the pets.",
  },
] as const;

export type DuoService = (typeof duoServices)[number];

export type VisitField =
  | { kind: "select"; key: string; label: string; options: string[]; defaultValue: string }
  | { kind: "pills"; key: string; label: string; options: string[]; defaultValue: string };

export const visitFields: Record<DuoService["id"], VisitField[]> = {
  cleaning: [
    { kind: "select", key: "bedrooms", label: "Bedrooms", options: ["1", "2", "3", "4", "5+"], defaultValue: "3" },
    { kind: "select", key: "bathrooms", label: "Bathrooms", options: ["1", "2", "3", "4+"], defaultValue: "2" },
    { kind: "select", key: "clean_type", label: "Clean type", options: ["Standard clean", "Deep clean", "Move-in/out"], defaultValue: "Standard clean" },
  ],
  massage: [
    { kind: "pills", key: "duration", label: "Duration", options: ["60 min", "90 min"], defaultValue: "60 min" },
    { kind: "pills", key: "pressure", label: "Pressure", options: ["Light", "Medium", "Firm"], defaultValue: "Medium" },
  ],
  organizing: [
    { kind: "select", key: "rooms", label: "Rooms", options: ["1", "2", "3+"], defaultValue: "1" },
    { kind: "pills", key: "focus", label: "Focus", options: ["Closet", "Kitchen", "Whole home"], defaultValue: "Closet" },
  ],
  childcare: [
    { kind: "select", key: "children", label: "Children", options: ["1", "2", "3+"], defaultValue: "1" },
    { kind: "pills", key: "ages", label: "Ages", options: ["Infant", "Toddler", "School age"], defaultValue: "Toddler" },
  ],
  laundry: [
    { kind: "select", key: "loads", label: "Loads", options: ["1", "2", "3+"], defaultValue: "2" },
    { kind: "pills", key: "finish", label: "Finish", options: ["Wash & fold", "Iron", "Linens"], defaultValue: "Wash & fold" },
  ],
  pets: [
    { kind: "pills", key: "animals", label: "Animals", options: ["Dog", "Cat", "Both"], defaultValue: "Dog" },
    { kind: "pills", key: "visit_type", label: "Visit", options: ["Drop-in", "Walk", "Half day"], defaultValue: "Drop-in" },
  ],
};

export function cycle(index: number, direction: number) {
  return (index + direction + duoServices.length) % duoServices.length;
}
