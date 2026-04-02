import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { addCharity, deleteCharity, runDraw } from "./actions";

const ADMIN_EMAIL = "thepromptist005@gmail.com";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .order("played_at", { ascending: false });

  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .order("name");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*");

  const { data: userCharity } = await supabase
    .from("user_charity")
    .select("*");

  const { data: lastDraw } = await supabase
    .from("draws")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <AdminDashboardClient
      user={user}
      scores={scores || []}
      charities={charities || []}
      subscriptions={subscriptions || []}
      userCharity={userCharity || []}
      addCharityAction={addCharity}
      deleteCharityAction={deleteCharity}
      runDrawAction={runDraw}
      lastDraw={lastDraw}
    />
  );
}