import { redirect } from "next/navigation"
import { Navbar } from "@/components/marketing/navbar"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"
import { getCurrentUser } from "@/lib/auth"
import { getDictionary } from "@/lib/i18n"

export const runtime = "edge"

export const metadata = {
  title: "Create Account",
}

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
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
          title={messages.register.title}
          description={messages.register.description}
          form={<RegisterForm nextPath={nextPath} copy={messages.register.form} />}
          alternateText={messages.register.alternateText}
          alternateLabel={messages.register.alternateLabel}
          alternateHref={`/login?next=${encodeURIComponent(nextPath)}`}
          copy={messages.authShell}
        />
      </main>
    </div>
  )
}
