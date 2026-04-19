"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { backendFetchWithSession } from "@/lib/auth"
import type { ActionResult, AnalyticsOverview, User } from "@/types"

const UpdateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(80, "Display name is too long"),
  avatarUrl: z.string().optional(),
})

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed"
}

function revalidateSettingsSurfaces() {
  revalidatePath("/settings")
  revalidatePath("/settings/developer")
  revalidatePath("/dashboard")
  revalidatePath("/create")
}

export async function updateProfileSettings(formData: FormData): Promise<ActionResult<User>> {
  const raw = {
    displayName: formData.get("displayName") as string,
    avatarUrl: (formData.get("avatarUrl") as string) || undefined,
  }

  const parsed = UpdateProfileSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  try {
    const result = await backendFetchWithSession<User>("/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })
    revalidateSettingsSurfaces()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function setDeveloperMode(enabled: boolean): Promise<ActionResult<User>> {
  try {
    const result = await backendFetchWithSession<User>("/settings/developer-mode", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
    revalidateSettingsSurfaces()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return backendFetchWithSession<AnalyticsOverview>("/analytics/overview")
}
