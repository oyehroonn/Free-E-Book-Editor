import Link from "next/link"
import { BarChart3, Eye, Globe2, Lock } from "lucide-react"
import type { AnalyticsOverview } from "@/types"

interface AnalyticsSummaryProps {
  analytics: AnalyticsOverview
}

function formatDate(value?: string) {
  if (!value) {
    return "Not published"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function AnalyticsSummary({ analytics }: AnalyticsSummaryProps) {
  const topBooks = analytics.books.slice(0, 5)

  return (
    <section className="rounded-2xl border border-border bg-paper shadow-card">
      <div className="border-b border-border/70 px-6 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-forest" />
          <h2 className="text-lg font-semibold text-ink">Publishing & Analytics</h2>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          View totals update from the live reader and are also available through the authenticated API.
        </p>
      </div>

      <div className="grid gap-3 border-b border-border/70 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-cream px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Total views</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{analytics.summary.totalViews}</p>
        </div>
        <div className="rounded-xl border border-border bg-cream px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Published books</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{analytics.summary.publishedBooks}</p>
        </div>
        <div className="rounded-xl border border-border bg-cream px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Draft books</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{analytics.summary.draftBooks}</p>
        </div>
        <div className="rounded-xl border border-border bg-cream px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Published views</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{analytics.summary.publishedViews}</p>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        {analytics.topBook ? (
          <div className="rounded-xl border border-border px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Top flipbook</p>
                <p className="mt-1 text-lg font-semibold text-ink">{analytics.topBook.title}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {analytics.topBook.status === "published" ? "Public" : "Draft"} · {analytics.topBook.viewCount} views
                </p>
              </div>
              <Link
                href={`/read/${analytics.topBook.slug}`}
                className="text-sm font-medium text-forest hover:text-forest-600"
              >
                Open
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-ink-muted">
            No flipbook analytics yet. Publish a book and open it through the reader to start collecting view totals.
          </div>
        )}

        {topBooks.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[minmax(0,1.5fr)_110px_110px] gap-4 border-b border-border bg-cream px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
              <span>Flipbook</span>
              <span>Status</span>
              <span>Views</span>
            </div>
            <div className="divide-y divide-border">
              {topBooks.map((book) => (
                <div key={book.id} className="grid grid-cols-[minmax(0,1.5fr)_110px_110px] gap-4 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{book.title}</p>
                    <p className="mt-1 truncate text-xs text-ink-muted">
                      Published: {formatDate(book.publishedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    {book.status === "published" ? (
                      <>
                        <Globe2 className="h-4 w-4 text-forest" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-ink-faint" />
                        <span>Draft</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-medium text-ink">
                    <Eye className="h-4 w-4 text-ink-muted" />
                    <span>{book.viewCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
