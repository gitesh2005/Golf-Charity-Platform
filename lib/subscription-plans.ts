export type PlanTier = "free" | "starter" | "pro" | "elite"

export interface SubscriptionPlan {
  id: PlanTier
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  stripePriceIdMonthly: string | null
  stripePriceIdYearly: string | null
  features: string[]
  drawEntries: number
  maxScoresStored: number
  charityBonus: number
  highlighted?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with basic features",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: [
      "Track up to 5 scores",
      "1 draw entry per round",
      "Basic statistics",
      "Choose 1 charity",
    ],
    drawEntries: 1,
    maxScoresStored: 5,
    charityBonus: 0,
  },
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for casual golfers",
    priceMonthly: 999,
    priceYearly: 9990,
    stripePriceIdMonthly: "price_starter_monthly",
    stripePriceIdYearly: "price_starter_yearly",
    features: [
      "Track up to 20 scores",
      "2 draw entries per round",
      "Detailed statistics",
      "Choose up to 3 charities",
      "Priority support",
    ],
    drawEntries: 2,
    maxScoresStored: 20,
    charityBonus: 5,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For dedicated players",
    priceMonthly: 1999,
    priceYearly: 19990,
    stripePriceIdMonthly: "price_pro_monthly",
    stripePriceIdYearly: "price_pro_yearly",
    features: [
      "Unlimited score history",
      "5 draw entries per round",
      "Advanced analytics",
      "Unlimited charities",
      "10% charity bonus",
      "Exclusive tournaments",
    ],
    drawEntries: 5,
    maxScoresStored: -1,
    charityBonus: 10,
    highlighted: true,
  },
  {
    id: "elite",
    name: "Elite",
    description: "The ultimate PlayWin experience",
    priceMonthly: 4999,
    priceYearly: 49990,
    stripePriceIdMonthly: "price_elite_monthly",
    stripePriceIdYearly: "price_elite_yearly",
    features: [
      "Everything in Pro",
      "10 draw entries per round",
      "VIP prize pools",
      "20% charity bonus",
      "Personal concierge",
      "Early access features",
    ],
    drawEntries: 10,
    maxScoresStored: -1,
    charityBonus: 20,
  },
]

export function getPlanById(id: PlanTier): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}
