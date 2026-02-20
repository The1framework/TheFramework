export function hasFilterParams(urlOrPathWithSearch: string) {
  const s = String(urlOrPathWithSearch || "")
  if (!s) return false

  let search = ""
  try {
    const u = new URL(s, "https://example.com")
    search = u.search || ""
  } catch {
    const i = s.indexOf("?")
    search = i >= 0 ? s.slice(i) : ""
  }

  if (!search) return false

  const params = new URLSearchParams(search)
  const filterKeys = [
    "q",
    "query",
    "search",
    "s",
    "page",
    "sort",
    "order",
    "filter",
    "filters",
    "tag",
    "category",
    "ref",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]

  for (const k of filterKeys) {
    if (params.has(k)) return true
  }

  // also treat any unknown params as filter-ish to avoid indexing thin variants
  for (const key of params.keys()) {
    if (!filterKeys.includes(key)) return true
  }

  return false
}
