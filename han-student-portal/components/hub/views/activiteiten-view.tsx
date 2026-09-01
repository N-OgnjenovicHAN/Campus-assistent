'use client'

import { useState } from 'react'
import { MapPin, Clock } from 'lucide-react'
import { PageHeader, Card, Badge, ExternalLinkButton, formatDutchDate } from '../ui'
import {
  events,
  eventCategoryLabels,
  externalLinks,
  type EventCategory,
} from '@/lib/hub-data'
import { cn } from '@/lib/utils'

const categoryVariant: Record<
  EventCategory,
  'primary' | 'info' | 'available' | 'occupied' | 'muted'
> = {
  workshop: 'info',
  sport: 'available',
  sociaal: 'primary',
  carrière: 'occupied',
  lezing: 'muted',
}

type Filter = 'alles' | EventCategory

export function ActiviteitenView() {
  const [filter, setFilter] = useState<Filter>('alles')

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
  const filtered =
    filter === 'alles' ? sorted : sorted.filter((e) => e.category === filter)

  const filters: Filter[] = [
    'alles',
    ...(Object.keys(eventCategoryLabels) as EventCategory[]),
  ]

  return (
    <div>
      <PageHeader
        title="Extra activiteiten"
        description="Workshops, sport, borrels en carrière-events op de HAN campus. Alle activiteiten via HAN campus events en HAN insite."
        action={
          <ExternalLinkButton href={externalLinks.events}>
            HAN campus events
          </ExternalLinkButton>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent',
            )}
          >
            {f === 'alles' ? 'Alles' : eventCategoryLabels[f]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((e) => (
          <Card key={e.id} className="flex flex-col">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Badge variant={categoryVariant[e.category]}>
                {eventCategoryLabels[e.category]}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                {formatDutchDate(e.date)}
              </span>
            </div>
            <h3 className="font-semibold leading-tight text-balance">
              {e.title}
            </h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
              {e.description}
            </p>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="size-4" />
                {e.time} uur
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4" />
                {e.location}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
