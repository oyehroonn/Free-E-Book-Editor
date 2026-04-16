import Link from "next/link"
import { ArrowLeft, BookKey, Code2, ExternalLink, FileJson, FileText } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { requireCurrentUser } from "@/lib/auth"
import { API_KEY_HEADER_NAME } from "@/lib/auth-constants"
import { getApiKeys, getDeveloperDocLinks, getOpenApiSchema } from "@/lib/actions/developer"
import { ApiKeyManager } from "@/components/developer/api-key-manager"

export const runtime = "edge"

export const metadata = {
  title: "Developer Tools",
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

export default async function DeveloperToolsPage() {
  const currentUser = await requireCurrentUser("/dashboard/developer")
  const [apiKeys, schema, docLinks] = await Promise.all([
    getApiKeys(),
    getOpenApiSchema(),
    getDeveloperDocLinks(),
  ])

  const routes = getRouteCatalog(schema)
  const meExample = `curl -H "${API_KEY_HEADER_NAME}: YOUR_API_KEY" \\\n  ${docLinks.baseUrl}/auth/me`
  const createBookExample = `curl -X POST ${docLinks.baseUrl}/books \\\n  -H "Content-Type: application/json" \\\n  -H "${API_KEY_HEADER_NAME}: YOUR_API_KEY" \\\n  -d '{\n    "title": "API Generated Flipbook",\n    "subtitle": "Created by an integration",\n    "description": "This draft was created with the developer API.",\n    "authorName": "${currentUser.username}",\n    "category": "Technology",\n    "tags": ["api", "automation"]\n  }'`

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border/60 bg-paper">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="gold">Developer Tools</Badge>
              <Badge variant="cream">Comprehensive API access</Badge>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-serif text-4xl font-bold text-forest">
                  API docs and developer access
                </h1>
                <p className="mt-3 max-w-3xl text-ink-muted">
                  Generate account-scoped API keys, inspect the complete live route catalog,
                  and wire external tools into your Folio account without sharing your
                  dashboard session.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
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
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-paper p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="gold">Quickstart</Badge>
              <Badge variant="cream">Base URL: {docLinks.baseUrl}</Badge>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink">
              How developer access works
            </h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-cream p-4">
                <h3 className="font-medium text-ink">1. Generate a key</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Use the API key manager below from your signed-in dashboard session. Every key
                  is tied to your account and can be revoked at any time.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-cream p-4">
                <h3 className="font-medium text-ink">2. Authenticate requests</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Send the generated key in the <code>{API_KEY_HEADER_NAME}</code> header, or
                  as a bearer token. The backend treats the request as your account.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-cream p-4">
                <h3 className="font-medium text-ink">3. Use the full account API</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Create drafts, edit pages and blocks, publish flipbooks, upload assets, and
                  query your account data through the same routes the app uses internally.
                </p>
              </div>
            </div>
          </div>

          <ApiKeyManager initialKeys={apiKeys} />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-paper p-6 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="gold">Example</Badge>
                <Code2 className="h-4 w-4 text-gold-700" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-ink">Confirm your identity</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Use your API key to fetch the current account. This is the fastest way to verify
                the key is active and mapped to the right user.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-ink p-4 text-sm text-cream">
                <code>{meExample}</code>
              </pre>
            </div>

            <div className="rounded-3xl border border-border bg-paper p-6 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="gold">Example</Badge>
                <BookKey className="h-4 w-4 text-gold-700" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-ink">Create a flipbook draft</h2>
              <p className="mt-2 text-sm text-ink-muted">
                This example creates a new draft directly in your account. From there you can
                add pages, blocks, and publish it through the remaining endpoints.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-ink p-4 text-sm text-cream">
                <code>{createBookExample}</code>
              </pre>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-paper p-6 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="gold">Live Route Index</Badge>
              <Badge variant="cream">{routes.length} operations</Badge>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink">Complete API catalog</h2>
            <p className="mt-2 text-sm text-ink-muted">
              This list is pulled from the backend OpenAPI schema, so it tracks the real live
              route surface instead of a hand-maintained summary.
            </p>

            <div className="mt-5 space-y-3">
              {routes.map((route) => (
                <div key={`${route.method}-${route.path}`} className="rounded-2xl border border-border px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={route.method === "GET" ? "cream" : "gold"}>
                          {route.method}
                        </Badge>
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
                          <Badge key={`${route.path}-${tag}`} variant="cream">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
