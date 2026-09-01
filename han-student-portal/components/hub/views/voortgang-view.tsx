'use client'

import { useState } from 'react'
import { CircleCheck, Circle, TrendingUp } from 'lucide-react'
import {
  PageHeader,
  Card,
  Badge,
  ProgressBar,
  ExternalLinkButton,
  formatDutchDate,
  daysUntil,
} from '../ui'
import {
  deadlines,
  studyProgress,
  externalLinks,
  type DeadlineStatus,
} from '@/lib/hub-data'
import { cn } from '@/lib/utils'

const statusMeta: Record<
  DeadlineStatus,
  { label: string; variant: 'muted' | 'info' | 'available' }
> = {
  open: { label: 'Open', variant: 'muted' },
  bezig: { label: 'Mee bezig', variant: 'info' },
  ingeleverd: { label: 'Ingeleverd', variant: 'available' },
}

type Filter = 'alles' | 'open' | 'bezig' | 'ingeleverd'

export function VoortgangView() {
  const [filter, setFilter] = useState<Filter>('alles')

  const sorted = [...deadlines].sort((a, b) => a.due.localeCompare(b.due))
  const filtered =
    filter === 'alles' ? sorted : sorted.filter((d) => d.status === filter)

  const ecPct = Math.round(
    (studyProgress.behaaldEC / studyProgress.totaalEC) * 100,
  )

  return (
    <div>
      <PageHeader
        title="Deadlines & voortgang"
        description="Deadlines komen uit Brightspace en OSIRIS, je studievoortgang uit OSIRIS. Open de bron voor de meest actuele status."
        action={
          <div className="flex gap-2">
            <ExternalLinkButton href={externalLinks.brightspace} variant="outline">
              Brightspace
            </ExternalLinkButton>
            <ExternalLinkButton href={externalLinks.osiris} variant="outline">
              OSIRIS
            </ExternalLinkButton>
          </div>
        }
      />

      {/* Progress summary */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Studievoortgang</h2>
              <p className="text-xs text-muted-foreground">
                {studyProgress.periode}
              </p>
            </div>
            <Badge variant="primary">
              {studyProgress.behaaldEC}/{studyProgress.totaalEC} EC
            </Badge>
          </div>
          <ProgressBar value={ecPct} tone="available" />
          <p className="mt-2 text-sm text-muted-foreground">
            Je hebt <strong className="text-foreground">{ecPct}%</strong> van je
            opleiding afgerond.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {studyProgress.vakken.map((v) => (
              <div
                key={v.naam}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  {v.behaald ? (
                    <CircleCheck className="size-4 text-available" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground" />
                  )}
                  <span className={cn(!v.behaald && 'text-muted-foreground')}>
                    {v.naam}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span>{v.ec} EC</span>
                  {v.cijfer != null && (
                    <span className="font-semibold text-foreground">
                      {v.cijfer.toFixed(1)}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-center">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="size-5" />
          </span>
          <p className="mt-3 text-3xl font-bold">
            {studyProgress.gemiddelde.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">Gemiddeld cijfer</p>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-2xl font-bold text-available">
              {studyProgress.vakken.filter((v) => v.behaald).length}
            </p>
            <p className="text-sm text-muted-foreground">Behaalde vakken</p>
          </div>
        </Card>
      </div>

      {/* Deadlines */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Deadlines</h2>
        <div className="flex flex-wrap gap-1.5">
          {(['alles', 'open', 'bezig', 'ingeleverd'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((d) => {
          const days = daysUntil(d.due)
          const meta = statusMeta[d.status]
          return (
            <Card key={d.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{d.title}</h3>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <Badge variant="outline">{d.source}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{d.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatDutchDate(d.due)}</p>
                  {d.status !== 'ingeleverd' && (
                    <p
                      className={cn(
                        'text-xs font-medium',
                        days <= 3 ? 'text-occupied' : 'text-muted-foreground',
                      )}
                    >
                      {days <= 0 ? 'Vandaag' : `nog ${days} dagen`}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Voortgang</span>
                  <span>{d.progress}%</span>
                </div>
                <ProgressBar
                  value={d.progress}
                  tone={d.status === 'ingeleverd' ? 'available' : 'primary'}
                />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
