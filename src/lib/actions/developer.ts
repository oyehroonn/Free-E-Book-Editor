"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { backendFetch, buildBackendUrl } from "@/lib/backend-api"
import { backendFetchWithSession } from "@/lib/auth"
import type { ActionResult, ApiKey, GeneratedApiKey } from "@/types"

const CreateApiKeySchema = z.object({
  name: z.string().min(1, "Key name is required").max(80, "Key name is too long"),
})

type OpenApiSchema = {
  paths?: Record<string, Record<string, {
    summary?: string
    description?: string
    tags?: string[]
  }>>
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed"
}

export async function getApiKeys(): Promise<ApiKey[]> {
  return backendFetchWithSession<ApiKey[]>("/developer/api-keys")
}

export async function createApiKey(formData: FormData): Promise<ActionResult<GeneratedApiKey>> {
  const raw = {
    name: formData.get("name") as string,
  }

  const parsed = CreateApiKeySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  try {
    const result = await backendFetchWithSession<GeneratedApiKey>("/developer/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })
    revalidatePath("/dashboard/developer")
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function revokeApiKey(keyId: string): Promise<ActionResult<ApiKey>> {
  try {
    const result = await backendFetchWithSession<ApiKey>(`/developer/api-keys/${keyId}`, {
      method: "DELETE",
    })
    revalidatePath("/dashboard/developer")
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function getOpenApiSchema(): Promise<OpenApiSchema> {
  return backendFetch<OpenApiSchema>("/openapi.json")
}

export async function getDeveloperDocLinks() {
  return {
    baseUrl: buildBackendUrl(""),
    swaggerUrl: buildBackendUrl("/docs"),
    redocUrl: buildBackendUrl("/redoc"),
    openApiUrl: buildBackendUrl("/openapi.json"),
  }
}
