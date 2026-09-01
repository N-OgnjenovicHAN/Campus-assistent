'use client'

import {
  Calendar,
  ClipboardX,
  Map,
  GraduationCap,
  Bot,
  CalendarDays,
  AppWindow,
  ArrowUpRight,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import type { ViewId } from '../hub-shell'
import { Card, Badge, ProgressBar, formatDutchDate, daysUntil } from '../ui'
import {
  rooster,
  deadlines,
  events,
  buildings,
  studyProgress,
  lessonTypeLabels,
} from '@/lib/hub-data'

const tiles: {
  id: ViewId
  label: string
  desc: string
  icon: typeof Calendar
}[] = [
  { id: 'rooster', label: 'Rooster', desc: 'Je week via myX', icon: Calendar },
  { id: 'voortgang', label: 'Deadlines & voortgang', desc: 'Brightspace & OSIRIS', icon: GraduationCap },
  { id: 'plattegrond', label: 'Plattegrond', desc: 'Lokalen & vrije plekken', icon: Map },
  { id: 'absentie', label: 'Absentie melden', desc: 'Via HAN insite', icon: ClipboardX },
  { id: 'activiteiten', label: 'Activiteiten', desc: 'Campus events', icon: CalendarDays },
  { id: 'assistent', label: 'AI-assistent', desc: 'Stel je vraag', icon: Bot },
  { id: 'apps', label: 'Apps & kamers', desc: 'Snelkoppelingen', icon: AppWindow },
]

export function DashboardView({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void
}) {
  const nextLesson = rooster[0]
  const upcoming = [...deadlines]
    .filter((d) => d.status !== 'ingeleverd')
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 3)
  const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0]

  const freeRooms = buildings
    .flatMap((b) => b.floors.flatMap((f) => f.rooms))
    .filter((r) => r.type === 'studieruimte' && r.status === 'vrij').length
  const totalStudyRooms = buildings
    .flatMap((b) => b.floors.flatMap((f) => f.rooms))
    .filter((r) => r.type === 'studieruimte').length

  const ecPct = Math.round(
    (studyProgress.behaaldEC / studyProgress.totaalEC) * 100,
  )

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-medium text-primary">Welkom terug</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-balance md:text-3xl">
          Alles voor je studie op één plek
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Rooster, deadlines, plattegrond en meer — direct gekoppeld aan myX,
          Brightspace, OSIRIS en HAN insite.
        </p>
      </div>

      {/* Quick tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-semibold">
                  {t.label}
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="block text-xs text-muted-foreground">
                  {t.desc}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Snapshot grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Next lesson */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Volgende les</h2>
            <button
              onClick={() => onNavigate('rooster')}
              className="text-xs font-medium text-primary hover:underline"
            >
              Hele rooster
            </button>
          </div>
          <Badge variant="primary">{lessonTypeLabels[nextLesson.type]}</Badge>
          <p className="mt-2 text-lg font-semibold leading-tight">
            {nextLesson.course}
          </p>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="size-4" />
              {nextLesson.day} · {nextLesson.start}–{nextLesson.end}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              {nextLesson.room} · {nextLesson.building}
            </p>
          </div>
        </Card>

        {/* Deadlines */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Aankomende deadlines</h2>
            <button
              onClick={() => onNavigate('voortgang')}
              className="text-xs font-medium text-primary hover:underline"
            >
              Alles
            </button>
          </div>
          <ul className="space-y-3">
            {upcoming.map((d) => {
              const days = daysUntil(d.due)
              return (
                <li key={d.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.course}</p>
                  </div>
                  <Badge variant={days <= 3 ? 'occupied' : 'muted'}>
                    {days <= 0 ? 'vandaag' : `${days} d`}
                  </Badge>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Progress + rooms + event */}
        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Studievoortgang</h2>
              <span className="text-sm font-semibold text-primary">
                {ecPct}%
              </span>
            </div>
            <ProgressBar value={ecPct} />
            <p className="mt-2 text-xs text-muted-foreground">
              {studyProgress.behaaldEC} van {studyProgress.totaalEC} EC ·
              gemiddeld {studyProgress.gemiddelde}
            </p>
          </Card>

          <button
            onClick={() => onNavigate('plattegrond')}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40"
          >
            <div>
              <p className="text-sm font-semibold">Vrije studieruimtes</p>
              <p className="text-xs text-muted-foreground">
                {freeRooms} van {totalStudyRooms} nu beschikbaar
              </p>
            </div>
            <span className="flex items-center gap-1 text-available">
              <span className="text-xl font-bold">{freeRooms}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </span>
          </button>
        </div>
      </div>

      {/* Next event banner */}
      <button
        onClick={() => onNavigate('activiteiten')}
        className="mt-4 flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-accent/40 p-4 text-left transition-colors hover:bg-accent"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <p className="text-xs font-medium text-primary">
              Eerstvolgende activiteit · {formatDutchDate(nextEvent.date)}
            </p>
            <p className="font-semibold">{nextEvent.title}</p>
          </div>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </button>
    </div>
  )
}
