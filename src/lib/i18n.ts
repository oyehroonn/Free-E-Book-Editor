import "server-only"

import { headers } from "next/headers"
import { cache } from "react"
import {
  getDictionary as getDictionaryForLocale,
  type AppLocale,
} from "@/lib/i18n-data"

const DEFAULT_LOCALE: AppLocale = "en"

const COUNTRY_TO_LOCALE: Partial<Record<string, AppLocale>> = {
  AR: "es",
  AT: "de",
  BO: "es",
  BR: "pt",
  CL: "es",
  CO: "es",
  CR: "es",
  DE: "de",
  DO: "es",
  EC: "es",
  ES: "es",
  FR: "fr",
  GT: "es",
  HN: "es",
  MX: "es",
  NI: "es",
  PA: "es",
  PE: "es",
  PT: "pt",
  PY: "es",
  SV: "es",
  UY: "es",
  VE: "es",
}

const MULTI_LANGUAGE_COUNTRIES = new Set(["BE", "CA", "CH", "LU"])

type DetectionSource = "country" | "accept-language" | "default"

export type LocaleContext = {
  countryCode: string | null
  locale: AppLocale
  source: DetectionSource
}

function getCountryCode(headerList: Headers): string | null {
  const candidates = [
    headerList.get("cf-ipcountry"),
    headerList.get("x-vercel-ip-country"),
    headerList.get("x-country-code"),
    headerList.get("cloudfront-viewer-country"),
  ]

  for (const value of candidates) {
    if (!value) continue
    const normalized = value.trim().toUpperCase()
    if (normalized && normalized !== "XX" && normalized !== "T1") {
      return normalized
    }
  }

  return null
}

function parseAcceptLanguage(headerValue: string | null): AppLocale | null {
  if (!headerValue) return null

  const values = headerValue
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean) as string[]

  for (const value of values) {
    if (value.startsWith("es")) return "es"
    if (value.startsWith("fr")) return "fr"
    if (value.startsWith("de")) return "de"
    if (value.startsWith("pt")) return "pt"
    if (value.startsWith("en")) return "en"
  }

  return null
}

export const getLocaleContext = cache(async (): Promise<LocaleContext> => {
  const headerList = await headers()
  const countryCode = getCountryCode(headerList)
  const acceptLanguageLocale = parseAcceptLanguage(headerList.get("accept-language"))

  if (countryCode && MULTI_LANGUAGE_COUNTRIES.has(countryCode) && acceptLanguageLocale) {
    return {
      locale: acceptLanguageLocale,
      countryCode,
      source: "accept-language",
    }
  }

  if (countryCode) {
    const locale = COUNTRY_TO_LOCALE[countryCode]
    if (locale) {
      return {
        locale,
        countryCode,
        source: "country",
      }
    }
  }

  if (acceptLanguageLocale) {
    return {
      locale: acceptLanguageLocale,
      countryCode,
      source: "accept-language",
    }
  }

  return {
    locale: DEFAULT_LOCALE,
    countryCode,
    source: "default",
  }
})

export const getDictionary = cache(async () => {
  const { locale } = await getLocaleContext()
  return getDictionaryForLocale(locale)
})
