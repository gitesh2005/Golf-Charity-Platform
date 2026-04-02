"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { DashboardHeader } from "./dashboard-header";
import { StatsOverview } from "./stats-overview";
import { ScoreEntry } from "./score-entry";
import { ScoreHistory } from "./score-history";
import { CharitySection } from "./charity-section";
import { DrawSection } from "./draw-section";
import { SubscriptionCard } from "./subscription-card";
import { type PlanTier } from "@/lib/subscription-plans";

interface Score {
  id: string;
  user_id: string;
  score: number;
  course_name: string;
  played_at: string;
  created_at: string;
}

interface Charity {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

interface UserCharity {
  id: string;
  user_id: string;
  charity_id: string;
  charities: Charity;
}

interface Subscription {
  user_id: string;
  plan: PlanTier;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

interface DashboardClientProps {
  user: User;
  initialScores: Score[];
  charities: Charity[];
  userCharity: UserCharity | null;
  subscription: Subscription | null;
}

export function DashboardClient({
  user,
  initialScores,
  charities,
  userCharity,
  subscription,
}: DashboardClientProps) {
  const [scores, setScores] = useState<Score[]>(initialScores);
  const [selectedCharity, setSelectedCharity] = useState<UserCharity | null>(
    userCharity
  );

  const displayName =
    user.user_metadata?.display_name || user.email?.split("@")[0] || "Player";

  const handleScoreAdded = (newScore: Score) => {
    setScores((prev) => [newScore, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader displayName={displayName} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-gradient">{displayName}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your scores and enter the weekly draw
          </p>
        </div>

        <StatsOverview scores={scores} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <ScoreEntry userId={user.id} onScoreAdded={handleScoreAdded} />
            <ScoreHistory scores={scores} />
          </div>

          <div className="space-y-8">
            <SubscriptionCard subscription={subscription} />
            <DrawSection scores={scores} subscription={subscription} />
            <CharitySection
              userId={user.id}
              charities={charities}
              selectedCharity={selectedCharity}
              onCharitySelected={setSelectedCharity}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
