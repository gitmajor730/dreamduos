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

export function cycle(index: number, direction: number) {
  return (index + direction + duoServices.length) % duoServices.length;
}
