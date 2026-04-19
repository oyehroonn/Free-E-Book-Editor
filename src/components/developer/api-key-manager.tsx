"use client"

import { useState, useTransition } from "react"
import { Copy, KeyRound, ShieldX } from "lucide-react"
import { toast } from "sonner"
import { createApiKey, revokeApiKey } from "@/lib/actions/developer"
import type { ApiKey } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApiKeyManagerProps {
  initialKeys: ApiKey[]
}

function formatDate(value?: string) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export function ApiKeyManager({ initialKeys }: ApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState(initialKeys)
  const [formError, setFormError] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await createApiKey(formData)
      if (!result.success) {
        setFormError(result.error)
        toast.error(result.error)
        return
      }

      setFormError(null)
      setGeneratedKey(result.data.generatedKey)
      setApiKeys((current) => [result.data.apiKey, ...current])
      form.reset()
      toast.success("API key created")
    })
  }

  function handleRevoke(keyId: string) {
    startTransition(async () => {
      const result = await revokeApiKey(keyId)
      if (!result.success) {
        toast.error(result.error)
        return
      }

      setApiKeys((current) =>
        current.map((key) => (key.id === keyId ? result.data : key))
      )
      toast.success("API key revoked")
    })
  }

  async function copyGeneratedKey() {
    if (!generatedKey) {
      return
    }

    try {
      await navigator.clipboard.writeText(generatedKey)
      toast.success("API key copied")
    } catch {
      toast.error("Could not copy the API key")
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-border bg-paper p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="gold">API Keys</Badge>
              <Badge variant="cream">Account scoped</Badge>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Developer access keys
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Generate keys for scripts, internal tools, and external integrations. Each key
              acts as your account, so it can create, edit, publish, and manage your own
              flipbooks through the API.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/80 bg-cream p-4 sm:flex-row sm:items-end">
          <Input
            name="name"
            label="Key Name"
            placeholder="Production CMS integration"
            hint="Use a descriptive label so you know which integration owns this key."
            className="bg-paper"
            required
          />
          <Button type="submit" size="lg" loading={isPending}>
            <KeyRound className="h-4 w-4" />
            Generate API Key
          </Button>
        </form>

        {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

        <div className="mt-6 space-y-3">
          {apiKeys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-ink-muted">
              No API keys yet. Generate one to access the Folio backend programmatically.
            </div>
          ) : (
            apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex flex-col gap-4 rounded-2xl border border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink">{key.name}</p>
                    <Badge variant={key.isRevoked ? "destructive" : "published"}>
                      {key.isRevoked ? "Revoked" : "Active"}
                    </Badge>
                  </div>
                  <p className="mt-1 font-mono text-xs text-ink-muted">{key.preview}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
                    <span>Created: {formatDate(key.createdAt)}</span>
                    <span>Last used: {formatDate(key.lastUsedAt)}</span>
                    {key.revokedAt && <span>Revoked: {formatDate(key.revokedAt)}</span>}
                  </div>
                </div>

                {!key.isRevoked && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(key.id)}
                    loading={isPending}
                  >
                    <ShieldX className="h-3.5 w-3.5" />
                    Revoke
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={Boolean(generatedKey)} onOpenChange={(open) => !open && setGeneratedKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>
            <DialogDescription>
              Copy this key now. For safety, the full secret is only shown once.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-cream p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Generated key
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all text-sm text-ink">
              <code>{generatedKey}</code>
            </pre>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGeneratedKey(null)}>
              Close
            </Button>
            <Button onClick={copyGeneratedKey}>
              <Copy className="h-4 w-4" />
              Copy Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
