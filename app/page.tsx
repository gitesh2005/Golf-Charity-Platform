"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Heart,
  Gift,
  Target,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Track Scores",
    description:
      "Log your golf scores after each round and watch your performance improve over time.",
  },
  {
    icon: Gift,
    title: "Win Rewards",
    description:
      "Every score entry earns you tickets for weekly draws with amazing prizes.",
  },
  {
    icon: Heart,
    title: "Support Charities",
    description:
      "A portion of every entry goes to your chosen charity. Play with purpose.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "View detailed analytics and see how your game evolves over the season.",
  },
];

const stats = [
  { value: "50K+", label: "Active Players" },
  { value: "$2.5M", label: "Prizes Awarded" },
  { value: "$500K", label: "To Charities" },
  { value: "1M+", label: "Rounds Logged" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PlayWin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="bg-gradient-radial pointer-events-none absolute inset-0" />
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>Weekly draws with up to $10,000 in prizes</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Play Golf.{" "}
              <span className="text-gradient">Win Big.</span>{" "}
              <span className="text-muted-foreground">Give Back.</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty sm:text-xl">
              Track your golf scores, enter weekly prize draws, and support
              charities with every round. Join thousands of golfers making
              every game count.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2 text-base">
                  Start Playing Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-base">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gradient sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need to Win
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A complete platform designed for golfers who want to track their
              progress, compete for prizes, and make a difference.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card group rounded-2xl p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Getting started takes just minutes. Here&apos;s how you can begin
              winning.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up for free and set up your player profile in under a minute.",
              },
              {
                step: "02",
                title: "Log Your Scores",
                description:
                  "Enter your golf scores after each round to earn draw entries.",
              },
              {
                step: "03",
                title: "Win & Give",
                description:
                  "Get entered into weekly draws and support your favorite charity.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-gradient mb-4 font-mono text-5xl font-bold opacity-50">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-border glass-card relative overflow-hidden rounded-3xl p-8 text-center sm:p-12"
          >
            <div className="relative z-10">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to Start Winning?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                Join thousands of golfers who are tracking their scores,
                winning prizes, and supporting great causes.
              </p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2 text-base">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">PlayWin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 PlayWin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
