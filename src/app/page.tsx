import Link from "next/link"
import { ArrowRight, BookOpen, Image as ImageIcon, Youtube, Type, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { BookCoverCard } from "@/components/marketing/book-cover-card"
import { getPublishedBooks } from "@/lib/actions/books"
import { getDictionary, getLocaleContext } from "@/lib/i18n"
import type { Book } from "@/types"

export const runtime = "edge"

export default async function LandingPage() {
  let featuredBooks: Book[] = []
  const [messages, { locale }] = await Promise.all([getDictionary(), getLocaleContext()])

  try {
    featuredBooks = await getPublishedBooks({ sort: "newest", limit: 8 })
  } catch {
    featuredBooks = []
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-cream pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/6 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-forest/6 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Pill tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/8 px-4 py-1.5 text-xs font-medium text-gold-700 mb-8">
            <Star className="h-3 w-3 fill-current" />
            {messages.landing.heroBadge}
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-forest leading-tight tracking-tight text-balance mb-6">
            {messages.landing.heroTitle}
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-ink-light leading-relaxed mb-10">
            {messages.landing.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" className="shadow-md hover:shadow-lg">
              <Link href="/create">
                {messages.landing.createButton}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/explore">
                <BookOpen className="h-5 w-5" />
                {messages.landing.browseButton}
              </Link>
            </Button>
          </div>

          {/* Floating book mockup */}
          <div className="mt-16 mx-auto max-w-3xl">
            <div className="relative rounded-2xl overflow-hidden shadow-book bg-forest p-1">
              <div className="rounded-xl overflow-hidden bg-paper flex">
                {/* Left page */}
                <div className="w-1/2 min-h-[280px] bg-paper p-8 border-r border-border/40 relative">
                  <div className="book-spine-shadow absolute inset-0 pointer-events-none" />
                  <div className="h-3 w-16 bg-gold/30 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 bg-ink/10 rounded w-full" />
                    <div className="h-2 bg-ink/10 rounded w-5/6" />
                    <div className="h-2 bg-ink/10 rounded w-full" />
                    <div className="h-2 bg-ink/10 rounded w-4/5" />
                  </div>
                  <div className="mt-5 h-20 bg-cream-200 rounded-lg" />
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-ink/10 rounded w-full" />
                    <div className="h-2 bg-ink/10 rounded w-3/4" />
                  </div>
                  <p className="absolute bottom-4 left-8 text-xs text-ink-faint font-serif">1</p>
                </div>

                {/* Right page */}
                <div className="w-1/2 min-h-[280px] bg-paper-texture p-8 relative">
                  <div className="h-5 w-28 bg-forest/15 rounded mb-5 font-serif" />
                  <div className="space-y-2">
                    <div className="h-2 bg-ink/10 rounded w-full" />
                    <div className="h-2 bg-ink/10 rounded w-full" />
                    <div className="h-2 bg-ink/10 rounded w-2/3" />
                  </div>
                  <div className="mt-5 p-3 border-l-4 border-gold/60 bg-gold/5 rounded-r-lg">
                    <div className="h-2 bg-gold/30 rounded w-full" />
                    <div className="h-2 bg-gold/30 rounded w-4/5 mt-1.5" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-ink/10 rounded w-full" />
                    <div className="h-2 bg-ink/10 rounded w-5/6" />
                    <div className="h-2 bg-ink/10 rounded w-full" />
                  </div>
                  <p className="absolute bottom-4 right-8 text-xs text-ink-faint font-serif">2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-forest mb-4">
              {messages.landing.featuresTitle}
            </h2>
            <p className="text-ink-light max-w-xl mx-auto">
              {messages.landing.featuresDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Type,
                color: "bg-forest/10 text-forest",
              },
              {
                icon: ImageIcon,
                color: "bg-gold/15 text-gold-700",
              },
              {
                icon: Youtube,
                color: "bg-rose-100 text-rose-700",
              },
              {
                icon: BookOpen,
                color: "bg-indigo-100 text-indigo-700",
              },
              {
                icon: Zap,
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                icon: Star,
                color: "bg-amber-100 text-amber-700",
              },
            ].map((feature, index) => (
              <div
                key={messages.landing.features[index]?.title}
                className="group p-6 rounded-xl border border-border bg-cream hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-semibold text-ink mb-2">{messages.landing.features[index]?.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{messages.landing.features[index]?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Books ─────────────────────────────────────────────────────── */}
      {featuredBooks.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-serif text-4xl font-bold text-forest mb-3">
                  {messages.landing.recentTitle}
                </h2>
                <p className="text-ink-light">
                  {messages.landing.recentDescription}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/explore">
                  {messages.landing.viewAll}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 lg:gap-6">
              {featuredBooks.map((book) => (
                <BookCoverCard key={book.id} book={book} locale={locale} copy={messages.bookCard} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ────────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-forest text-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-balance">
            {messages.landing.ctaTitle}
          </h2>
          <p className="text-cream-300 text-lg mb-10 max-w-xl mx-auto">
            {messages.landing.ctaDescription}
          </p>
          <Button asChild size="xl" variant="gold" className="shadow-lg">
            <Link href="/register">
              {messages.landing.ctaButton}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
