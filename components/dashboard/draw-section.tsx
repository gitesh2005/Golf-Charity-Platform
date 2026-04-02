"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Ticket, Clock, Trophy, Zap } from "lucide-react";
import { getPlanById, type PlanTier } from "@/lib/subscription-plans";
import Link from "next/link";

interface Score {
  id: string;
  score: number;
  played_at: string;
}

interface Subscription {
  plan: PlanTier;
  status: string;
}

interface DrawSectionProps {
  scores: Score[];
  subscription: Subscription | null;
}

export function DrawSection({ scores, subscription }: DrawSectionProps) {
  const planId = (subscription?.plan as PlanTier) || "free";
  const plan = getPlanById(planId);
  const entriesMultiplier = plan?.drawEntries || 1;
  // Calculate tickets from this week's scores
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekScores = scores.filter(
    (s) => new Date(s.played_at) >= startOfWeek
  );
  const totalTickets = scores.length * entriesMultiplier;
  const weekTickets = thisWeekScores.length * entriesMultiplier;

  // Calculate time until next draw (Sunday 8pm)
  const getNextDrawDate = () => {
    const next = new Date();
    next.setDate(next.getDate() + ((7 - next.getDay()) % 7 || 7));
    next.setHours(20, 0, 0, 0);
    return next;
  };

  const nextDraw = getNextDrawDate();
  const daysUntil = Math.ceil(
    (nextDraw.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="gradient-border border-0 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-accent" />
          Weekly Draw
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prize Pool */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-5 text-center"
        >
          <Trophy className="mx-auto mb-2 h-8 w-8 text-accent" />
          <p className="text-sm text-muted-foreground">This Week&apos;s Prize</p>
          <p className="text-3xl font-bold text-gradient">$5,000</p>
        </motion.div>

        {/* Tickets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-xl font-bold">{totalTickets}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <Ticket className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">{weekTickets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="rounded-lg border border-border bg-background/50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Next Draw
          </div>
          <p className="text-lg font-semibold">
            {daysUntil === 0 ? "Today!" : `${daysUntil} day${daysUntil > 1 ? "s" : ""}`}
          </p>
          <p className="text-xs text-muted-foreground">
            Sunday at 8:00 PM
          </p>
        </div>

        {entriesMultiplier > 1 ? (
          <div className="text-center rounded-lg bg-primary/10 border border-primary/20 p-3">
            <div className="flex items-center justify-center gap-1 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              {entriesMultiplier}x entries per round with {plan?.name} plan!
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Every score you log = 1 entry into the weekly draw
            </p>
            <Link href="/pricing" className="text-xs text-primary hover:underline">
              Upgrade for more entries per round
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
