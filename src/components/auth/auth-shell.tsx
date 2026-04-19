import Link from "next/link"
import { LifeBuoy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Dictionary } from "@/lib/i18n-data"

interface AuthShellProps {
  title: string
  description: string
  form: React.ReactNode
  alternateLabel: string
  alternateHref: string
  alternateText: string
  copy: Dictionary["authShell"]
}

export function AuthShell({
  title,
  description,
  form,
  alternateLabel,
  alternateHref,
  alternateText,
  copy,
}: AuthShellProps) {
  const [resetHelpPrefix, resetHelpSuffix] = copy.resetHelp.split("{email}")

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Badge variant="gold">{copy.mvp}</Badge>
          <Badge variant="cream">{copy.patience}</Badge>
        </div>
        <h1 className="font-serif text-4xl font-bold text-forest mb-3">{title}</h1>
        <p className="text-ink-muted">{description}</p>
      </div>

      <div className="rounded-2xl border border-border bg-paper p-8 shadow-card">
        {form}

        <div className="mt-6 rounded-xl border border-border/80 bg-cream px-4 py-3 text-sm text-ink-muted">
          <div className="flex items-start gap-2">
            <LifeBuoy className="mt-0.5 h-4 w-4 text-gold-700" />
            <p>
              {resetHelpPrefix}
              <a
                href="mailto:info@techrealm.online"
                className="font-medium text-forest underline-offset-2 hover:underline"
              >
                info@techrealm.online
              </a>
              {resetHelpSuffix}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-ink-muted">
        {alternateText}{" "}
        <Link href={alternateHref} className="font-medium text-forest hover:underline">
          {alternateLabel}
        </Link>
      </p>
    </div>
  )
}
