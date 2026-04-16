"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookOpen, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBook } from "@/lib/actions/books"
import { resolvePublicAssetUrl } from "@/lib/utils"
import { type Dictionary } from "@/lib/i18n-data"

interface CreateBookFormProps {
  defaultAuthorName?: string
  categories: { value: string; label: string }[]
  copy: Dictionary["create"]["form"]
}

export function CreateBookForm({
  defaultAuthorName = "",
  categories,
  copy,
}: CreateBookFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverPath, setCoverPath] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error(copy.coverTooLarge)
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    setUploading(false)

    const publicUrl = resolvePublicAssetUrl(data.url)

    if (publicUrl) {
      setCoverPath(publicUrl)
      setCoverPreview(publicUrl)
    } else {
      toast.error(copy.coverUploadFailed)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (coverPath) formData.set("coverImage", coverPath)

    const title = formData.get("title") as string
    const authorName = formData.get("authorName") as string
    const newErrors: Record<string, string> = {}

    if (!title?.trim()) newErrors.title = copy.titleRequired
    if (!authorName?.trim()) newErrors.authorName = copy.authorRequired

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    startTransition(async () => {
      const result = await createBook(formData)
      if (result.success) {
        toast.success(copy.createdSuccess)
        router.push(`/edit/${result.data.bookId}`)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Cover image */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">{copy.coverImage} <span className="text-ink-faint">{copy.optional}</span></p>
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-border bg-cream-200 flex items-center justify-center flex-shrink-0">
            {coverPreview ? (
              <>
                <img src={coverPreview} alt={copy.coverAlt} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setCoverPreview(null); setCoverPath("") }}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-ink/60 text-white flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <BookOpen className="h-8 w-8 text-ink-faint" />
            )}
          </div>
          <div className="flex-1">
            <label className="block cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-gold hover:bg-gold/5 transition-colors text-sm text-ink-muted">
                <Upload className="h-4 w-4" />
                {uploading ? copy.uploading : copy.uploadCover}
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverUpload}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-ink-faint mt-1.5">{copy.coverHint}</p>
          </div>
        </div>
      </div>

      <Input
        name="title"
        label={copy.titleLabel}
        placeholder={copy.titlePlaceholder}
        error={errors.title}
        required
      />

      <Input
        name="subtitle"
        label={copy.subtitleLabel}
        placeholder={copy.subtitlePlaceholder}
      />

      <Input
        name="authorName"
        label={copy.authorLabel}
        placeholder={copy.authorPlaceholder}
        defaultValue={defaultAuthorName}
        error={errors.authorName}
        required
      />

      <Textarea
        name="description"
        label={copy.descriptionLabel}
        placeholder={copy.descriptionPlaceholder}
        className="h-24 resize-none"
      />

      <div>
        <p className="text-sm font-medium text-ink mb-1.5">{copy.categoryLabel}</p>
        <Select name="category">
          <SelectTrigger>
            <SelectValue placeholder={copy.categoryPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={isPending}
      >
        {copy.submit}
      </Button>
    </form>
  )
}
