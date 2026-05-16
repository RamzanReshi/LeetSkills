// ============================================================
// LeetSkills MVP — Root Page
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================
// Redirects to /dashboard

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
