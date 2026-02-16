// src/components/NavLink.tsx
import { forwardRef, useMemo } from "react"
import {
  NavLink as RouterNavLink,
  type NavLinkProps,
  useLocation,
  type To,
  type NavLinkRenderProps,
} from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  SUPPORTED_PREFIXES,
  getLangFromPath,
  buildPathWithLocale,
} from "@/utils/langRouting"

type Locale = "en" | "fr" | "lb"
type ToObject = Exclude<To, string>

type NavLinkCompatProps = Omit<NavLinkProps, "className" | "to"> & {
  to: To
  className?: string
  activeClassName?: string
  pendingClassName?: string
  preserveLang?: boolean
}

function isExternalString(href: string) {
  return /^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href)
}

function hasLocalePrefix(pathname: string) {
  const seg = (pathname || "/").split("/").filter(Boolean)[0]?.toLowerCase()
  return !!seg && SUPPORTED_PREFIXES.includes(seg as (typeof SUPPORTED_PREFIXES)[number])
}

function splitStringToParts(to: string) {
  let pathname = to || "/"
  let search = ""
  let hash = ""

  const hashIndex = pathname.indexOf("#")
  if (hashIndex !== -1) {
    hash = pathname.slice(hashIndex)
    pathname = pathname.slice(0, hashIndex)
  }

  const queryIndex = pathname.indexOf("?")
  if (queryIndex !== -1) {
    search = pathname.slice(queryIndex)
    pathname = pathname.slice(0, queryIndex)
  }

  return { pathname: pathname || "/", search, hash }
}

function normalizePathname(pathname: string) {
  if (!pathname) return "/"
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}

function coerceToObject(to: To): ToObject {
  if (typeof to === "string") return { pathname: to }
  return (to ?? { pathname: "/" }) as ToObject
}

function currentLocaleFromPath(pathname: string): Locale {
  return getLangFromPath(pathname) as Locale
}

function isRenderFnChild(
  child: NavLinkProps["children"]
): child is (props: NavLinkRenderProps) => React.ReactNode {
  return typeof child === "function"
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      preserveLang = true,
      ...props
    },
    ref
  ) => {
    const location = useLocation()
    const locale = useMemo(() => currentLocaleFromPath(location.pathname), [location.pathname])

    const isExternal = useMemo(() => {
      return typeof to === "string" && isExternalString(to)
    }, [to])

    const finalTo = useMemo<To>(() => {
      if (isExternal) return to
      if (!preserveLang) return to

      if (typeof to === "string") {
        const parts = splitStringToParts(to)
        const rawPath = normalizePathname(parts.pathname)

        const localizedPath = hasLocalePrefix(rawPath)
          ? rawPath
          : buildPathWithLocale(locale, rawPath)

        return `${localizedPath}${parts.search || ""}${parts.hash || ""}`
      }

      const toObj = coerceToObject(to)
      const rawPath = normalizePathname(toObj.pathname || "/")

      const localizedPath = hasLocalePrefix(rawPath)
        ? rawPath
        : buildPathWithLocale(locale, rawPath)

      return { ...toObj, pathname: localizedPath }
    }, [to, preserveLang, locale, isExternal])

    if (isExternal) {
      const href = finalTo as string

      const { children, style, ...rest } = props

      // <a> cannot accept function-children or function-style
      const safeChildren = isRenderFnChild(children) ? undefined : children
      const safeStyle = typeof style === "function" ? undefined : style

      return (
        <a
          ref={ref}
          href={href}
          className={cn(className)}
          style={safeStyle}
          {...rest}
        >
          {safeChildren}
        </a>
      )
    }

    return (
      <RouterNavLink
        ref={ref}
        to={finalTo}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    )
  }
)

NavLink.displayName = "NavLink"

export { NavLink }
