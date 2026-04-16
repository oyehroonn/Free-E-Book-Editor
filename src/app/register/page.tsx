import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export const runtime = "edge"

export const metadata = {
  title: "Create Account",
}

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const currentUser = await getCurrentUser()
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
          <nav aria-label="Registration page navigation" className="mb-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back Home
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/explore">
                <Search className="h-3.5 w-3.5" />
                Explore Library
              </Link>
            </Button>
          </nav>
          <AuthShell
            title="Create your account"
            description="Use a basic MVP account to save your flipbooks, return to the editor later, and control when each book becomes public."
            form={<RegisterForm nextPath={nextPath} />}
            alternateText="Already have an account?"
            alternateLabel="Sign in"
            alternateHref={`/login?next=${encodeURIComponent(nextPath)}`}
          />
        </div>
      </main>
    </div>
  )
}
