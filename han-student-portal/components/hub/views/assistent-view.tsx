'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Send, Sparkles, Bot } from 'lucide-react'
import { PageHeader } from '../ui'
import { HanMark } from '../hub-shell'
import { cn } from '@/lib/utils'

const suggestions = [
  'Waar vind ik mijn rooster?',
  'Hoe meld ik me af voor een tentamen?',
  'Wat is het verschil tussen Brightspace en OSIRIS?',
  'Hoeveel EC heb ik nodig per jaar?',
  'Waar kan ik rustig studeren op de campus?',
]

export function AssistentView() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, status])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    sendMessage({ text: trimmed })
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col lg:h-[calc(100vh-6rem)]">
      <PageHeader
        title="AI-studieassistent"
        description="Stel je vraag over studeren, de HAN-systemen, de campus of studentenzaken. De assistent verwijst je naar de juiste bron voor persoonlijke gegevens."
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-7" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">
                Hoi! Waar kan ik je mee helpen?
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
                Vraag me alles over je studie aan de HAN. Bijvoorbeeld:
              </p>
              <div className="mt-4 flex max-w-lg flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} role={message.role}>
                {message.parts.map((part, i) =>
                  part.type === 'text' ? (
                    <span key={i} className="whitespace-pre-wrap">
                      {part.text}
                    </span>
                  ) : null,
                )}
              </Message>
            ))
          )}

          {status === 'submitted' && (
            <Message role="assistant">
              <span className="flex gap-1">
                <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
              </span>
            </Message>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="border-t border-border bg-card p-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                ) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              rows={1}
              placeholder="Typ je vraag..."
              className="max-h-32 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Verstuur"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              <Send className="size-5" />
            </button>
          </div>
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            AI kan fouten maken. Controleer persoonlijke gegevens altijd in myX,
            Brightspace of OSIRIS.
          </p>
        </form>
      </div>
    </div>
  )
}

function Message({
  role,
  children,
}: {
  role: string
  children: React.ReactNode
}) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          isUser ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground',
        )}
      >
        {isUser ? <span className="text-xs font-semibold">Jij</span> : <Bot className="size-4" />}
      </span>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-foreground',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function Dot({ delay = '0s' }: { delay?: string }) {
  return (
    <span
      className="inline-block size-2 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  )
}
