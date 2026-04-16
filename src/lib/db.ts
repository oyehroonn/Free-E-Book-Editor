/**
 * JSON File Database
 * Simple file-based storage — each collection is a JSON array on disk.
 * All reads/writes are synchronous to keep server action code straightforward.
 */

import fs from "fs"
import path from "path"
import type { Book, Page, Block } from "@/types"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory and files exist
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  const files: Record<string, unknown[]> = {
    "books.json": [],
    "pages.json": [],
    "blocks.json": [],
  }
  for (const [file, defaultVal] of Object.entries(files)) {
    const filePath = path.join(DATA_DIR, file)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2))
    }
  }
}

function readJson<T>(filename: string): T[] {
  ensureDataFiles()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function writeJson<T>(filename: string, data: T[]): void {
  ensureDataFiles()
  const filePath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// ─── Books ────────────────────────────────────────────────────────────────────

export const booksDb = {
  findAll(): Book[] {
    return readJson<Book>("books.json")
  },

  findById(id: string): Book | undefined {
    return this.findAll().find((b) => b.id === id)
  },

  findBySlug(slug: string): Book | undefined {
    return this.findAll().find((b) => b.slug === slug)
  },

  findPublished(): Book[] {
    return this.findAll().filter((b) => b.status === "published")
  },

  create(book: Book): Book {
    const all = this.findAll()
    all.push(book)
    writeJson("books.json", all)
    return book
  },

  update(id: string, updates: Partial<Book>): Book | undefined {
    const all = this.findAll()
    const idx = all.findIndex((b) => b.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }
    writeJson("books.json", all)
    return all[idx]
  },

  delete(id: string): boolean {
    const all = this.findAll()
    const filtered = all.filter((b) => b.id !== id)
    if (filtered.length === all.length) return false
    writeJson("books.json", filtered)
    return true
  },

  incrementViews(id: string): void {
    const all = this.findAll()
    const idx = all.findIndex((b) => b.id === id)
    if (idx !== -1) {
      all[idx].viewCount = (all[idx].viewCount || 0) + 1
      writeJson("books.json", all)
    }
  },
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export const pagesDb = {
  findAll(): Page[] {
    return readJson<Page>("pages.json")
  },

  findById(id: string): Page | undefined {
    return this.findAll().find((p) => p.id === id)
  },

  findByBookId(bookId: string): Page[] {
    return this.findAll()
      .filter((p) => p.bookId === bookId)
      .sort((a, b) => a.pageNumber - b.pageNumber)
  },

  create(page: Page): Page {
    const all = this.findAll()
    all.push(page)
    writeJson("pages.json", all)
    return page
  },

  update(id: string, updates: Partial<Page>): Page | undefined {
    const all = this.findAll()
    const idx = all.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }
    writeJson("pages.json", all)
    return all[idx]
  },

  delete(id: string): boolean {
    const all = this.findAll()
    const filtered = all.filter((p) => p.id !== id)
    if (filtered.length === all.length) return false
    writeJson("pages.json", filtered)
    return true
  },

  deleteByBookId(bookId: string): void {
    const all = this.findAll().filter((p) => p.bookId !== bookId)
    writeJson("pages.json", all)
  },

  reorderPages(bookId: string, orderedIds: string[]): void {
    const all = this.findAll()
    orderedIds.forEach((id, index) => {
      const idx = all.findIndex((p) => p.id === id && p.bookId === bookId)
      if (idx !== -1) {
        all[idx].pageNumber = index + 1
        all[idx].updatedAt = new Date().toISOString()
      }
    })
    writeJson("pages.json", all)
  },
}

// ─── Blocks ───────────────────────────────────────────────────────────────────

export const blocksDb = {
  findAll(): Block[] {
    return readJson<Block>("blocks.json")
  },

  findById(id: string): Block | undefined {
    return this.findAll().find((b) => b.id === id)
  },

  findByPageId(pageId: string): Block[] {
    return this.findAll()
      .filter((b) => b.pageId === pageId)
      .sort((a, b) => a.order - b.order)
  },

  findByBookId(bookId: string): Block[] {
    // Get all page ids for this book, then find blocks
    const pages = pagesDb.findByBookId(bookId)
    const pageIds = new Set(pages.map((p) => p.id))
    return this.findAll().filter((b) => pageIds.has(b.pageId))
  },

  create(block: Block): Block {
    const all = this.findAll()
    all.push(block)
    writeJson("blocks.json", all)
    return block
  },

  update(id: string, updates: Partial<Block>): Block | undefined {
    const all = this.findAll()
    const idx = all.findIndex((b) => b.id === id)
    if (idx === -1) return undefined
    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }
    writeJson("blocks.json", all)
    return all[idx]
  },

  delete(id: string): boolean {
    const all = this.findAll()
    const filtered = all.filter((b) => b.id !== id)
    if (filtered.length === all.length) return false
    writeJson("blocks.json", filtered)
    return true
  },

  deleteByPageId(pageId: string): void {
    const all = this.findAll().filter((b) => b.pageId !== pageId)
    writeJson("blocks.json", all)
  },

  deleteByBookId(bookId: string): void {
    const pages = pagesDb.findByBookId(bookId)
    const pageIds = new Set(pages.map((p) => p.id))
    const all = this.findAll().filter((b) => !pageIds.has(b.pageId))
    writeJson("blocks.json", all)
  },

  reorderBlocks(pageId: string, orderedIds: string[]): void {
    const all = this.findAll()
    orderedIds.forEach((id, index) => {
      const idx = all.findIndex((b) => b.id === id && b.pageId === pageId)
      if (idx !== -1) {
        all[idx].order = index
        all[idx].updatedAt = new Date().toISOString()
      }
    })
    writeJson("blocks.json", all)
  },
}
