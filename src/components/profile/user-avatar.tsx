import { UserCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  avatarUrl?: string | null
  className?: string
  initialsClassName?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) {
    return "F"
  }
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
}

export function UserAvatar({
  name,
  avatarUrl,
  className,
  initialsClassName,
}: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn("h-10 w-10 rounded-full border border-border object-cover", className)}
      />
    )
  }

  const initials = getInitials(name)

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-cream-200 text-sm font-semibold text-forest",
        className
      )}
      aria-label={name}
    >
      {initials ? (
        <span className={initialsClassName}>{initials}</span>
      ) : (
        <UserCircle2 className="h-5 w-5" />
      )}
    </div>
  )
}
