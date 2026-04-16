import { Footer } from "@/components/marketing/footer"
import { Navbar } from "@/components/marketing/navbar"
import { AnalyticsSummary } from "@/components/settings/analytics-summary"
import { AccountSettingsPanel } from "@/components/settings/account-settings-panel"
import { requireCurrentUser } from "@/lib/auth"
import { getAnalyticsOverview } from "@/lib/actions/settings"

export const runtime = "edge"

export const metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const currentUser = await requireCurrentUser("/settings")
  const analytics = await getAnalyticsOverview()

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-paper px-6 py-6 shadow-card">
          <h1 className="text-2xl font-semibold text-ink">Account settings</h1>
          <p className="mt-2 max-w-3xl text-sm text-ink-muted">
            Manage how your account appears in the app, keep developer tools out of the way unless you need them, and monitor view totals for your published flipbooks.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Signed in as <span className="font-medium text-ink">{currentUser.username}</span>.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <AccountSettingsPanel currentUser={currentUser} />
          <AnalyticsSummary analytics={analytics} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
