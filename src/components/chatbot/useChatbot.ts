import { useMemo, useState } from "react"

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  ts: number
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

type ApiMessage = { role: ChatRole; content: string }

async function fetchAIReply(args: { locale: string; messages: ApiMessage[] }): Promise<string> {
  const base = (import.meta.env.VITE_CHAT_API_URL || "").toString().replace(/\/+$/, "")
  if (!base) return ""

  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || `Chat request failed (${res.status})`)
  }

  const data = (await res.json()) as { reply?: string }
  return (data.reply || "").toString()
}

function resolveLocale(): string {
  const p = (window.location.pathname || "").toLowerCase()
  if (p.startsWith("/fr")) return "fr"
  if (p.startsWith("/lb")) return "lb"
  return "en"
}

export function useChatbot(getFallbackReply: (userText: string) => string) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: uid(), role: "assistant", content: getFallbackReply(""), ts: Date.now() },
  ])
  const [isThinking, setIsThinking] = useState(false)

  const actions = useMemo(() => {
    return {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      reset: () =>
        setMessages([{ id: uid(), role: "assistant", content: getFallbackReply(""), ts: Date.now() }]),
      send: async (textRaw: string) => {
        const text = textRaw.trim()
        if (!text) return
        if (isThinking) return

        const locale = resolveLocale()

        const userMsg: ChatMessage = { id: uid(), role: "user", content: text, ts: Date.now() }
        setMessages((prev) => [...prev, userMsg])
        setIsThinking(true)

        const history: ApiMessage[] = [...messages, userMsg]
          .slice(-14)
          .map((m) => ({ role: m.role, content: m.content }))

        try {
          const reply = await fetchAIReply({ locale, messages: history })
          const botText = reply.trim() ? reply : getFallbackReply(text)

          const botMsg: ChatMessage = {
            id: uid(),
            role: "assistant",
            content: botText,
            ts: Date.now(),
          }

          setMessages((prev) => [...prev, botMsg])
        } catch {
          const botMsg: ChatMessage = {
            id: uid(),
            role: "assistant",
            content: getFallbackReply(text),
            ts: Date.now(),
          }
          setMessages((prev) => [...prev, botMsg])
        } finally {
          setIsThinking(false)
        }
      },
    }
  }, [getFallbackReply, isThinking, messages])

  return { isOpen, messages, isThinking, actions }
}