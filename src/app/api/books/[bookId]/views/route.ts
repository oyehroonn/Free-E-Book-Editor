import { NextResponse } from "next/server"
import { buildBackendUrl } from "@/lib/backend-api"

export const runtime = "edge"

interface RouteContext {
  params: Promise<{ bookId: string }>
}

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const { bookId } = await params
    const response = await fetch(buildBackendUrl(`/books/${bookId}/views`), {
      method: "POST",
      cache: "no-store",
    })

    const payload = await response.json()
    return NextResponse.json(payload, { status: response.status })
  } catch {
    return NextResponse.json(
      { error: "View tracking backend is unavailable" },
      { status: 502 }
    )
  }
}
