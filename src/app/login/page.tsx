import { redirect } from "next/navigation"
import { Navbar } from "@/components/marketing/navbar"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
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
      <main className="flex-1 flex items-start justify-center px-4 py-16">
        <AuthShell
          title={messages.login.title}
          description={messages.login.description}
          form={<LoginForm nextPath={nextPath} copy={messages.login.form} />}
          alternateText={messages.login.alternateText}
          alternateLabel={messages.login.alternateLabel}
          alternateHref={`/register?next=${encodeURIComponent(nextPath)}`}
          copy={messages.authShell}
        />
      </main>
    </div>
  )
}
