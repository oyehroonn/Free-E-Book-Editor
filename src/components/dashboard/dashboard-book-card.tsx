import Link from "next/link"
import { ExternalLink, FilePenLine, Globe, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShareBookButton } from "@/components/books/share-book-button"
import { getCategoryLabel, getIntlLocale, type AppLocale, type Dictionary } from "@/lib/i18n-data"
import type { Book } from "@/types"

interface DashboardBookCardProps {
  book: Book
  locale: AppLocale
  copy: Dictionary["dashboard"]["card"]
}

function formatDate(locale: AppLocale, value: string) {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function DashboardBookCard({ book, locale, copy }: DashboardBookCardProps) {
  const isPublished = book.status === "published"
  const categoryLabel = getCategoryLabel(locale, book.category)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-paper shadow-card">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start">
        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-cream-200">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-ink-faint">
              {copy.noCover}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant={isPublished ? "published" : "draft"}>
              {isPublished ? (
                <>
                  <Globe className="h-3 w-3" />
                  {copy.public}
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  {copy.draft}
                </>
              )}
            </Badge>
            {categoryLabel && <Badge variant="cream">{categoryLabel}</Badge>}
          </div>

          <h2 className="font-serif text-2xl font-semibold text-ink">{book.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {book.description || copy.noDescription}
          </p>

          <div className="mt-4 grid gap-1 text-xs text-ink-faint sm:grid-cols-2">
            <p>{copy.author}: {book.authorName}</p>
            <p>{copy.updated}: {formatDate(locale, book.updatedAt)}</p>
            <p>{copy.slug}: /read/{book.slug}</p>
            <p>{copy.views}: {new Intl.NumberFormat(getIntlLocale(locale)).format(book.viewCount)}</p>
            <p>
              {isPublished
                ? copy.visiblePublic
                : copy.visiblePrivate}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href={`/edit/${book.id}`}>
                <FilePenLine className="h-3.5 w-3.5" />
                {copy.editButton}
              </Link>
            </Button>

            {isPublished ? (
              <>
                <ShareBookButton slug={book.slug} />
                <Button asChild variant="outline" size="sm">
                  <Link href={`/read/${book.slug}`} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {copy.openPublicPage}
                  </Link>
                </Button>
              </>
            ) : (
              <p className="self-center text-sm text-ink-muted">
                {copy.publishHint}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
