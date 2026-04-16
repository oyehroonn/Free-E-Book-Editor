import { getCurrentUser } from "@/lib/auth"
import { NavbarClient } from "@/components/marketing/navbar-client"
import { getDictionary } from "@/lib/i18n"

export async function Navbar() {
  const [currentUser, messages] = await Promise.all([getCurrentUser(), getDictionary()])
  return <NavbarClient currentUser={currentUser} copy={messages.navbar} roleLabels={messages.roles} />
}
