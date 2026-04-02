"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, MapPin, Calendar } from "lucide-react";

interface Score {
  id: string;
  score: number;
  course_name: string;
  played_at: string;
}

interface ScoreHistoryProps {
  scores: Score[];
}

export function ScoreHistory({ scores }: ScoreHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Score History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No scores yet. Log your first round to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scores.slice(0, 10).map((score, i) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 font-mono text-lg font-bold text-primary">
                    {score.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {score.course_name}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(score.played_at)}
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  +1 Entry
                </div>
              </motion.div>
            ))}

            {scores.length > 10 && (
              <p className="pt-2 text-center text-sm text-muted-foreground">
                Showing 10 of {scores.length} scores
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
