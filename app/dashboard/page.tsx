import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user's scores
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false });

  // Fetch all charities
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("name");

  // Fetch user's charity selection
  const { data: userCharity } = await supabase
    .from("user_charity")
    .select("*, charities(*)")
    .eq("user_id", user.id)
    .single();

  // Fetch user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <DashboardClient
      user={user}
      initialScores={scores || []}
      charities={charities || []}
      userCharity={userCharity}
      subscription={subscription}
    />
  );
}
