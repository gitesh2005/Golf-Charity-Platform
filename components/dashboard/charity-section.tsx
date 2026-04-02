"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Loader2, CheckCircle } from "lucide-react";

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

interface CharitySectionProps {
  userId: string;
  charities: Charity[];
  selectedCharity: UserCharity | null;
  onCharitySelected: (charity: UserCharity | null) => void;
}

export function CharitySection({
  userId,
  charities,
  selectedCharity,
  onCharitySelected,
}: CharitySectionProps) {
  const [selectedId, setSelectedId] = useState(
    selectedCharity?.charity_id || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSave() {
    if (!selectedId) return;

    setError(null);
    setLoading(true);

    try {
      // Upsert the user_charity record
      const { data, error: upsertError } = await supabase
        .from("user_charity")
        .upsert(
          {
            user_id: userId,
            charity_id: selectedId,
          },
          {
            onConflict: "user_id",
          }
        )
        .select("*, charities(*)")
        .single();

      if (upsertError) {
        setError(upsertError.message);
        return;
      }

      onCharitySelected(data);
    } catch {
      setError("Failed to save charity selection");
    } finally {
      setLoading(false);
    }
  }

  const currentCharity = charities.find((c) => c.id === selectedId);
  const hasChanges = selectedId !== (selectedCharity?.charity_id || "");

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-destructive" />
          Your Charity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Choose a charity to support. A portion of every draw goes to your
          selected cause.
        </p>

        {selectedCharity && (
          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Currently Supporting</p>
                <p className="font-semibold">{selectedCharity.charities.name}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a charity" />
            </SelectTrigger>
            <SelectContent>
              {charities.map((charity) => (
                <SelectItem key={charity.id} value={charity.id}>
                  {charity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentCharity?.description && (
            <p className="text-xs text-muted-foreground">
              {currentCharity.description}
            </p>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={loading || !selectedId}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Save Selection
                </>
              )}
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-dashed border-border p-4 text-center">
          <p className="text-2xl font-bold text-gradient">$50K+</p>
          <p className="text-xs text-muted-foreground">
            Donated to charities this year
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
