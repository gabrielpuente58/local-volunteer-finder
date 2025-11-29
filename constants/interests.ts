// Standard interest categories for volunteers and opportunities
export const INTEREST_CATEGORIES = [
  "Environment",
  "Education",
  "Community",
  "Health",
  "Animals",
  "Arts & Culture",
  "Children & Youth",
  "Seniors",
  "Food & Hunger",
  "Housing & Homelessness",
  "Sports & Recreation",
  "Technology",
  "Disaster Relief",
  "Advocacy & Human Rights",
  "Mental Health",
  "Veterans",
  "LGBTQ+",
  "International Aid",
  "Faith-Based",
  "Environmental Justice",
] as const;

export type InterestCategory = (typeof INTEREST_CATEGORIES)[number];
