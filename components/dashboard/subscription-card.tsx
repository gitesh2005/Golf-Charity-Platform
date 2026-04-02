"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Crown, Zap, Star, Sparkles, ExternalLink, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPlanById, formatPrice, type PlanTier } from "@/lib/subscription-plans"
import { createCustomerPortalSession } from "@/app/actions/stripe"
import Link from "next/link"

interface SubscriptionCardProps {
  subscription: {
    plan: PlanTier
    status: string
    current_period_end: string | null
    stripe_subscription_id: string | null
  } | null
}

const planIcons = {
  free: Sparkles,
  starter: Star,
  pro: Zap,
  elite: Crown,
}

const planColors = {
  free: "bg-muted text-foreground",
  starter: "bg-blue-500/20 text-blue-400",
  pro: "bg-primary/20 text-primary",
  elite: "bg-purple-500/20 text-purple-400",
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false)
  const planId = (subscription?.plan as PlanTier) || "free"
  const plan = getPlanById(planId)
  const Icon = planIcons[planId]

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const result = await createCustomerPortalSession()
      if (result.error) {
        alert(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error("Portal error:", error)
      alert("Failed to open subscription management")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${planColors[planId]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {plan?.name || "Free"} Plan
                <Badge 
                  variant={subscription?.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {subscription?.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {plan?.description || "Basic features"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Plan Benefits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Draw Entries</p>
              <p className="text-lg font-semibold text-primary">
                {plan?.drawEntries || 1}x per round
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Charity Bonus</p>
              <p className="text-lg font-semibold text-primary">
                +{plan?.charityBonus || 0}%
              </p>
            </div>
          </div>

          {/* Subscription Details */}
          {subscription?.stripe_subscription_id && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Next Billing Date</p>
              <p className="font-medium">
                {formatDate(subscription.current_period_end)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {planId === "free" ? (
              <Link href="/pricing" className="flex-1">
                <Button className="w-full" variant="default">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleManageSubscription}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </>
                  )}
                </Button>
                <Link href="/pricing" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Plans
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
