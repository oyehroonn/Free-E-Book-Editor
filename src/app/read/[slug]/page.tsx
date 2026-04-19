import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getBookBySlug } from "@/lib/actions/books"
import { FlipbookReader } from "@/components/reader/flipbook-reader"
import { ViewTracker } from "@/components/reader/view-tracker"

export const runtime = "edge"

interface ReadPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: "Book Not Found" }

  return {
    title: book.title,
    description: book.description ?? `Read "${book.title}" by ${book.authorName} on Folio.`,
    openGraph: {
      title: book.title,
      description: book.description ?? undefined,
      images: book.coverImage ? [{ url: book.coverImage }] : [],
    },
  }
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { slug } = await params
  const book = await getBookBySlug(slug)

  if (!book) notFound()

  return (
    <>
      {book.status === "published" && <ViewTracker bookId={book.id} />}
      <FlipbookReader book={book} />
    </>
  )
}
