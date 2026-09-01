'use client'

import { ExternalLink, ArrowUpRight, Bed, MapPin } from 'lucide-react'
import { PageHeader, Card, Badge, SectionTitle } from '../ui'
import { hanApps, kamers, housingPortals } from '@/lib/hub-data'

export function AppsView() {
  return (
    <div>
      <PageHeader
        title="Apps & kamers"
        description="Snel naar alle HAN-apps die je dagelijks gebruikt, plus woningaanbod voor studenten in de buurt van de campus."
      />

      {/* HAN apps */}
      <section className="mb-8">
        <SectionTitle>HAN-apps</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hanApps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {app.name.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold">
                  {app.name}
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {app.description}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Housing */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Kamers voor studenten in de buurt</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {housingPortals.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-accent"
              >
                {p.name}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kamers.map((k) => (
            <Card key={k.id} className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-info/12 text-info">
                  <Bed className="size-4" />
                </span>
                <Badge variant="outline">{k.provider}</Badge>
              </div>
              <h3 className="font-semibold leading-tight">{k.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {k.city} · {k.distance}
              </p>
              <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                <div>
                  <p className="text-lg font-bold text-foreground">
                    &euro;{k.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      {' '}
                      / mnd
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{k.size}</p>
                </div>
                <a
                  href={k.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Bekijk
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Woningaanbod is een voorbeeldweergave. Bekijk de actuele advertenties
          en huurprijzen op de gekoppelde portalen.
        </p>
      </section>
    </div>
  )
}
