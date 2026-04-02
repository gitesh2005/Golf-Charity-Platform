"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, CheckCircle } from "lucide-react";

interface Score {
  id: string;
  user_id: string;
  score: number;
  course_name: string;
  played_at: string;
  created_at: string;
}

interface ScoreEntryProps {
  userId: string;
  onScoreAdded: (score: Score) => void;
}

export function ScoreEntry({ userId, onScoreAdded }: ScoreEntryProps) {
  const [score, setScore] = useState("");
  const [courseName, setCourseName] = useState("");
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("scores")
        .insert({
          user_id: userId,
          score: parseInt(score),
          course_name: courseName,
          played_at: playedAt,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      onScoreAdded(data);
      setScore("");
      setCourseName("");
      setPlayedAt(new Date().toISOString().split("T")[0]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to add score");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Log New Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                placeholder="72"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min={18}
                max={200}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course Name</Label>
              <Input
                id="course"
                type="text"
                placeholder="Pebble Beach"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Played</Label>
              <Input
                id="date"
                type="date"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              Score added! You earned 1 draw entry.
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Score
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
