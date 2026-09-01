// Centrale (voorbeeld)data voor de HAN Studenten Hub.
// Externe systemen (myX, HAN insite, Brightspace, Osiris) vereisen een login;
// vandaar dat we hier een eigen weergave tonen én naar de echte bron linken.

export const externalLinks = {
  rooster: 'https://han.myx.nl/roster/overview/schedule/0',
  absentie: 'https://www.haninsite.nl',
  brightspace: 'https://brightspace.han.nl',
  osiris: 'https://osiris.han.nl',
  events: 'https://www.han.nl/studeren/studentenleven/',
  insite: 'https://www.haninsite.nl',
} as const

/* ---------------------------------- Rooster --------------------------------- */

export type LessonType = 'college' | 'werkcollege' | 'practicum' | 'tentamen' | 'project'

export interface Lesson {
  id: string
  day: string
  start: string
  end: string
  course: string
  type: LessonType
  room: string
  building: string
  teacher: string
}

export const weekDays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'] as const

export const rooster: Lesson[] = [
  { id: 'l1', day: 'Maandag', start: '09:00', end: '10:30', course: 'Softwarekwaliteit', type: 'college', room: 'D2.14', building: 'Ruitenberglaan 26', teacher: 'M. Jansen' },
  { id: 'l2', day: 'Maandag', start: '11:00', end: '12:30', course: 'Softwarekwaliteit', type: 'werkcollege', room: 'D1.08', building: 'Ruitenberglaan 26', teacher: 'M. Jansen' },
  { id: 'l3', day: 'Maandag', start: '13:30', end: '15:30', course: 'Databases', type: 'practicum', room: 'C0.21', building: 'Ruitenberglaan 31', teacher: 'S. de Vries' },
  { id: 'l4', day: 'Dinsdag', start: '09:00', end: '11:00', course: 'Project Fullstack', type: 'project', room: 'A3.05', building: 'Kapittelweg 33', teacher: 'K. Bakker' },
  { id: 'l5', day: 'Dinsdag', start: '13:00', end: '14:30', course: 'Statistiek', type: 'college', room: 'D2.14', building: 'Ruitenberglaan 26', teacher: 'L. Peters' },
  { id: 'l6', day: 'Woensdag', start: '10:00', end: '12:00', course: 'Webontwikkeling', type: 'practicum', room: 'C0.18', building: 'Ruitenberglaan 31', teacher: 'T. Smit' },
  { id: 'l7', day: 'Donderdag', start: '09:00', end: '10:30', course: 'Bedrijfskunde', type: 'college', room: 'B1.12', building: 'Kapittelweg 33', teacher: 'R. Willems' },
  { id: 'l8', day: 'Donderdag', start: '11:00', end: '13:00', course: 'Project Fullstack', type: 'project', room: 'A3.05', building: 'Kapittelweg 33', teacher: 'K. Bakker' },
  { id: 'l9', day: 'Vrijdag', start: '09:00', end: '11:00', course: 'Databases', type: 'tentamen', room: 'D0.01', building: 'Ruitenberglaan 26', teacher: 'S. de Vries' },
]

export const lessonTypeLabels: Record<LessonType, string> = {
  college: 'Hoorcollege',
  werkcollege: 'Werkcollege',
  practicum: 'Practicum',
  tentamen: 'Tentamen',
  project: 'Project',
}

/* --------------------------- Deadlines & voortgang -------------------------- */

export type DeadlineSource = 'Brightspace' | 'Osiris'
export type DeadlineStatus = 'open' | 'bezig' | 'ingeleverd'

export interface Deadline {
  id: string
  title: string
  course: string
  source: DeadlineSource
  due: string // ISO date
  status: DeadlineStatus
  progress: number // 0 - 100
}

export const deadlines: Deadline[] = [
  { id: 'd1', title: 'Inleveren analyse-document', course: 'Softwarekwaliteit', source: 'Brightspace', due: '2026-09-03', status: 'bezig', progress: 60 },
  { id: 'd2', title: 'Database-ontwerp opdracht 3', course: 'Databases', source: 'Brightspace', due: '2026-09-05', status: 'open', progress: 10 },
  { id: 'd3', title: 'Sprint 1 oplevering', course: 'Project Fullstack', source: 'Brightspace', due: '2026-09-08', status: 'bezig', progress: 40 },
  { id: 'd4', title: 'Tentamen Databases', course: 'Databases', source: 'Osiris', due: '2026-09-11', status: 'open', progress: 25 },
  { id: 'd5', title: 'Reflectieverslag', course: 'Bedrijfskunde', source: 'Brightspace', due: '2026-09-15', status: 'open', progress: 0 },
  { id: 'd6', title: 'Statistiek werkboek', course: 'Statistiek', source: 'Brightspace', due: '2026-08-29', status: 'ingeleverd', progress: 100 },
]

export interface StudyProgress {
  behaaldEC: number
  totaalEC: number
  gemiddelde: number
  periode: string
  vakken: { naam: string; ec: number; behaald: boolean; cijfer?: number }[]
}

export const studyProgress: StudyProgress = {
  behaaldEC: 108,
  totaalEC: 240,
  gemiddelde: 7.4,
  periode: 'Jaar 2 · Periode 1',
  vakken: [
    { naam: 'Programmeren 1', ec: 5, behaald: true, cijfer: 8 },
    { naam: 'Programmeren 2', ec: 5, behaald: true, cijfer: 7 },
    { naam: 'Databases', ec: 5, behaald: false },
    { naam: 'Softwarekwaliteit', ec: 5, behaald: false },
    { naam: 'Project Fullstack', ec: 10, behaald: false },
    { naam: 'Statistiek', ec: 3, behaald: true, cijfer: 6 },
    { naam: 'Bedrijfskunde', ec: 3, behaald: true, cijfer: 8 },
  ],
}

/* ---------------------------- Extra activiteiten ---------------------------- */

export type EventCategory = 'workshop' | 'sport' | 'sociaal' | 'carrière' | 'lezing'

export interface CampusEvent {
  id: string
  title: string
  date: string // ISO
  time: string
  location: string
  category: EventCategory
  description: string
}

export const events: CampusEvent[] = [
  { id: 'e1', title: 'Career Café: solliciteren in tech', date: '2026-09-02', time: '16:00', location: 'Kantine · Ruitenberglaan 26', category: 'carrière', description: 'Netwerk met bedrijven uit de regio en verbeter je cv en pitch.' },
  { id: 'e2', title: 'Bordspellenavond', date: '2026-09-03', time: '19:00', location: 'Student Lounge', category: 'sociaal', description: 'Gezellige avond met snacks, drankjes en tientallen bordspellen.' },
  { id: 'e3', title: 'Workshop Design Thinking', date: '2026-09-04', time: '13:00', location: 'A3.05 · Kapittelweg 33', category: 'workshop', description: 'Leer in 2 uur de basis van design thinking met een echte case.' },
  { id: 'e4', title: 'HAN Running Club', date: '2026-09-05', time: '17:30', location: 'Hoofdingang · verzamelen buiten', category: 'sport', description: 'Wekelijkse hardloopronde van 5 km langs de Rijn. Alle niveaus welkom.' },
  { id: 'e5', title: 'Gastcollege: AI in de zorg', date: '2026-09-09', time: '11:00', location: 'D0.01 · Ruitenberglaan 26', category: 'lezing', description: 'Een expert vertelt hoe AI het zorglandschap verandert.' },
  { id: 'e6', title: 'Duurzaamheidsmarkt', date: '2026-09-10', time: '12:00', location: 'Centrale hal', category: 'sociaal', description: 'Ontdek duurzame initiatieven van medestudenten en organisaties.' },
]

export const eventCategoryLabels: Record<EventCategory, string> = {
  workshop: 'Workshop',
  sport: 'Sport',
  sociaal: 'Sociaal',
  carrière: 'Carrière',
  lezing: 'Lezing',
}

/* -------------------------------- Plattegrond ------------------------------- */

export type RoomType = 'klaslokaal' | 'studieruimte' | 'kantine' | 'administratie'
export type RoomStatus = 'vrij' | 'bezet' | 'nvt'

export interface MapRoom {
  id: string
  name: string
  type: RoomType
  status: RoomStatus
  capacity?: number
  // positie op het schematische raster (kolom / rij, 1-based)
  col: number
  row: number
  w?: number // aantal kolommen breed
}

export interface Floor {
  level: number
  label: string
  rooms: MapRoom[]
}

export interface Building {
  id: string
  name: string
  address: string
  floors: Floor[]
}

export const buildings: Building[] = [
  {
    id: 'rl26',
    name: 'Gebouw D',
    address: 'Ruitenberglaan 26',
    floors: [
      {
        level: 0,
        label: 'Begane grond',
        rooms: [
          { id: 'd001', name: 'D0.01 Aula', type: 'klaslokaal', status: 'nvt', capacity: 120, col: 1, row: 1, w: 2 },
          { id: 'dkantine', name: 'Kantine', type: 'kantine', status: 'nvt', col: 3, row: 1, w: 2 },
          { id: 'dadmin', name: 'Studentbalie', type: 'administratie', status: 'nvt', col: 1, row: 2 },
          { id: 'ds01', name: 'Stilteruimte 0.1', type: 'studieruimte', status: 'vrij', capacity: 8, col: 2, row: 2 },
          { id: 'ds02', name: 'Groepsruimte 0.2', type: 'studieruimte', status: 'bezet', capacity: 6, col: 3, row: 2 },
          { id: 'ds03', name: 'Open leerplein', type: 'studieruimte', status: 'vrij', capacity: 40, col: 4, row: 2 },
        ],
      },
      {
        level: 1,
        label: '1e verdieping',
        rooms: [
          { id: 'd108', name: 'D1.08', type: 'klaslokaal', status: 'nvt', capacity: 32, col: 1, row: 1 },
          { id: 'd109', name: 'D1.09', type: 'klaslokaal', status: 'nvt', capacity: 32, col: 2, row: 1 },
          { id: 'd1s1', name: 'Studieplek 1.A', type: 'studieruimte', status: 'vrij', capacity: 4, col: 3, row: 1 },
          { id: 'd1s2', name: 'Studieplek 1.B', type: 'studieruimte', status: 'bezet', capacity: 4, col: 4, row: 1 },
          { id: 'd1admin', name: 'Decanaat', type: 'administratie', status: 'nvt', col: 1, row: 2, w: 2 },
          { id: 'd1s3', name: 'Projectruimte 1.C', type: 'studieruimte', status: 'vrij', capacity: 8, col: 3, row: 2, w: 2 },
        ],
      },
      {
        level: 2,
        label: '2e verdieping',
        rooms: [
          { id: 'd214', name: 'D2.14 Collegezaal', type: 'klaslokaal', status: 'nvt', capacity: 80, col: 1, row: 1, w: 2 },
          { id: 'd215', name: 'D2.15', type: 'klaslokaal', status: 'nvt', capacity: 32, col: 3, row: 1 },
          { id: 'd2s1', name: 'Studieplek 2.A', type: 'studieruimte', status: 'bezet', capacity: 6, col: 4, row: 1 },
          { id: 'd2s2', name: 'Stilteruimte 2.1', type: 'studieruimte', status: 'vrij', capacity: 12, col: 1, row: 2, w: 2 },
          { id: 'd2s3', name: 'Groepsruimte 2.2', type: 'studieruimte', status: 'vrij', capacity: 6, col: 3, row: 2 },
          { id: 'd2s4', name: 'Groepsruimte 2.3', type: 'studieruimte', status: 'bezet', capacity: 6, col: 4, row: 2 },
        ],
      },
    ],
  },
  {
    id: 'kw33',
    name: 'Gebouw A',
    address: 'Kapittelweg 33',
    floors: [
      {
        level: 0,
        label: 'Begane grond',
        rooms: [
          { id: 'a0kantine', name: 'Grand Café', type: 'kantine', status: 'nvt', col: 1, row: 1, w: 2 },
          { id: 'a0admin', name: 'Receptie & administratie', type: 'administratie', status: 'nvt', col: 3, row: 1, w: 2 },
          { id: 'a0s1', name: 'Open leerplein A', type: 'studieruimte', status: 'vrij', capacity: 50, col: 1, row: 2, w: 3 },
          { id: 'a0s2', name: 'Stilteplek 0.1', type: 'studieruimte', status: 'bezet', capacity: 10, col: 4, row: 2 },
        ],
      },
      {
        level: 3,
        label: '3e verdieping',
        rooms: [
          { id: 'a305', name: 'A3.05 Projectlokaal', type: 'klaslokaal', status: 'nvt', capacity: 30, col: 1, row: 1, w: 2 },
          { id: 'a306', name: 'A3.06', type: 'klaslokaal', status: 'nvt', capacity: 30, col: 3, row: 1 },
          { id: 'a3s1', name: 'Projectruimte 3.A', type: 'studieruimte', status: 'vrij', capacity: 8, col: 4, row: 1 },
          { id: 'a3s2', name: 'Projectruimte 3.B', type: 'studieruimte', status: 'vrij', capacity: 8, col: 1, row: 2 },
          { id: 'a3s3', name: 'Projectruimte 3.C', type: 'studieruimte', status: 'bezet', capacity: 8, col: 2, row: 2 },
          { id: 'a3admin', name: 'Opleidingsbureau', type: 'administratie', status: 'nvt', col: 3, row: 2, w: 2 },
        ],
      },
    ],
  },
]

export const roomTypeLabels: Record<RoomType, string> = {
  klaslokaal: 'Klaslokaal',
  studieruimte: 'Studieruimte',
  kantine: 'Kantine',
  administratie: 'Administratie',
}

/* ------------------------------- HAN-apps ---------------------------------- */

export interface HanApp {
  id: string
  name: string
  description: string
  url: string
}

export const hanApps: HanApp[] = [
  { id: 'myx', name: 'myX', description: 'Persoonlijk rooster & meldingen', url: 'https://myx.han.nl' },
  { id: 'brightspace', name: 'Brightspace', description: 'Digitale leeromgeving & opdrachten', url: 'https://brightspace.han.nl' },
  { id: 'osiris', name: 'OSIRIS', description: 'Cijfers, inschrijvingen & tentamens', url: 'https://osiris.han.nl' },
  { id: 'insite', name: 'HAN insite', description: 'Intranet, nieuws & absentie melden', url: 'https://www.haninsite.nl' },
  { id: 'mail', name: 'HAN Mail', description: 'Je studentmail (Outlook)', url: 'https://outlook.office365.com' },
  { id: 'teams', name: 'Microsoft Teams', description: 'Online lessen & samenwerken', url: 'https://teams.microsoft.com' },
  { id: 'onedrive', name: 'OneDrive', description: 'Cloudopslag voor je bestanden', url: 'https://onedrive.live.com' },
  { id: 'studielink', name: 'Studielink', description: 'In- en uitschrijven voor je opleiding', url: 'https://www.studielink.nl' },
  { id: 'duo', name: 'DUO', description: 'Studiefinanciering & OV', url: 'https://duo.nl' },
]

/* --------------------------- Studentenkamers -------------------------------- */

export interface RoomListing {
  id: string
  title: string
  city: string
  distance: string
  price: number
  size: string
  provider: string
  url: string
}

export const kamers: RoomListing[] = [
  { id: 'k1', title: 'Studio nabij campus', city: 'Arnhem', distance: '0,8 km van HAN', price: 595, size: '24 m²', provider: 'Kamernet', url: 'https://kamernet.nl' },
  { id: 'k2', title: 'Kamer in studentenhuis', city: 'Arnhem', distance: '1,5 km van HAN', price: 425, size: '16 m²', provider: 'Room.nl', url: 'https://www.room.nl' },
  { id: 'k3', title: 'Appartement Rijnkade', city: 'Arnhem', distance: '2,3 km van HAN', price: 750, size: '32 m²', provider: 'SSH&', url: 'https://www.sshxl.nl' },
  { id: 'k4', title: 'Gemeubileerde kamer', city: 'Arnhem', distance: '1,1 km van HAN', price: 480, size: '18 m²', provider: 'Kamernet', url: 'https://kamernet.nl' },
  { id: 'k5', title: 'Studio Nijmegen centrum', city: 'Nijmegen', distance: 'nabij HAN Nijmegen', price: 640, size: '26 m²', provider: 'SSH&', url: 'https://www.sshxl.nl' },
  { id: 'k6', title: 'Kamer met gedeelde keuken', city: 'Nijmegen', distance: '0,6 km van HAN', price: 410, size: '14 m²', provider: 'Room.nl', url: 'https://www.room.nl' },
]

export const housingPortals = [
  { name: 'Kamernet', url: 'https://kamernet.nl' },
  { name: 'Room.nl', url: 'https://www.room.nl' },
  { name: 'SSH&', url: 'https://www.sshxl.nl' },
  { name: 'DUWO', url: 'https://www.duwo.nl' },
]
