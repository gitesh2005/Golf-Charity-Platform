"use client";

import { User } from "@supabase/supabase-js";

interface Score {
  id: string;
  user_id: string;
  score: number;
  course_name: string;
  played_at: string;
}

interface Charity {
  id: string;
  name: string;
  description: string | null;
}

interface Subscription {
  user_id: string;
  plan: string;
  status: string;
  current_period_end: string | null;
}

interface UserCharity {
  id: string;
  user_id: string;
  charity_id: string;
}

interface LastDraw {
  winner_user_id: string;
  winner_score?: number | null;
  winner_course_name?: string | null;
  created_at?: string | null;
}

interface Props {
  user: User;
  scores: Score[];
  charities: Charity[];
  subscriptions: Subscription[];
  userCharity: UserCharity[];
  addCharityAction: (formData: FormData) => void;
  deleteCharityAction: (formData: FormData) => void;
  runDrawAction: () => void;
  lastDraw: LastDraw | null;
}

export function AdminDashboardClient({
  user,
  scores,
  charities,
  subscriptions,
  userCharity,
  addCharityAction,
  deleteCharityAction,
  runDrawAction,
  lastDraw,
}: Props) {
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status?.toLowerCase() === "active"
  );

  const inactiveSubscriptions = subscriptions.filter(
    (s) => s.status?.toLowerCase() !== "active"
  );

  const totalUsers = new Set([
    ...scores.map((s) => s.user_id),
    ...subscriptions.map((s) => s.user_id),
    ...userCharity.map((u) => u.user_id),
  ]).size;

  const recentScores = scores.slice(0, 5);
  const recentSubscriptions = subscriptions.slice(0, 5);

  const totalPrizePool = activeSubscriptions.length * 10;
  const charityContributionTotal = activeSubscriptions.length * 5;

  const formattedDrawTime =
    lastDraw?.created_at && !Number.isNaN(new Date(lastDraw.created_at).getTime())
      ? new Date(lastDraw.created_at).toLocaleString()
      : "Just now";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Welcome, {user.email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Active Subs" value={activeSubscriptions.length} />
          <StatCard title="Charities" value={charities.length} />
          <StatCard title="Scores" value={scores.length} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Run Draw</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick a random winner from available score entries.
                </p>
              </div>
              <div className="rounded-2xl bg-yellow-500/15 px-4 py-2 text-sm font-medium text-yellow-300">
                Monthly Action
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MiniInfo label="Entries" value={scores.length} />
              <MiniInfo label="Prize Pool" value={`£${totalPrizePool}`} />
              <MiniInfo
                label="Inactive Subs"
                value={inactiveSubscriptions.length}
              />
            </div>

            <form action={runDrawAction} className="mt-6">
              <button
                type="submit"
                className="rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Run Draw
              </button>
            </form>

            {lastDraw && (
              <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-sm text-muted-foreground">Last Draw Winner</p>
                <h3 className="mt-2 text-xl font-bold text-green-400">
                  Winner User ID: {lastDraw.winner_user_id}
                </h3>

                {lastDraw.winner_score !== undefined && lastDraw.winner_score !== null && (
                  <p className="mt-2 text-sm">
                    Winning Score: <span className="font-semibold">{lastDraw.winner_score}</span>
                  </p>
                )}

                {lastDraw.winner_course_name && (
                  <p className="mt-1 text-sm">
                    Course: <span className="font-semibold">{lastDraw.winner_course_name}</span>
                  </p>
                )}

                <p className="mt-2 text-sm text-muted-foreground">
                  {formattedDrawTime}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
            <h3 className="text-2xl font-semibold">Add Charity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new charity to the platform directory.
            </p>

            <form action={addCharityAction} className="mt-6 space-y-4">
              <input
                name="name"
                placeholder="Charity Name"
                required
                className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 outline-none placeholder:text-muted-foreground"
              />

              <textarea
                name="description"
                placeholder="Description"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 outline-none placeholder:text-muted-foreground"
              />

              <button
                type="submit"
                className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Add Charity
              </button>
            </form>
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2)">
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
            <h3 className="text-2xl font-semibold">Reports & Analytics</h3>
            <div className="mt-6 space-y-4">
              <InfoRow label="Total Prize Pool" value={`£${totalPrizePool}`} />
              <InfoRow
                label="Charity Contribution Total"
                value={`£${charityContributionTotal}`}
              />
              <InfoRow
                label="Inactive Subscriptions"
                value={inactiveSubscriptions.length}
              />
              <InfoRow label="Draw Statistics" value={`${scores.length} score entries`} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
            <h3 className="text-2xl font-semibold">Charity Management</h3>

            <div className="mt-6 space-y-4">
              {charities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No charities found.</p>
              ) : (
                charities.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-background/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{c.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {c.description || "No description available"}
                        </p>
                      </div>

                      <form action={deleteCharityAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
            <h3 className="text-2xl font-semibold">Recent Scores</h3>

            <div className="mt-6 space-y-3">
              {recentScores.length === 0 ? (
                <p className="text-sm text-muted-foreground">No scores found.</p>
              ) : (
                recentScores.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-background/40 p-4"
                  >
                    <div>
                      <p className="font-semibold">{s.course_name}</p>
                      <p className="text-sm text-muted-foreground">
                        User ID: {s.user_id}
                      </p>
                    </div>
                    <div className="rounded-xl bg-green-500/15 px-4 py-2 text-lg font-bold text-green-400">
                      {s.score}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
            <h3 className="text-2xl font-semibold">Subscriptions</h3>

            <div className="mt-6 space-y-3">
              {recentSubscriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subscriptions found.</p>
              ) : (
                recentSubscriptions.map((sub, index) => (
                  <div
                    key={`${sub.user_id}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-background/40 p-4"
                  >
                    <div>
                      <p className="font-semibold">User ID: {sub.user_id}</p>
                      <p className="text-sm text-muted-foreground">
                        Plan: {sub.plan}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          sub.status?.toLowerCase() === "active"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {sub.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sub.current_period_end
                          ? new Date(sub.current_period_end).toLocaleDateString()
                          : "No renewal date"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h2 className="mt-3 text-4xl font-bold">{value}</h2>
    </div>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-background/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}