import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

const ADMIN_EMAIL = "thepromptist005@gmail.com";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Agar user login nahi hai to login page pe bhejo
  if (!user) {
    redirect("/auth/login");
  }

  // Agar user admin hai to admin dashboard pe bhejo
  if (user.email === ADMIN_EMAIL) {
    redirect("/admin/dashboard");
  }

  // User ke scores fetch karo
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false });

  // Saari charities fetch karo
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("name");

  // User ki selected charity fetch karo
  const { data: userCharity } = await supabase
    .from("user_charity")
    .select("*, charities(*)")
    .eq("user_id", user.id)
    .single();

  // User ki subscription fetch karo
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