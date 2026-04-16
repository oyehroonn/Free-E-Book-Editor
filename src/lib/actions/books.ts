"use server"

import { revalidatePath } from "next/cache"
import { booksDb, pagesDb, blocksDb } from "@/lib/db"
import { generateId, makeUniqueSlug } from "@/lib/utils"
import type { Book, ActionResult, BookWithPages } from "@/types"
import { z } from "zod"

const CreateBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  subtitle: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  authorName: z.string().min(1, "Author name is required").max(80),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

const UpdateBookSchema = CreateBookSchema.extend({
  status: z.enum(["draft", "published"]).optional(),
})

export async function createBook(
  formData: FormData
): Promise<ActionResult<{ bookId: string; slug: string }>> {
  const raw = {
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    authorName: formData.get("authorName") as string,
    coverImage: (formData.get("coverImage") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    tags: formData.getAll("tags") as string[],
  }

  const parsed = CreateBookSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const allSlugs = booksDb.findAll().map((b) => b.slug)
  const slug = makeUniqueSlug(parsed.data.title, allSlugs)
  const now = new Date().toISOString()

  const book: Book = {
    id: generateId(),
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    description: parsed.data.description,
    slug,
    coverImage: parsed.data.coverImage,
    authorName: parsed.data.authorName,
    status: "draft",
    viewCount: 0,
    tags: parsed.data.tags?.filter(Boolean) ?? [],
    category: parsed.data.category,
    createdAt: now,
    updatedAt: now,
  }

  booksDb.create(book)
  revalidatePath("/explore")
  return { success: true, data: { bookId: book.id, slug: book.slug } }
}

export async function updateBook(
  bookId: string,
  formData: FormData
): Promise<ActionResult<Book>> {
  const existing = booksDb.findById(bookId)
  if (!existing) return { success: false, error: "Book not found" }

  const raw = {
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    authorName: formData.get("authorName") as string,
    coverImage: (formData.get("coverImage") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    tags: formData.getAll("tags") as string[],
    status: (formData.get("status") as "draft" | "published") || undefined,
  }

  const parsed = UpdateBookSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const updates: Partial<Book> = {
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    description: parsed.data.description,
    authorName: parsed.data.authorName,
    coverImage: parsed.data.coverImage,
    category: parsed.data.category,
    tags: parsed.data.tags?.filter(Boolean) ?? [],
    status: parsed.data.status,
  }

  if (parsed.data.status === "published" && !existing.publishedAt) {
    updates.publishedAt = new Date().toISOString()
  }

  const updated = booksDb.update(bookId, updates)
  if (!updated) return { success: false, error: "Failed to update book" }

  revalidatePath(`/edit/${bookId}`)
  revalidatePath(`/read/${updated.slug}`)
  revalidatePath("/explore")
  return { success: true, data: updated }
}

export async function publishBook(bookId: string): Promise<ActionResult<Book>> {
  const existing = booksDb.findById(bookId)
  if (!existing) return { success: false, error: "Book not found" }

  const updated = booksDb.update(bookId, {
    status: "published",
    publishedAt: existing.publishedAt ?? new Date().toISOString(),
  })
  if (!updated) return { success: false, error: "Failed to publish book" }

  revalidatePath(`/edit/${bookId}`)
  revalidatePath(`/read/${updated.slug}`)
  revalidatePath("/explore")
  return { success: true, data: updated }
}

export async function unpublishBook(bookId: string): Promise<ActionResult<Book>> {
  const updated = booksDb.update(bookId, { status: "draft" })
  if (!updated) return { success: false, error: "Book not found" }

  revalidatePath(`/edit/${bookId}`)
  revalidatePath("/explore")
  return { success: true, data: updated }
}

export async function deleteBook(bookId: string): Promise<ActionResult> {
  // Cascade delete pages and blocks
  blocksDb.deleteByBookId(bookId)
  pagesDb.deleteByBookId(bookId)
  const deleted = booksDb.delete(bookId)
  if (!deleted) return { success: false, error: "Book not found" }

  revalidatePath("/explore")
  revalidatePath("/")
  return { success: true, data: undefined }
}

export async function getBookWithPages(
  bookId: string
): Promise<BookWithPages | null> {
  const book = booksDb.findById(bookId)
  if (!book) return null

  const pages = pagesDb.findByBookId(bookId)
  const pagesWithBlocks = pages.map((page) => ({
    ...page,
    blocks: blocksDb.findByPageId(page.id),
  }))

  return { ...book, pages: pagesWithBlocks }
}

export async function getBookBySlug(
  slug: string
): Promise<BookWithPages | null> {
  const book = booksDb.findBySlug(slug)
  if (!book) return null

  const pages = pagesDb.findByBookId(book.id)
  const pagesWithBlocks = pages.map((page) => ({
    ...page,
    blocks: blocksDb.findByPageId(page.id),
  }))

  return { ...book, pages: pagesWithBlocks }
}

export async function incrementBookViews(bookId: string): Promise<void> {
  booksDb.incrementViews(bookId)
}

export async function getPublishedBooks(opts?: {
  search?: string
  category?: string
  sort?: "newest" | "popular"
  limit?: number
}) {
  let books = booksDb.findPublished()

  if (opts?.search) {
    const q = opts.search.toLowerCase()
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.authorName.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
    )
  }

  if (opts?.category && opts.category !== "all") {
    books = books.filter((b) => b.category === opts.category)
  }

  if (opts?.sort === "popular") {
    books = books.sort((a, b) => b.viewCount - a.viewCount)
  } else {
    books = books.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  if (opts?.limit) {
    books = books.slice(0, opts.limit)
  }

  return books
}
