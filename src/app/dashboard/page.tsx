import Link from "next/link"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { DashboardBookCard } from "@/components/dashboard/dashboard-book-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { requireCurrentUser } from "@/lib/auth"
import { getMyBooks } from "@/lib/actions/books"
import { getDictionary, getLocaleContext } from "@/lib/i18n"
import { getRoleLabel } from "@/lib/i18n-data"

export const runtime = "edge"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser("/dashboard")
  const [books, messages, { locale }] = await Promise.all([
    getMyBooks(),
    getDictionary(),
    getLocaleContext(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main id="main-content" className="flex-1">
        <section className="border-b border-border/60 bg-paper">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="gold">{messages.dashboard.creatorBadge}</Badge>
                <Badge variant={currentUser.role === "admin" ? "gold" : "cream"}>
                  {getRoleLabel(locale, currentUser.role)}
                </Badge>
              </div>
              <h1 className="font-serif text-4xl font-bold text-forest">
                {messages.dashboard.title}
              </h1>
              <p className="mt-3 max-w-2xl text-ink-muted">
                {messages.dashboard.description}
              </p>
            </div>

            <Button asChild size="lg">
              <Link href="/create">
                <Sparkles className="h-4 w-4" />
                {messages.dashboard.createButton}
              </Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {books.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-paper px-8 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-200">
                <BookOpen className="h-6 w-6 text-forest" />
              </div>
              <h2 className="mt-5 font-serif text-3xl font-semibold text-ink">
                {messages.dashboard.emptyTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-ink-muted">
                {messages.dashboard.emptyDescription}
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/create">
                  {messages.dashboard.emptyButton}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {books.map((book) => (
                <DashboardBookCard key={book.id} book={book} locale={locale} copy={messages.dashboard.card} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
