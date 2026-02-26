import React, { Suspense, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/useI18n"
import { tString } from "@/i18n/ts"
import type { JsonValue } from "@/i18n/ts"
import { useChatbot } from "./useChatbot"

const ChatbotPanel = React.lazy(() => import("./ChatbotPanel"))

function simpleFaqBrain(t: (k: string) => JsonValue, userText: string) {
  const q = (userText || "").toLowerCase()

  const rules: Array<{ match: (s: string) => boolean; answerKey: string }> = [
    {
      match: (s) => s.includes("price") || s.includes("cost") || s.includes("budget"),
      answerKey: "chatbot.fallback.generic",
    },
    { match: (s) => s.includes("geo") || s.includes("llm"), answerKey: "chatbot.fallback.generic" },
    { match: (s) => s.includes("service"), answerKey: "chatbot.fallback.generic" },
    {
      match: (s) => s.includes("timeline") || s.includes("delivery") || s.includes("how long"),
      answerKey: "chatbot.fallback.generic",
    },
  ]

  const found = rules.find((r) => r.match(q))
  return tString(t, found?.answerKey || "chatbot.fallback.generic")
}

export default function ChatbotWidget() {
  const { t } = useI18n()

  const ts = useCallback((key: string) => tString(t, key), [t])

  const getReply = useCallback((userText: string) => simpleFaqBrain(t, userText), [t])

  const { isOpen, messages, isThinking, actions } = useChatbot(getReply)

  useEffect(() => {
    const onOpen = () => actions.open()
    window.addEventListener("achi:open_chatbot", onOpen as EventListener)
    return () => window.removeEventListener("achi:open_chatbot", onOpen as EventListener)
  }, [actions])

  const suggestions = useMemo(
    () => [
      ts("chatbot.suggestions.q1"),
      ts("chatbot.suggestions.q2"),
      ts("chatbot.suggestions.q3"),
      ts("chatbot.suggestions.q4"),
    ],
    [ts]
  )

  return (
    <>
    <div className="fixed z-50 bottom-20 right-10 group ">
  <button
    onClick={actions.toggle}
    aria-label={isOpen ? ts("chatbot.floating.close") : ts("chatbot.floating.open")}
    className="relative h-14 w-14 rounded-full flex items-center justify-center text-white font-semibold shadow-2xl transition-all duration-300"
  >
    {/* Glow ring */}
    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90" />

    {/* Animated outer pulse */}
    <span className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-pulse" />

    {/* Hover ring */}
    <span className="absolute inset-0 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-300" />

    {/* Content */}
    <span className="relative z-10 text-sm tracking-wide">
      {isOpen ? "×" : "AI"}
    </span>
  </button>
    </div>

      {isOpen ? (
        <Suspense fallback={null}>
          <ChatbotPanel
            title={ts("chatbot.panel.title")}
            subtitle={ts("chatbot.panel.subtitle")}
            placeholder={ts("chatbot.panel.inputPlaceholder")}
            sendLabel={ts("chatbot.panel.send")}
            disclaimer={ts("chatbot.panel.disclaimer")}
            suggestionsTitle={ts("chatbot.panel.suggestionsTitle")}
            suggestions={suggestions}
            messages={messages}
            isThinking={isThinking}
            onSend={actions.send}
            onClose={actions.close}
            closeLabel={ts("chatbot.floating.close")}
          />
        </Suspense>
      ) : null}
    </>
  )
}