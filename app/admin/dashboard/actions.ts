"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "thepromptist005@gmail.com";

export async function addCharity(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;

  if (!name) {
    throw new Error("Charity name is required");
  }

  const { error } = await supabase.from("charities").insert({
    name,
    description,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard");
}

export async function deleteCharity(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("Charity id is required");
  }

  const { error: userCharityError } = await supabase
    .from("user_charity")
    .delete()
    .eq("charity_id", id);

  if (userCharityError) {
    throw new Error(userCharityError.message);
  }

  const { error: charityError } = await supabase
    .from("charities")
    .delete()
    .eq("id", id);

  if (charityError) {
    throw new Error(charityError.message);
  }

  revalidatePath("/admin/dashboard");
}

export async function runDraw() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const { data: scores, error: scoresError } = await supabase
    .from("scores")
    .select("*");

  if (scoresError) {
    throw new Error(scoresError.message);
  }

  if (!scores || scores.length === 0) {
    throw new Error("No participants available for draw");
  }

  const randomIndex = Math.floor(Math.random() * scores.length);
  const winner = scores[randomIndex];

  const { error: drawError } = await supabase.from("draws").insert({
    winner_user_id: winner.user_id,
    winner_score: winner.score,
    winner_course_name: winner.course_name,
  });

  if (drawError) {
    throw new Error(drawError.message);
  }

  revalidatePath("/admin/dashboard");
}