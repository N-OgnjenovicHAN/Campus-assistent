'use client'

import { useState } from 'react'
import { Clock, MapPin, User } from 'lucide-react'
import { PageHeader, Card, Badge, ExternalLinkButton } from '../ui'
import {
  rooster,
  weekDays,
  lessonTypeLabels,
  externalLinks,
  type LessonType,
} from '@/lib/hub-data'
import { cn } from '@/lib/utils'

const typeVariant: Record<LessonType, 'primary' | 'info' | 'available' | 'occupied' | 'muted'> = {
  college: 'info',
  werkcollege: 'primary',
  practicum: 'available',
  tentamen: 'occupied',
  project: 'muted',
}

export function RoosterView() {
  const [activeDay, setActiveDay] = useState<string>(weekDays[0])

  const dayLessons = rooster
    .filter((l) => l.day === activeDay)
    .sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div>
      <PageHeader
        title="Rooster"
        description="Je persoonlijke rooster wordt beheerd in myX. Hieronder een overzicht van je week; open myX voor de actuele en volledige versie."
        action={
          <ExternalLinkButton href={externalLinks.rooster}>
            Open myX
          </ExternalLinkButton>
        }
      />

      {/* Day tabs */}
      <div
        role="tablist"
        aria-label="Dagen"
        className="mb-5 flex gap-2 overflow-x-auto pb-1"
      >
        {weekDays.map((day) => {
          const count = rooster.filter((l) => l.day === day).length
          const active = day === activeDay
          return (
            <button
              key={day}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveDay(day)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-accent',
              )}
            >
              {day}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs',
                  active ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {dayLessons.length === 0 ? (
        <Card className="text-center text-sm text-muted-foreground">
          Geen lessen op {activeDay}. Geniet van je vrije dag.
        </Card>
      ) : (
        <div className="space-y-3">
          {dayLessons.map((lesson) => (
            <Card key={lesson.id} className="flex gap-4 p-0">
              {/* Time rail */}
              <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-l-xl bg-primary/5 py-4 text-center">
                <span className="text-sm font-bold text-primary">
                  {lesson.start}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lesson.end}
                </span>
              </div>
              <div className="min-w-0 flex-1 py-4 pr-5">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{lesson.course}</h3>
                  <Badge variant={typeVariant[lesson.type]}>
                    {lessonTypeLabels[lesson.type]}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {lesson.room} · {lesson.building}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="size-4" />
                    {lesson.teacher}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {lesson.start}–{lesson.end}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
