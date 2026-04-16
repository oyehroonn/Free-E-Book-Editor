import { redirect } from "next/navigation"

export const runtime = "edge"

export default function LegacyDeveloperPage() {
  redirect("/settings/developer")
}
