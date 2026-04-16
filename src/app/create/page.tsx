import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { CreateBookForm } from "@/components/create/create-book-form"
import { Button } from "@/components/ui/button"
import { requireCurrentUser } from "@/lib/auth"

export const runtime = "edge"

export const metadata = {
  title: "Create a Book",
}

export default async function CreatePage() {
  const currentUser = await requireCurrentUser("/create")
  const accountName = currentUser.displayName ?? currentUser.username

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          <nav aria-label="Create page navigation" className="mb-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
            </Button>
          </nav>
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-forest mb-2">
              Create a new book
            </h1>
            <p className="text-ink-muted">
              You are signed in as <span className="font-medium text-ink">{accountName}</span>. Fill in the basics now and edit the rest later in the ebook editor.
            </p>
          </div>
          <div className="bg-paper rounded-2xl border border-border shadow-card p-8">
            <CreateBookForm defaultAuthorName={accountName} />
          </div>
        </div>
      </main>
    </div>
  )
}
