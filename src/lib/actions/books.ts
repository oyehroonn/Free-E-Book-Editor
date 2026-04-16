"use server"

import { backendFetch, BackendApiError } from "@/lib/backend-api"
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed"
}

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

  try {
    const data = await backendFetch<{ bookId: string; slug: string }>("/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        tags: parsed.data.tags?.filter(Boolean) ?? [],
      }),
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function updateBook(
  bookId: string,
  formData: FormData
): Promise<ActionResult<Book>> {
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

  try {
    const data = await backendFetch<Book>(`/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        tags: parsed.data.tags?.filter(Boolean) ?? [],
      }),
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function publishBook(bookId: string): Promise<ActionResult<Book>> {
  try {
    const data = await backendFetch<Book>(`/books/${bookId}/publish`, {
      method: "POST",
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function unpublishBook(bookId: string): Promise<ActionResult<Book>> {
  try {
    const data = await backendFetch<Book>(`/books/${bookId}/unpublish`, {
      method: "POST",
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function deleteBook(bookId: string): Promise<ActionResult> {
  try {
    await backendFetch<{ deleted: boolean }>(`/books/${bookId}`, {
      method: "DELETE",
    })

    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function getBookWithPages(
  bookId: string
): Promise<BookWithPages | null> {
  try {
    return await backendFetch<BookWithPages>(`/books/${bookId}`)
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function getBookBySlug(
  slug: string
): Promise<BookWithPages | null> {
  try {
    return await backendFetch<BookWithPages>(
      `/books/by-slug/${encodeURIComponent(slug)}`
    )
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function incrementBookViews(bookId: string): Promise<void> {
  await backendFetch<{ viewCount: number }>(`/books/${bookId}/views`, {
    method: "POST",
  })
}

export async function getPublishedBooks(opts?: {
  search?: string
  category?: string
  sort?: "newest" | "popular"
  limit?: number
}) {
  const params = new URLSearchParams()

  if (opts?.search) params.set("search", opts.search)
  if (opts?.category) params.set("category", opts.category)
  if (opts?.sort) params.set("sort", opts.sort)
  if (typeof opts?.limit === "number") params.set("limit", String(opts.limit))

  const suffix = params.toString() ? `?${params.toString()}` : ""
  return backendFetch<Book[]>(`/books/published${suffix}`)
}
