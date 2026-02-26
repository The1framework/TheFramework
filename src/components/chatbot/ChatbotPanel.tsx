import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "./useChatbot"

type Props = {
  title: string
  subtitle: string
  placeholder: string
  sendLabel: string
  disclaimer: string
  suggestionsTitle: string
  suggestions: string[]
  messages: ChatMessage[]
  onSend: (text: string) => void
  onClose: () => void
  closeLabel: string
  isThinking?: boolean
}

export default function ChatbotPanel(props: Props) {
  const [value, setValue] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const ordered = useMemo(() => props.messages.slice(), [props.messages])

  useEffect(() => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }))
  }, [ordered.length])

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  function submit() {
    const v = value.trim()
    if (!v) return
    if (props.isThinking) return
    props.onSend(v)
    setValue("")
  }

  return (
    <div
      className={cn(
        "fixed z-50 bottom-20 right-4 w-[92vw] max-w-[440px]",
        "rounded-3xl border bg-background/80 backdrop-blur-xl shadow-2xl",
        "overflow-hidden"
      )}
      role="dialog"
      aria-label={props.title}
    >
      <div className="flex items-start justify-between gap-3 p-4 border-b bg-background/60">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight">{props.title}</div>
          <div className="text-xs text-muted-foreground mt-1">{props.subtitle}</div>
        </div>

        <Button variant="ghost" size="sm" onClick={props.onClose} aria-label={props.closeLabel}>
          ×
        </Button>
      </div>

      <ScrollArea className="h-[380px]">
        <div className="p-4 space-y-3">
          {ordered.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground shadow-sm"
                  : "mr-auto bg-muted/70 text-foreground border"
              )}
            >
              {m.content}
            </div>
          ))}

          {props.isThinking ? (
            <div className="mr-auto max-w-[88%] rounded-2xl px-3 py-2 text-sm bg-muted/70 border text-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce" />
                </span>
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </span>
            </div>
          ) : null}

          <div ref={bottomRef} />

          {props.suggestions?.length ? (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs font-medium mb-2">{props.suggestionsTitle}</div>
              <div className="flex flex-wrap gap-2">
                {props.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={!!props.isThinking}
                    onClick={() => props.onSend(s)}
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border transition",
                      "hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/30",
                      props.isThinking ? "opacity-60 cursor-not-allowed" : ""
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-2 bg-background/60">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={value}
            placeholder={props.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit()
            }}
            disabled={!!props.isThinking}
          />
          <Button onClick={submit} disabled={!value.trim() || !!props.isThinking}>
            {props.isThinking ? "..." : props.sendLabel}
          </Button>
        </div>

        <div className="text-[11px] text-muted-foreground">{props.disclaimer}</div>
      </div>
    </div>
  )
}