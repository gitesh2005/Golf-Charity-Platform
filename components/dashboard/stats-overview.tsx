"use client";

import { motion } from "framer-motion";
import { Target, Trophy, TrendingDown, Calendar } from "lucide-react";

interface Score {
  id: string;
  score: number;
  played_at: string;
}

interface StatsOverviewProps {
  scores: Score[];
}

export function StatsOverview({ scores }: StatsOverviewProps) {
  const totalRounds = scores.length;
  const averageScore =
    totalRounds > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / totalRounds)
      : 0;
  const bestScore = totalRounds > 0 ? Math.min(...scores.map((s) => s.score)) : 0;

  // Calculate draws entered (1 ticket per score)
  const drawTickets = totalRounds;

  const stats = [
    {
      icon: Target,
      label: "Total Rounds",
      value: totalRounds.toString(),
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      icon: TrendingDown,
      label: "Average Score",
      value: averageScore.toString(),
      color: "text-chart-3",
      bgColor: "bg-chart-3/20",
    },
    {
      icon: Trophy,
      label: "Best Score",
      value: bestScore > 0 ? bestScore.toString() : "-",
      color: "text-chart-4",
      bgColor: "bg-chart-4/20",
    },
    {
      icon: Calendar,
      label: "Draw Entries",
      value: drawTickets.toString(),
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
