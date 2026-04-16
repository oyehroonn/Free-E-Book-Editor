"use server"

import { backendFetch } from "@/lib/backend-api"
import type { Block, BlockType, BlockData, ActionResult } from "@/types"

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed"
}

export async function addBlock(
  pageId: string,
  type: BlockType,
  afterOrder?: number
): Promise<ActionResult<Block>> {
  try {
    const data = await backendFetch<Block>("/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, type, afterOrder }),
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function updateBlock(
  blockId: string,
  data: BlockData
): Promise<ActionResult<Block>> {
  try {
    const updated = await backendFetch<Block>(`/blocks/${blockId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    })

    return { success: true, data: updated }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function deleteBlock(blockId: string): Promise<ActionResult> {
  try {
    await backendFetch<{ pageId: string }>(`/blocks/${blockId}`, {
      method: "DELETE",
    })

    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function reorderBlocks(
  pageId: string,
  orderedBlockIds: string[]
): Promise<ActionResult> {
  try {
    await backendFetch<{ pageId: string }>("/blocks/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, orderedBlockIds }),
    })

    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}
