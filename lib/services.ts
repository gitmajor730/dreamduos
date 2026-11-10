export type ChoiceField = {
  kind: "choice";
  key: string;
  label: string;
  options: string[];
  multiple?: boolean;
  showIf?: (details: Record<string, string | string[]>) => boolean;
};

export type TextField = {
  kind: "text" | "textarea";
  key: string;
  label: string;
  showIf?: (details: Record<string, string | string[]>) => boolean;
};

export type ServiceField = ChoiceField | TextField;

export const services = [
  { id: "cleaning", label: "House cleaning", description: "Standard and deep cleaning" },
  { id: "organizing", label: "Home organizing", description: "Closets, pantries, and more" },
  { id: "laundry", label: "Laundry and household help", description: "Laundry and everyday tasks" },
  { id: "massage", label: "Massage therapy", description: "Licensed in-home massage" },
  { id: "childcare", label: "Childcare", description: "Babysitting and family support" },
  { id: "pet_care", label: "Pet care", description: "Sitting, walking, and pet assistance" },
] as const;

export type ServiceId = (typeof services)[number]["id"];

const yesNo = ["Yes", "No"];

export const serviceFields: Record<ServiceId, ServiceField[]> = {
  cleaning: [
    { kind: "choice", key: "cleaning_types", label: "Types of cleaning", multiple: true, options: ["Standard", "Deep", "Move-in/out", "Post-renovation", "Recurring", "Other"] },
    { kind: "choice", key: "deep_tasks", label: "Deep-clean tasks", multiple: true, options: ["Ovens", "Refrigerators", "Interior cabinets", "Baseboards", "Other"], showIf: (d) => includes(d.cleaning_types, "Deep") },
    { kind: "choice", key: "areas", label: "Areas of experience", multiple: true, options: ["Kitchens", "Bathrooms", "Bedrooms", "Floors", "Appliances", "Windows", "Other"] },
    { kind: "choice", key: "laundry", label: "Laundry assistance", options: yesNo },
    { kind: "choice", key: "pets", label: "Comfortable with homes containing pets?", options: ["Yes", "No", "Depends"] },
    { kind: "choice", key: "supplies", label: "Bring your own supplies?", options: ["Yes", "No", "Either"] },
    { kind: "choice", key: "equipment", label: "Equipment", multiple: true, options: ["Vacuum", "Mop", "Other", "Customer-provided"] },
    { kind: "choice", key: "eco", label: "Eco-friendly products available?", options: yesNo },
    { kind: "choice", key: "worked_for_business", label: "Previously worked for a cleaning business?", options: yesNo },
    { kind: "text", key: "business_role", label: "Business name and role", showIf: (d) => d.worked_for_business === "Yes" },
    { kind: "choice", key: "alongside", label: "Comfortable working alongside another provider?", options: yesNo },
    { kind: "choice", key: "duration", label: "Preferred job duration", options: ["1–2 hours", "2–3 hours", "3–4 hours", "4+ hours"] },
  ],
  organizing: [
    { kind: "choice", key: "areas", label: "Areas you organize", multiple: true, options: ["Closets", "Kitchens", "Pantries", "Garages", "Playrooms", "Offices", "Bedrooms"] },
    { kind: "choice", key: "declutter", label: "Decluttering help", options: yesNo },
    { kind: "choice", key: "packing", label: "Packing or unpacking", options: yesNo },
    { kind: "choice", key: "donation", label: "Donation preparation", options: yesNo },
    { kind: "choice", key: "systems", label: "Organization systems", multiple: true, options: ["Storage solutions", "Labeling", "Categorization"] },
    { kind: "choice", key: "sorting", label: "Comfortable sorting household items?", options: yesNo },
    { kind: "choice", key: "shopping", label: "Shopping for organization supplies", options: yesNo },
    { kind: "textarea", key: "pro_experience", label: "Professional organizing experience" },
  ],
  laundry: [
    { kind: "choice", key: "tasks", label: "Tasks offered", multiple: true, options: ["Washing", "Drying", "Folding", "Ironing", "Changing linens"] },
    { kind: "choice", key: "tidying", label: "Light tidying", options: yesNo },
    { kind: "choice", key: "dishes", label: "Dishwashing or kitchen reset", options: yesNo },
    { kind: "choice", key: "errands", label: "Errands or grocery pickup", options: yesNo },
    { kind: "choice", key: "meals", label: "Meal preparation", options: yesNo },
    { kind: "choice", key: "errand_transport", label: "Transportation for errands", options: ["Yes", "No", "Not applicable"] },
  ],
  massage: [
    { kind: "choice", key: "ga_license", label: "Do you hold an active Georgia massage therapy license?", options: yesNo },
    { kind: "text", key: "license_number", label: "Georgia license number", showIf: (d) => d.ga_license === "Yes" },
    { kind: "text", key: "license_expiration", label: "License expiration", showIf: (d) => d.ga_license === "Yes" },
    { kind: "choice", key: "modalities", label: "Massage modalities", multiple: true, options: ["Swedish", "Deep tissue", "Sports", "Prenatal", "Other"] },
    { kind: "textarea", key: "specialized_training", label: "Specialized training", showIf: (d) => includes(d.modalities, "Prenatal") || includes(d.modalities, "Sports") },
    { kind: "choice", key: "insurance", label: "Professional liability insurance", options: ["Yes", "No", "In process"] },
    { kind: "choice", key: "table", label: "Bring a portable massage table?", options: yesNo },
    { kind: "choice", key: "linens", label: "Bring linens and supplies?", options: yesNo },
    { kind: "choice", key: "durations", label: "Session lengths", multiple: true, options: ["60 minutes", "90 minutes", "120 minutes"] },
    { kind: "choice", key: "in_home", label: "Experience with in-home appointments", options: yesNo },
    { kind: "textarea", key: "travel", label: "Travel and setup requirements" },
  ],
  childcare: [
    { kind: "choice", key: "ages", label: "Ages you are experienced with", multiple: true, options: ["Infants", "Toddlers", "Preschoolers", "Elementary", "Teens"] },
    { kind: "choice", key: "experience_kind", label: "Type of experience", multiple: true, options: ["Paid babysitting", "Nannying", "Daycare", "Camp", "Volunteer", "Other"] },
    { kind: "text", key: "max_children", label: "Maximum children per booking" },
    { kind: "choice", key: "infant", label: "Infant care experience", options: yesNo },
    { kind: "choice", key: "care_tasks", label: "Care tasks", multiple: true, options: ["Feeding", "Diaper changing", "Homework help"] },
    { kind: "choice", key: "cpr", label: "CPR certification", options: ["Yes", "No", "Expired"] },
    { kind: "choice", key: "first_aid", label: "First-aid certification", options: ["Yes", "No", "Expired"] },
    { kind: "text", key: "cert_expiration", label: "Certification expiration", showIf: (d) => d.cpr === "Yes" || d.first_aid === "Yes" },
    { kind: "choice", key: "pets", label: "Comfortable with pets in the home?", options: yesNo },
    { kind: "choice", key: "screening", label: "Willing to complete required screenings?", options: yesNo },
  ],
  pet_care: [
    { kind: "choice", key: "animals", label: "Animals cared for", multiple: true, options: ["Dogs", "Cats", "Small pets", "Other"] },
    { kind: "choice", key: "pet_services", label: "Services", multiple: true, options: ["Pet sitting", "Walking", "Feeding", "Playtime"] },
    { kind: "choice", key: "dog_size", label: "Size of dogs handled", multiple: true, options: ["Small", "Medium", "Large"] },
    { kind: "choice", key: "medication", label: "Experience administering pet medication", options: yesNo },
    { kind: "choice", key: "overnight", label: "Overnight visits", options: yesNo },
  ],
};

export const experienceYears = ["Less than 1", "1–2", "3–5", "6–10", "10+"];
export const experienceTypes = ["Professional", "Freelance", "Informal", "Volunteer"];
export const radii = ["5", "10", "15", "20", "25"];
export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function includes(value: string | string[] | undefined, option: string) {
  return Array.isArray(value) && value.includes(option);
}

export function visibleFields(service: ServiceId, details: Record<string, string | string[]>) {
  return serviceFields[service].filter((field) => !field.showIf || field.showIf(details));
}

export function canApproveService(service: string, details: Record<string, unknown>) {
  if (service === "massage" && details.ga_license !== "Yes") return false;
  return true;
}
