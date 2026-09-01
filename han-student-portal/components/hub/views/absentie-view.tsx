'use client'

import { useState } from 'react'
import { CircleCheck, Info } from 'lucide-react'
import { PageHeader, Card, ExternalLinkButton, Badge } from '../ui'
import { externalLinks, rooster } from '@/lib/hub-data'

const reasons = [
  'Ziekte',
  'Doktersbezoek / afspraak',
  'Familieomstandigheden',
  'Reisvertraging',
  'Overig',
]

const courses = Array.from(new Set(rooster.map((l) => l.course)))

export function AbsentieView() {
  const [submitted, setSubmitted] = useState(false)
  const [reason, setReason] = useState(reasons[0])
  const [date, setDate] = useState('')
  const [course, setCourse] = useState('all')
  const [note, setNote] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <PageHeader
        title="Absentie melden"
        description="Officiële absentiemeldingen verlopen via HAN insite. Vul hieronder je melding voor en dien 'm daarna in bij HAN insite."
        action={
          <ExternalLinkButton href={externalLinks.absentie}>
            Open HAN insite
          </ExternalLinkButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-available/15 text-available">
                <CircleCheck className="size-7" />
              </span>
              <h2 className="text-lg font-semibold">Melding voorbereid</h2>
              <p className="max-w-sm text-sm text-muted-foreground text-pretty">
                Je concept is opgeslagen. Rond de officiële melding af in HAN
                insite zodat je docent en de studieadministratie het ontvangen.
              </p>
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                <ExternalLinkButton href={externalLinks.absentie}>
                  Afronden in HAN insite
                </ExternalLinkButton>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
                >
                  Nieuwe melding
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Reden">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input"
                >
                  {reasons.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Datum">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Betreft les / vak">
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="input"
                  >
                    <option value="all">Hele dag</option>
                    {courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Toelichting (optioneel)">
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Bijv. verwachte terugkomst of extra context voor je docent"
                  className="input resize-none"
                />
              </Field>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Melding voorbereiden
              </button>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-2 flex items-center gap-2 font-semibold">
              <Info className="size-4 text-info" />
              Goed om te weten
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>· Meld je absentie zo vroeg mogelijk, liefst vóór aanvang van de les.</li>
              <li>· Bij tentamens gelden aparte regels — check je opleidingsgids.</li>
              <li>· Langdurige afwezigheid? Neem contact op met je studieloopbaanbegeleider.</li>
            </ul>
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold">Status recente meldingen</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Ziekte · 26 aug</span>
                <Badge variant="available">Verwerkt</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span>Afspraak · 19 aug</span>
                <Badge variant="available">Verwerkt</Badge>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  )
}
