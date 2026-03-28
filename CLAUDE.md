# ClientOps CRM — Kontekst projektu

Czytasz ten plik bo pracujesz nad projektem CRM o roboczej nazwie **ClientOps**.
Zanim cokolwiek zrobisz — przeczytaj go w całości.

---

## Czym jest projekt

Multi-tenant CRM SaaS z panelem klienta na subdomenach.
Budowany od zera — aktualnie etap projektowania i dokumentacji.

---

## Subdomeny

| Subdomena | Rola |
|---|---|
| `app.clientops.pl` | Panel admina (React SPA) |
| `api.clientops.pl` | Laravel REST API |
| `{slug}.clientops.pl` | Panel klienta (React SPA, osobny per klient) |

Domena `clientops.pl` jest robocza — może się zmienić.

---

## Stack technologiczny

### Backend
- **Laravel 12** (lub aktualna stabilna) + **PHP 8.3+**
- **PostgreSQL 16+** z rozszerzeniem **TimescaleDB** (rankingi SEO)
- **Redis 7** — cache, kolejki, sesje
- **Laravel Queues** — asynchroniczne operacje (fundament)
- **Laravel Horizon** — dashboard i monitoring kolejek
- **Laravel Sanctum** — SPA auth przez cookies, `SESSION_DOMAIN=.clientops.pl`
- **Laravel Policies / Gates** — autoryzacja na poziomie rekordów
- **Laravel Notifications** — email + SMS + in-app przez jeden interfejs
- **Laravel Reverb** — natywny WebSocket server (in-app real-time)
- **Spatie Permission** — RBAC, 6 ról (patrz niżej)
- **Spatie Media Library** — zarządzanie plikami, S3/MinIO driver
- **S3 / MinIO** — object storage (MinIO self-hosted na start)
- **Laravel Browsershot** — generowanie PDF przez headless Chromium
- **Laravel Scout + Meilisearch** — full-text search dokumentów i SEO
- **SMS: SMSAPI.pl** — polski dostawca SMS

### Frontend
- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4 + shadcn/ui** — UI components
- **TanStack Query v5** — server state, cache
- **React Hook Form + Zod** — formularze i walidacja
- **dnd-kit** — drag & drop (Kanban)
- **TipTap v2** — edytor dokumentów (rich text → JSON/HTML)
- **Recharts + Tremor** — wykresy SEO i dashboardy
- **React Router v7** — routing SPA
- **Zustand** — global state (notyfikacje, UI, user context)
- **Laravel Echo** — WebSocket client → Reverb

---

## Moduły systemu

1. **CRM** — leady, klienci, kontakty, historia komunikacji
2. **Kanban leadów** — 7 kolumn (patrz niżej)
3. **Projekty** — realizacje dla klientów
4. **Oferty** — krok między leadem a klientem
5. **Dokumenty** — TipTap editor, wersjonowanie, PDF export
6. **SEO z AI** — rozbudowany moduł (patrz niżej)
7. **Audyty** — byt nadrzędny grupujący analizy różnych typów
8. **Tickets** — zgłoszenia klientów (sfera ludzka)
9. **SLA** — polityki + automatyczne naruszenia (sfera systemowa)
10. **Panel klienta** — na subdomenach `{slug}.clientops.pl`
11. **Powiadomienia** — email / SMS / in-app real-time

---

## Architektura danych — 3 warstwy

```
Warstwa 1 — Tożsamość:  users, clients, contacts
Warstwa 2 — Sprzedaż:   leads, lead_activities, offers
Warstwa 3 — Realizacja: projects, documents, seo_analyses, audits,
                        notifications, tickets, sla_policies, sla_incidents
```

### Kluczowe relacje
- `clients` 1:N `contacts` (firma ma wiele osób kontaktowych)
- `clients` 1:N `projects`
- `leads` → konwersja → `clients`
- `leads` 1:N `lead_activities`, `offers`
- `projects` 1:N `documents`, `seo_analyses`, `audits`, `tickets`
- `audits` 1:N `seo_analyses` (opcjonalne — analiza może być samodzielna)
- `tickets` → system → `sla_incidents`

### Kluczowa zasada
**Nie łącz w jeden byt.** Lead → Klient → Projekt to trzy osobne stany.

---

## Kanban leadów — 7 kolumn

```
new → contacted → no_response → in_discussion → offer_sent → won → lost
```

Enum `LeadStatus` w PHP. Zmiana statusu = przesunięcie karty.

---

## Tickets vs SLA Incidents

| | tickets | sla_incidents |
|---|---|---|
| Twórca | klient (ręcznie) | system (automatycznie) |
| Wyzwalacz | człowiek klika "zgłoś" | upływ czasu / brak akcji |
| Cel | obsługa zgłoszenia | alert o naruszeniu SLA |

`sla_incidents` tworzone przez scheduled job co 5 minut.
Typy naruszeń: `response` / `resolution` / `deadline`.

---

## SEO — kluczowe założenia

Najcięższy moduł, budowany jako ostatni. Źródła danych:
- Google Search Console API
- Google Analytics 4 API
- Własny crawler lub zewnętrzne API
- AI (Claude / OpenAI) — analiza semantyczna, rekomendacje
- PageSpeed Insights API

Pipeline: `AuditRequestedEvent` → seria jobów w Horizon → powiadomienie.
Rankingi przechowywane w TimescaleDB (time-series, miliony wierszy/rok).

---

## Audyty vs Analizy SEO

- `audits` — byt nadrzędny (type: seo | technical | ux | security)
- `seo_analyses` — samodzielna LUB składowa audytu (`audit_id nullable`)

---

## Role (Spatie Permission)

```
super-admin   — pełny dostęp, właściciel systemu
admin         — pełny CRM, zarządzanie zespołem
manager       — przypisane projekty i klienci
employee      — tylko przypisane zadania
client-admin  — pełny dostęp do panelu klienta swojej firmy
client-user   — ograniczony dostęp w panelu klienta
```

---

## Multi-tenancy

Single database + Global Scopes (nie DB per tenant).
Tenant identyfikowany przez subdomenę w middleware.

```php
$slug = explode('.', $request->getHost())[0]; // acme
$tenant = Client::where('slug', $slug)->firstOrFail();
```

---

## Priorytety wdrożenia

1. Core — auth, role, klienci, projekty, subdomeny
2. CRM — leady, Kanban, aktywności, oferty
3. SLA + Tickets
4. Dokumenty (TipTap + PDF)
5. Powiadomienia (email → in-app → SMS)
6. SEO z AI (ostatni — najcięższy)

---

## Dokumentacja projektu

Pliki źródłowe (HTML) w `docs/`:
- `docs/clientops-crm-spec.html` — specyfikacja techniczna
- `docs/clientops-architecture.html` — architektura i model danych

Wersjonowane PDF w `docs/pdf/`:
- `clientops-crm-spec-v1.1.0.pdf` — aktualna spec
- `clientops-architecture-v1.0.0.pdf` — aktualna architektura

Generowanie nowego PDF:
```bash
cd /tmp && node /Users/maciejf85/Sites/CRM/docs/generate-pdf.js 1.2.0
```
(wymaga puppeteer w /tmp/node_modules)

---

## Repo

`git@github.com:Maciejf85/CRM---Architecture-and-Data-Model.git`
