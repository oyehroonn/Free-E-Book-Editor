"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { ExternalLink, KeyRound, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { UserAvatar } from "@/components/profile/user-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { setDeveloperMode, updateProfileSettings } from "@/lib/actions/settings"
import { resolvePublicAssetUrl } from "@/lib/utils"
import type { User } from "@/types"

interface AccountSettingsPanelProps {
  currentUser: User
}

export function AccountSettingsPanel({ currentUser }: AccountSettingsPanelProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(currentUser.displayName ?? currentUser.username)
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl ?? "")
  const [developerMode, setLocalDeveloperMode] = useState(currentUser.developerMode)
  const [uploading, setUploading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isSavingProfile, startProfileTransition] = useTransition()
  const [isTogglingDeveloperMode, startDeveloperModeTransition] = useTransition()

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be under 5MB")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const payload = await response.json()
      const publicUrl = resolvePublicAssetUrl(payload.url)

      if (!response.ok || !publicUrl) {
        throw new Error()
      }

      setAvatarUrl(publicUrl)
      toast.success("Profile image uploaded")
    } catch {
      toast.error("Could not upload the profile image")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    formData.set("displayName", displayName)
    formData.set("avatarUrl", avatarUrl)

    startProfileTransition(async () => {
      const result = await updateProfileSettings(formData)
      if (!result.success) {
        setProfileError(result.error)
        toast.error(result.error)
        return
      }

      setProfileError(null)
      setDisplayName(result.data.displayName ?? result.data.username)
      setAvatarUrl(result.data.avatarUrl ?? "")
      toast.success("Settings saved")
      router.refresh()
    })
  }

  function handleDeveloperModeChange(checked: boolean) {
    const previousValue = developerMode
    setLocalDeveloperMode(checked)

    startDeveloperModeTransition(async () => {
      const result = await setDeveloperMode(checked)
      if (!result.success) {
        setLocalDeveloperMode(previousValue)
        toast.error(result.error)
        return
      }

      setLocalDeveloperMode(result.data.developerMode)
      toast.success(result.data.developerMode ? "Developer mode enabled" : "Developer mode disabled")
      router.refresh()
    })
  }

  const effectiveName = displayName.trim() || currentUser.username

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-paper shadow-card">
        <div className="border-b border-border/70 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink">Profile</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Update the display name and profile image shown around your account. Your username stays fixed.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="grid gap-6 px-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-4">
            <UserAvatar
              name={effectiveName}
              avatarUrl={avatarUrl}
              className="h-20 w-20 text-xl"
            />
            <div className="space-y-2">
              <label className="block cursor-pointer">
                <span className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream-200">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload profile image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading}
                  onChange={handleAvatarUpload}
                />
              </label>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start px-0 text-ink-muted"
                  onClick={() => setAvatarUrl("")}
                >
                  <X className="h-3.5 w-3.5" />
                  Remove image
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Input
              name="displayName"
              label="Display Name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              hint="This is the name shown in the app. It can be different from your username."
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Username"
                value={currentUser.username}
                readOnly
                disabled
                hint="Usernames cannot be changed in this MVP."
              />
              <Input
                label="Email"
                value={currentUser.email}
                readOnly
                disabled
                hint="Email stays as your login address for now."
              />
            </div>

            <div className="rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink-muted">
              Account role: <span className="font-medium text-ink">{currentUser.role}</span>
            </div>

            {profileError && <p className="text-sm text-red-500">{profileError}</p>}

            <Button type="submit" loading={isSavingProfile}>
              Save profile
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-paper shadow-card">
        <div className="border-b border-border/70 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink">Developer Access</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Keep API tools tucked away unless you actively need them. Turn developer mode on to manage keys and open the full API reference.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-cream px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium text-ink">Show developer tools</p>
              <p className="text-sm text-ink-muted">
                When enabled, you can manage API keys and open the deeper developer docs page.
              </p>
            </div>
            <Switch
              checked={developerMode}
              onCheckedChange={handleDeveloperModeChange}
              disabled={isTogglingDeveloperMode}
              aria-label="Toggle developer mode"
            />
          </div>

          {developerMode ? (
            <div className="flex flex-col gap-3 rounded-xl border border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink">Developer page is available</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Open the API page for key management, route docs, analytics examples, and integration snippets.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/settings/developer">
                  <KeyRound className="h-4 w-4" />
                  Open API Settings
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              Developer mode is currently hidden. Most readers and creators will never need this.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
