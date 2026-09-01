'use client'

import { useState } from 'react'
import {
  BookOpen,
  DoorOpen,
  Coffee,
  Building2,
  Users,
  Check,
} from 'lucide-react'
import { PageHeader, Card } from '../ui'
import {
  buildings,
  roomTypeLabels,
  type RoomType,
  type MapRoom,
} from '@/lib/hub-data'
import { cn } from '@/lib/utils'

const typeConfig: Record<
  RoomType,
  { icon: typeof BookOpen; base: string; label: string }
> = {
  klaslokaal: { icon: DoorOpen, base: 'info', label: 'Klaslokalen' },
  studieruimte: { icon: BookOpen, base: 'available', label: 'Studieruimtes' },
  kantine: { icon: Coffee, base: 'primary', label: 'Kantine' },
  administratie: { icon: Building2, base: 'muted', label: 'Administratie' },
}

const allTypes = Object.keys(typeConfig) as RoomType[]

export function PlattegrondView() {
  const [activeBuilding, setActiveBuilding] = useState(buildings[0].id)
  const [activeFloor, setActiveFloor] = useState(buildings[0].floors[0].level)
  const [visible, setVisible] = useState<Set<RoomType>>(new Set(allTypes))
  const [onlyFree, setOnlyFree] = useState(false)
  const [selected, setSelected] = useState<MapRoom | null>(null)

  const building = buildings.find((b) => b.id === activeBuilding)!
  const floor =
    building.floors.find((f) => f.level === activeFloor) ?? building.floors[0]

  function toggleType(t: RoomType) {
    const next = new Set(visible)
    if (next.has(t)) next.delete(t)
    else next.add(t)
    setVisible(next)
    setSelected(null)
  }

  function switchBuilding(id: string) {
    const b = buildings.find((x) => x.id === id)!
    setActiveBuilding(id)
    setActiveFloor(b.floors[0].level)
    setSelected(null)
  }

  const roomsToShow = floor.rooms.filter(
    (r) => visible.has(r.type) && (!onlyFree || r.status !== 'bezet'),
  )

  return (
    <div>
      <PageHeader
        title="Plattegrond"
        description="Vind klaslokalen, vrije en bezette studieruimtes, de kantine en administratie per gebouw en verdieping. Kies zelf wat je wilt zien."
      />

      {/* Building selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => switchBuilding(b.id)}
            className={cn(
              'rounded-lg border px-4 py-2 text-left text-sm transition-colors',
              activeBuilding === b.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            <span className="block font-semibold">{b.name}</span>
            <span
              className={cn(
                'block text-xs',
                activeBuilding === b.id
                  ? 'text-primary-foreground/80'
                  : 'text-muted-foreground',
              )}
            >
              {b.address}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Toon op de kaart</h2>
            <div className="space-y-1.5">
              {allTypes.map((t) => {
                const cfg = typeConfig[t]
                const Icon = cfg.icon
                const on = visible.has(t)
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors',
                      on
                        ? 'border-border bg-accent/50'
                        : 'border-transparent text-muted-foreground opacity-60 hover:opacity-100',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded border',
                        on
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground',
                      )}
                    >
                      {on && <Check className="size-3" />}
                    </span>
                    <Icon className="size-4" />
                    <span className="flex-1 text-left">{cfg.label}</span>
                  </button>
                )
              })}
            </div>

            <label className="mt-3 flex cursor-pointer items-center gap-2.5 border-t border-border pt-3 text-sm">
              <input
                type="checkbox"
                checked={onlyFree}
                onChange={(e) => setOnlyFree(e.target.checked)}
                className="size-4 accent-primary"
              />
              Alleen vrije ruimtes
            </label>
          </Card>

          <Card className="p-4">
            <h2 className="mb-2 text-sm font-semibold">Legenda</h2>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-available" /> Vrije studieruimte
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-occupied" /> Bezette studieruimte
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-info" /> Klaslokaal
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-primary" /> Kantine
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-muted-foreground" /> Administratie
              </p>
            </div>
          </Card>
        </div>

        {/* Map + floors */}
        <div className="min-w-0">
          {/* Floor tabs */}
          <div className="mb-3 flex flex-wrap gap-2">
            {building.floors.map((f) => (
              <button
                key={f.level}
                onClick={() => {
                  setActiveFloor(f.level)
                  setSelected(null)
                }}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  activeFloor === f.level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                {building.name} · {floor.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {roomsToShow.length} ruimtes
              </p>
            </div>

            {roomsToShow.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Geen ruimtes met deze filters. Pas je selectie aan.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {roomsToShow.map((room) => (
                  <RoomTile
                    key={room.id}
                    room={room}
                    selected={selected?.id === room.id}
                    onClick={() =>
                      setSelected(selected?.id === room.id ? null : room)
                    }
                  />
                ))}
              </div>
            )}

            <p className="mt-3 border-t border-border pt-3 text-center text-xs text-muted-foreground">
              Schematische weergave · niet op schaal. Tik op een ruimte voor details.
            </p>
          </Card>

          {selected && <RoomDetail room={selected} />}
        </div>
      </div>
    </div>
  )
}

function RoomTile({
  room,
  selected,
  onClick,
}: {
  room: MapRoom
  selected: boolean
  onClick: () => void
}) {
  const cfg = typeConfig[room.type]
  const Icon = cfg.icon

  const tone =
    room.type === 'studieruimte'
      ? room.status === 'bezet'
        ? 'bg-occupied/12 border-occupied/40 text-occupied'
        : 'bg-available/12 border-available/40 text-available'
      : room.type === 'klaslokaal'
        ? 'bg-info/10 border-info/30 text-info'
        : room.type === 'kantine'
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-muted border-border text-muted-foreground'

  return (
    <button
      onClick={onClick}
      style={{ gridColumn: room.w ? `span ${room.w}` : undefined }}
      className={cn(
        'flex min-h-20 flex-col justify-between rounded-lg border p-2.5 text-left transition-all',
        tone,
        selected && 'ring-2 ring-ring ring-offset-1 ring-offset-card',
      )}
    >
      <Icon className="size-4" />
      <span>
        <span className="block text-xs font-semibold leading-tight text-foreground">
          {room.name}
        </span>
        {room.type === 'studieruimte' && (
          <span className="text-[0.7rem] font-medium">
            {room.status === 'bezet' ? 'Bezet' : 'Vrij'}
          </span>
        )}
      </span>
    </button>
  )
}

function RoomDetail({ room }: { room: MapRoom }) {
  const cfg = typeConfig[room.type]
  return (
    <Card className="mt-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {roomTypeLabels[room.type]}
          </p>
          <h3 className="text-lg font-semibold">{room.name}</h3>
        </div>
        {room.type === 'studieruimte' && (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              room.status === 'bezet'
                ? 'bg-occupied/15 text-occupied'
                : 'bg-available/15 text-available',
            )}
          >
            {room.status === 'bezet' ? 'Nu bezet' : 'Nu vrij'}
          </span>
        )}
      </div>
      {room.capacity != null && (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          Capaciteit: {room.capacity} personen
        </p>
      )}
    </Card>
  )
}
