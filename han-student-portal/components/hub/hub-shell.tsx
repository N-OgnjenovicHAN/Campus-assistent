'use client'

import { useState } from 'react'
import {
  LayoutGrid,
  Calendar,
  ClipboardX,
  Map,
  GraduationCap,
  Bot,
  CalendarDays,
  AppWindow,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardView } from './views/dashboard-view'
import { RoosterView } from './views/rooster-view'
import { AbsentieView } from './views/absentie-view'
import { PlattegrondView } from './views/plattegrond-view'
import { VoortgangView } from './views/voortgang-view'
import { AssistentView } from './views/assistent-view'
import { ActiviteitenView } from './views/activiteiten-view'
import { AppsView } from './views/apps-view'

export type ViewId =
  | 'dashboard'
  | 'rooster'
  | 'absentie'
  | 'plattegrond'
  | 'voortgang'
  | 'assistent'
  | 'activiteiten'
  | 'apps'

interface NavItem {
  id: ViewId
  label: string
  icon: typeof LayoutGrid
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'rooster', label: 'Rooster', icon: Calendar },
  { id: 'voortgang', label: 'Deadlines & voortgang', icon: GraduationCap },
  { id: 'plattegrond', label: 'Plattegrond', icon: Map },
  { id: 'absentie', label: 'Absentie melden', icon: ClipboardX },
  { id: 'activiteiten', label: 'Extra activiteiten', icon: CalendarDays },
  { id: 'assistent', label: 'AI-assistent', icon: Bot },
  { id: 'apps', label: 'Apps & kamers', icon: AppWindow },
]

export function HubShell() {
  const [view, setView] = useState<ViewId>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  function go(next: ViewId) {
    setView(next)
    setMobileOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  const activeLabel = navItems.find((n) => n.id === view)?.label ?? ''

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <BrandHeader />
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={view === item.id}
              onClick={() => go(item.id)}
            />
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Studenten Hub · voorbeeldweergave. Ingelogde data komt uit myX,
            Brightspace &amp; OSIRIS.
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Menu sluiten"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-sidebar shadow-xl">
            <div className="flex items-center justify-between">
              <BrandHeader />
              <button
                aria-label="Menu sluiten"
                className="mr-3 rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={view === item.id}
                  onClick={() => go(item.id)}
                />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Menu openen"
            className="rounded-md p-2 text-foreground hover:bg-accent"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <HanMark className="size-7" />
            <span className="font-semibold">{activeLabel}</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-10">
          {view === 'dashboard' && <DashboardView onNavigate={go} />}
          {view === 'rooster' && <RoosterView />}
          {view === 'voortgang' && <VoortgangView />}
          {view === 'plattegrond' && <PlattegrondView />}
          {view === 'absentie' && <AbsentieView />}
          {view === 'activiteiten' && <ActiviteitenView />}
          {view === 'assistent' && <AssistentView />}
          {view === 'apps' && <AppsView />}
        </main>
      </div>
    </div>
  )
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="truncate">{item.label}</span>
    </button>
  )
}

function BrandHeader() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <HanMark className="size-9" />
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight">Studenten Hub</p>
        <p className="text-xs text-muted-foreground">HAN University</p>
      </div>
    </div>
  )
}

export function HanMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      <span className="text-[0.65em] tracking-tighter">HAN</span>
    </span>
  )
}
