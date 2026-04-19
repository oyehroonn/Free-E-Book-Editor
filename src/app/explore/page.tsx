import { Suspense } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { BookCoverCard } from "@/components/marketing/book-cover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPublishedBooks } from "@/lib/actions/books"
import { CATEGORIES } from "@/lib/utils"
import { ExploreFilters } from "@/components/explore/explore-filters"
import { getDictionary, getLocaleContext } from "@/lib/i18n"
import { formatMessage, getCategoryLabel, type AppLocale, type Dictionary } from "@/lib/i18n-data"

export const runtime = "edge"

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
  }>
}

export const metadata = {
  title: "Explore Books",
  description: "Browse the Folio public library — beautiful digital flipbooks from writers worldwide.",
}

async function BookGrid({
  search,
  category,
  sort,
  locale,
  messages,
}: {
  search?: string
  category?: string
  sort?: string
  locale: AppLocale
  messages: Dictionary
}) {
  let books = []

  try {
    books = await getPublishedBooks({
      search,
      category,
      sort: sort === "popular" ? "popular" : "newest",
    })
  } catch {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-cream-200 flex items-center justify-center mb-4">
          <SlidersHorizontal className="h-7 w-7 text-ink-muted" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-ink mb-2">
          {messages.explore.unavailableTitle}
        </h3>
        <p className="text-ink-muted text-sm max-w-md">
          {messages.explore.unavailableDescription}
        </p>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-cream-200 flex items-center justify-center mb-4">
          <Search className="h-7 w-7 text-ink-muted" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-ink mb-2">{messages.explore.emptyTitle}</h3>
        <p className="text-ink-muted text-sm">
          {search
            ? formatMessage(messages.explore.emptySearch, { search })
            : messages.explore.emptyCategory}
        </p>
      </div>
    )
  }

  return (
    <>
      {books.map((book) => (
        <BookCoverCard key={book.id} book={book} locale={locale} copy={messages.bookCard} />
      ))}
    </>
  )
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams
  const { q, category, sort } = params
  const [messages, { locale }] = await Promise.all([getDictionary(), getLocaleContext()])
  const categoryLabels = Object.fromEntries(
    CATEGORIES.map((value) => [value, getCategoryLabel(locale, value) ?? value])
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-forest mb-3">
            {messages.explore.title}
          </h1>
          <p className="text-ink-light max-w-xl">
            {messages.explore.description}
          </p>
        </div>

        {/* Filters */}
        <ExploreFilters
          currentSearch={q}
          currentCategory={category}
          currentSort={sort}
          categories={CATEGORIES}
          categoryLabels={categoryLabels}
          copy={messages.explore.filters}
        />

        {/* Results */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 min-h-[400px]">
          <Suspense
            fallback={Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          >
            <BookGrid search={q} category={category} sort={sort} locale={locale} messages={messages} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
