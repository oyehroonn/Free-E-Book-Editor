"use server"

import { revalidatePath } from "next/cache"
import { pagesDb, blocksDb } from "@/lib/db"
import { generateId } from "@/lib/utils"
import type { Page, ActionResult, PageWithBlocks } from "@/types"

export async function addPage(
  bookId: string,
  afterPageNumber?: number
): Promise<ActionResult<Page>> {
  const existing = pagesDb.findByBookId(bookId)

  let pageNumber: number
  if (afterPageNumber !== undefined) {
    // Shift pages after insertion point
    const all = pagesDb.findAll()
    for (const p of all) {
      if (p.bookId === bookId && p.pageNumber > afterPageNumber) {
        pagesDb.update(p.id, { pageNumber: p.pageNumber + 1 })
      }
    }
    pageNumber = afterPageNumber + 1
  } else {
    pageNumber = existing.length + 1
  }

  const now = new Date().toISOString()
  const page: Page = {
    id: generateId(),
    bookId,
    pageNumber,
    createdAt: now,
    updatedAt: now,
  }

  pagesDb.create(page)
  revalidatePath(`/edit/${bookId}`)
  return { success: true, data: page }
}

export async function duplicatePage(
  pageId: string
): Promise<ActionResult<PageWithBlocks>> {
  const original = pagesDb.findById(pageId)
  if (!original) return { success: false, error: "Page not found" }

  // Shift pages after this one
  const allPages = pagesDb.findByBookId(original.bookId)
  for (const p of allPages) {
    if (p.pageNumber > original.pageNumber) {
      pagesDb.update(p.id, { pageNumber: p.pageNumber + 1 })
    }
  }

  const now = new Date().toISOString()
  const newPage: Page = {
    id: generateId(),
    bookId: original.bookId,
    pageNumber: original.pageNumber + 1,
    title: original.title ? `${original.title} (copy)` : undefined,
    createdAt: now,
    updatedAt: now,
  }
  pagesDb.create(newPage)

  // Duplicate blocks
  const originalBlocks = blocksDb.findByPageId(pageId)
  const newBlocks = originalBlocks.map((b) => ({
    ...b,
    id: generateId(),
    pageId: newPage.id,
    createdAt: now,
    updatedAt: now,
  }))
  for (const block of newBlocks) {
    blocksDb.create(block)
  }

  revalidatePath(`/edit/${original.bookId}`)
  return { success: true, data: { ...newPage, blocks: newBlocks } }
}

export async function deletePage(pageId: string): Promise<ActionResult> {
  const page = pagesDb.findById(pageId)
  if (!page) return { success: false, error: "Page not found" }

  const bookId = page.bookId
  const deletedPageNumber = page.pageNumber

  blocksDb.deleteByPageId(pageId)
  pagesDb.delete(pageId)

  // Renumber remaining pages
  const remaining = pagesDb.findByBookId(bookId)
  remaining
    .filter((p) => p.pageNumber > deletedPageNumber)
    .forEach((p) => {
      pagesDb.update(p.id, { pageNumber: p.pageNumber - 1 })
    })

  revalidatePath(`/edit/${bookId}`)
  return { success: true, data: undefined }
}

export async function reorderPages(
  bookId: string,
  orderedPageIds: string[]
): Promise<ActionResult> {
  pagesDb.reorderPages(bookId, orderedPageIds)
  revalidatePath(`/edit/${bookId}`)
  return { success: true, data: undefined }
}

export async function updatePageTitle(
  pageId: string,
  title: string
): Promise<ActionResult<Page>> {
  const updated = pagesDb.update(pageId, { title })
  if (!updated) return { success: false, error: "Page not found" }

  revalidatePath(`/edit/${updated.bookId}`)
  return { success: true, data: updated }
}
