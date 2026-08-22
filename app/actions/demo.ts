"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function demoLogin(role: "admin" | "technician") {
  const c = await cookies();
  c.set("ure_demo", role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect(role === "admin" ? "/admin" : "/technician");
}

export async function demoLogout() {
  const c = await cookies();
  c.delete("ure_demo");
  redirect("/");
}
