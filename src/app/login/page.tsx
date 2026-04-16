import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getDictionary } from "@/lib/i18n"

export const runtime = "edge"

export const metadata = {
  title: "Login",
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [currentUser, messages] = await Promise.all([getCurrentUser(), getDictionary()])
  const params = await searchParams
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/dashboard"

  if (currentUser) {
    redirect(nextPath)
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          <nav aria-label="Login page navigation" className="mb-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                {messages.navbar.home}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/explore">
                <Search className="h-3.5 w-3.5" />
                {messages.navbar.explore}
              </Link>
            </Button>
          </nav>
          <AuthShell
            title={messages.login.title}
            description={messages.login.description}
            form={<LoginForm nextPath={nextPath} copy={messages.login.form} />}
            alternateText={messages.login.alternateText}
            alternateLabel={messages.login.alternateLabel}
            alternateHref={`/register?next=${encodeURIComponent(nextPath)}`}
            copy={messages.authShell}
          />
        </div>
      </main>
    </div>
  )
}
