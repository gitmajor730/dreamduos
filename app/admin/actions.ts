"use server";

import { revalidatePath } from "next/cache";
import { canApproveService } from "@/lib/services";
import { serverClient } from "@/lib/supabase-server";

async function gate() {
  const supabase = await serverClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Sign in required");
  return supabase;
}

export async function setProviderApproval(id: string, approval: "pending" | "approved" | "rejected") {
  const supabase = await gate();
  const { error } = await supabase.from("provider_applications").update({ provider_approval: approval, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function setServiceApproval(id: string, service: string, details: Record<string, unknown>, approval: "pending" | "approved" | "rejected" | "needs_info") {
  if (approval === "approved" && !canApproveService(service, details)) {
    throw new Error("Massage cannot be approved without an active Georgia license.");
  }
  const supabase = await gate();
  const { error } = await supabase.from("provider_services").update({ approval, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
