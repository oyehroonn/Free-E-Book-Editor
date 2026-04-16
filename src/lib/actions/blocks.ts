"use server"

import { revalidatePath } from "next/cache"
import { blocksDb, pagesDb } from "@/lib/db"
import { generateId } from "@/lib/utils"
import type { Block, BlockType, BlockData, ActionResult } from "@/types"

function getDefaultData(type: BlockType): BlockData {
  switch (type) {
    case "TEXT":
      return { type: "TEXT", content: "<p></p>" }
    case "HEADING":
      return { type: "HEADING", content: "Heading", level: 2 }
    case "IMAGE":
      return { type: "IMAGE", url: "", alt: "" }
    case "YOUTUBE":
      return { type: "YOUTUBE", videoId: "", url: "" }
    case "QUOTE":
      return { type: "QUOTE", content: "" }
    case "DIVIDER":
      return { type: "DIVIDER", style: "solid" }
  }
}

export async function addBlock(
  pageId: string,
  type: BlockType,
  afterOrder?: number
): Promise<ActionResult<Block>> {
  const page = pagesDb.findById(pageId)
  if (!page) return { success: false, error: "Page not found" }

  const existingBlocks = blocksDb.findByPageId(pageId)

  let order: number
  if (afterOrder !== undefined) {
    // Shift blocks after insertion point
    const all = blocksDb.findAll()
    for (const b of all) {
      if (b.pageId === pageId && b.order > afterOrder) {
        blocksDb.update(b.id, { order: b.order + 1 })
      }
    }
    order = afterOrder + 1
  } else {
    order = existingBlocks.length
  }

  const now = new Date().toISOString()
  const block: Block = {
    id: generateId(),
    pageId,
    type,
    order,
    data: getDefaultData(type),
    createdAt: now,
    updatedAt: now,
  }

  blocksDb.create(block)
  revalidatePath(`/edit/${page.bookId}`)
  return { success: true, data: block }
}

export async function updateBlock(
  blockId: string,
  data: BlockData
): Promise<ActionResult<Block>> {
  const block = blocksDb.findById(blockId)
  if (!block) return { success: false, error: "Block not found" }

  const updated = blocksDb.update(blockId, { data })
  if (!updated) return { success: false, error: "Failed to update block" }

  const page = pagesDb.findById(block.pageId)
  if (page) revalidatePath(`/edit/${page.bookId}`)
  return { success: true, data: updated }
}

export async function deleteBlock(blockId: string): Promise<ActionResult> {
  const block = blocksDb.findById(blockId)
  if (!block) return { success: false, error: "Block not found" }

  const pageId = block.pageId
  const deletedOrder = block.order
  blocksDb.delete(blockId)

  // Renumber remaining blocks
  const remaining = blocksDb.findByPageId(pageId)
  remaining
    .filter((b) => b.order > deletedOrder)
    .forEach((b) => {
      blocksDb.update(b.id, { order: b.order - 1 })
    })

  const page = pagesDb.findById(pageId)
  if (page) revalidatePath(`/edit/${page.bookId}`)
  return { success: true, data: undefined }
}

export async function reorderBlocks(
  pageId: string,
  orderedBlockIds: string[]
): Promise<ActionResult> {
  blocksDb.reorderBlocks(pageId, orderedBlockIds)
  const page = pagesDb.findById(pageId)
  if (page) revalidatePath(`/edit/${page.bookId}`)
  return { success: true, data: undefined }
}
