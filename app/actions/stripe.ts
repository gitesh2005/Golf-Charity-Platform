"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS, type PlanTier } from "@/lib/subscription-plans"

export async function createCheckoutSession(
  planId: PlanTier,
  billingPeriod: "monthly" | "yearly"
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to subscribe" }
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
  if (!plan) {
    return { error: "Invalid plan selected" }
  }

  if (plan.id === "free") {
    return { error: "Cannot checkout for free plan" }
  }

  const priceInCents =
    billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly

  // Check if user already has a Stripe customer ID
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  let customerId = subscription?.stripe_customer_id

  // Create a new customer if one doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID to database
    await supabase
      .from("subscriptions")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id)
  }

  try {
    // Create a price on-the-fly (in production, you'd use pre-created Stripe prices)
    const price = await stripe.prices.create({
      unit_amount: priceInCents,
      currency: "usd",
      recurring: {
        interval: billingPeriod === "monthly" ? "month" : "year",
      },
      product_data: {
        name: `PlayWin ${plan.name} Plan`,
        metadata: {
          plan_id: plan.id,
        },
      },
    })

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        billing_period: billingPeriod,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_id: plan.id,
        },
      },
    })

    return { url: session.url }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function createCustomerPortalSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  if (!subscription?.stripe_customer_id) {
    return { error: "No subscription found" }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Portal session error:", error)
    return { error: "Failed to create portal session" }
  }
}

export async function getUserSubscription() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return subscription
}
