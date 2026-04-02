"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Crown, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SUBSCRIPTION_PLANS, formatPrice } from "@/lib/subscription-plans"
import { createCheckoutSession } from "@/app/actions/stripe"
import { useRouter } from "next/navigation"
import Link from "next/link"

const planIcons = {
  free: Sparkles,
  starter: Star,
  pro: Zap,
  elite: Crown,
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      router.push("/auth/sign-up")
      return
    }

    setLoading(planId)
    try {
      const result = await createCheckoutSession(planId as "starter" | "pro" | "elite", billingPeriod)
      if (result.error) {
        if (result.error === "You must be logged in to subscribe") {
          router.push("/auth/login?redirect=/pricing")
        } else {
          alert(result.error)
        }
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PlayWin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-primary">Winning</span> Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Unlock more draw entries, advanced analytics, and exclusive features. 
            Every subscription supports charities you care about.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing" className={billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}>
              Monthly
            </Label>
            <Switch
              id="billing"
              checked={billingPeriod === "yearly"}
              onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
            />
            <Label htmlFor="billing" className={billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"}>
              Yearly
              <span className="ml-2 text-xs text-primary font-semibold">Save 17%</span>
            </Label>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const Icon = planIcons[plan.id]
            const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly
            const monthlyEquivalent = billingPeriod === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col ${
                  plan.highlighted 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
                    : "border-border/40 bg-card/50"
                }`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                      plan.highlighted 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">
                          {formatPrice(monthlyEquivalent)}
                        </span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                      {billingPeriod === "yearly" && price > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(price)} billed yearly
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading !== null}
                    >
                      {loading === plan.id ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </span>
                      ) : plan.id === "free" ? (
                        "Get Started Free"
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border border-border/40 rounded-lg p-6 bg-card/50">
              <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time. You will continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="border border-border/40 rounded-lg p-6 bg-card/50">
              <h3 className="font-semibold mb-2">How do draw entries work?</h3>
              <p className="text-muted-foreground">
                Every time you log a round, you earn draw entries based on your plan. More entries means higher chances of winning in our weekly prize draws.
              </p>
            </div>
            
            <div className="border border-border/40 rounded-lg p-6 bg-card/50">
              <h3 className="font-semibold mb-2">What is the charity bonus?</h3>
              <p className="text-muted-foreground">
                Premium plans include a charity bonus. A percentage of your subscription goes directly to your chosen charities on top of the standard contributions.
              </p>
            </div>
            
            <div className="border border-border/40 rounded-lg p-6 bg-card/50">
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can change your plan at any time from your dashboard. Upgrades take effect immediately, and downgrades apply at the next billing cycle.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
