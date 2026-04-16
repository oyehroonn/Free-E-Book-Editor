import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ExternalLink, FileJson, FileText, KeyRound, LineChart } from "lucide-react"
import { Footer } from "@/components/marketing/footer"
import { Navbar } from "@/components/marketing/navbar"
import { ApiKeyManager } from "@/components/developer/api-key-manager"
import { Button } from "@/components/ui/button"
import { requireCurrentUser } from "@/lib/auth"
import { API_KEY_HEADER_NAME } from "@/lib/auth-constants"
import { getApiKeys, getDeveloperDocLinks, getOpenApiSchema } from "@/lib/actions/developer"

export const runtime = "edge"

export const metadata = {
  title: "Developer Settings",
}

type OpenApiSchema = Awaited<ReturnType<typeof getOpenApiSchema>>

function getRouteCatalog(schema: OpenApiSchema) {
  const order = ["GET", "POST", "PUT", "PATCH", "DELETE"]

  return Object.entries(schema.paths ?? {})
    .flatMap(([path, operations]) =>
      Object.entries(operations).map(([method, operation]) => ({
        method: method.toUpperCase(),
        path,
        summary: operation.summary ?? "No summary provided",
        description: operation.description ?? "",
        tags: operation.tags ?? [],
      }))
    )
    .sort((left, right) => {
      if (left.path === right.path) {
        return order.indexOf(left.method) - order.indexOf(right.method)
      }
      return left.path.localeCompare(right.path)
    })
}

export default async function DeveloperSettingsPage() {
  const currentUser = await requireCurrentUser("/settings/developer")
  if (!currentUser.developerMode) {
    redirect("/settings")
  }

  const [apiKeys, schema, docLinks] = await Promise.all([
    getApiKeys(),
    getOpenApiSchema(),
    getDeveloperDocLinks(),
  ])

  const routes = getRouteCatalog(schema)
  const authorName = currentUser.displayName ?? currentUser.username
  const meExample = `curl -H "${API_KEY_HEADER_NAME}: YOUR_API_KEY" \\\n  ${docLinks.baseUrl}/auth/me`
  const createBookExample = `curl -X POST ${docLinks.baseUrl}/books \\\n  -H "Content-Type: application/json" \\\n  -H "${API_KEY_HEADER_NAME}: YOUR_API_KEY" \\\n  -d '{\n    "title": "API Generated Flipbook",\n    "subtitle": "Created by an integration",\n    "description": "This draft was created with the developer API.",\n    "authorName": "${authorName}",\n    "category": "Technology",\n    "tags": ["api", "automation"]\n  }'`
  const analyticsExample = `curl -H "${API_KEY_HEADER_NAME}: YOUR_API_KEY" \\\n  ${docLinks.baseUrl}/analytics/overview`

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-paper px-6 py-6 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-ink">Developer settings</h1>
              <p className="mt-2 max-w-3xl text-sm text-ink-muted">
                Generate account-scoped API keys, inspect the live route catalog, and use the same authenticated endpoints the app relies on for flipbooks, publishing, and analytics.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/settings">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Settings
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={docLinks.swaggerUrl} target="_blank" rel="noreferrer">
                  <FileText className="h-4 w-4" />
                  Swagger UI
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={docLinks.redocUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  ReDoc
                </a>
              </Button>
              <Button asChild>
                <a href={docLinks.openApiUrl} target="_blank" rel="noreferrer">
                  <FileJson className="h-4 w-4" />
                  OpenAPI JSON
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ApiKeyManager initialKeys={apiKeys} />

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-paper p-6 shadow-card">
              <h2 className="text-lg font-semibold text-ink">How access works</h2>
              <div className="mt-4 space-y-4 text-sm text-ink-muted">
                <div className="rounded-xl border border-border bg-cream px-4 py-4">
                  <p className="font-medium text-ink">1. Create a key from this page</p>
                  <p className="mt-1">
                    Each key is scoped to your account and can be revoked at any time without affecting your dashboard login.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-cream px-4 py-4">
                  <p className="font-medium text-ink">2. Send it with every request</p>
                  <p className="mt-1">
                    Use the <code>{API_KEY_HEADER_NAME}</code> header or a bearer token. The backend will treat the call as your signed-in account.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-cream px-4 py-4">
                  <p className="font-medium text-ink">3. Manage flipbooks and analytics</p>
                  <p className="mt-1">
                    Keys can create drafts, update pages and blocks, publish books, upload assets, and read account analytics totals.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-paper p-6 shadow-card">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-forest" />
                <h2 className="text-lg font-semibold text-ink">Quick calls</h2>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-ink">Check the authenticated account</p>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-ink px-4 py-4 text-sm text-cream">
                    <code>{meExample}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Create a new draft</p>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-ink px-4 py-4 text-sm text-cream">
                    <code>{createBookExample}</code>
                  </pre>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-forest" />
                    <p className="text-sm font-medium text-ink">Read account analytics</p>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-ink px-4 py-4 text-sm text-cream">
                    <code>{analyticsExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-paper p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Live API catalog</h2>
              <p className="mt-1 text-sm text-ink-muted">
                This list is pulled from the backend OpenAPI schema so it tracks the real deployed route surface.
              </p>
            </div>
            <p className="text-sm text-ink-muted">{routes.length} operations</p>
          </div>

          <div className="mt-5 space-y-3">
            {routes.map((route) => (
              <div key={`${route.method}-${route.path}`} className="rounded-xl border border-border px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-border bg-cream px-2 py-1 text-xs font-medium text-ink">
                        {route.method}
                      </span>
                      <code className="text-sm text-ink">{route.path}</code>
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink">{route.summary}</p>
                    {route.description && (
                      <p className="mt-1 text-sm text-ink-muted">{route.description}</p>
                    )}
                  </div>

                  {route.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {route.tags.map((tag) => (
                        <span
                          key={`${route.path}-${tag}`}
                          className="rounded-md border border-border px-2 py-1 text-xs text-ink-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
