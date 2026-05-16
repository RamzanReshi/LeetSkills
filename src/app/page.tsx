// ============================================================
// LeetSkills MVP — Root Page
// Owner: Reshi (Foundation & Infrastructure)
// ============================================================
// Redirects to /dashboard

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
