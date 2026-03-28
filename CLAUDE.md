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

**Dlaczego React SPA zamiast Inertia.js:** panel klienta na subdomenach wymaga
API tak czy inaczej — Inertia traci główną zaletę. Oba frontendy (admin + klient)
współdzielą to samo API.

**Konfiguracja Sanctum dla wildcard subdomen:**

```env
SESSION_DOMAIN=.clientops.pl
SANCTUM_STATEFUL_DOMAINS=app.clientops.pl,*.clientops.pl
# config/cors.php
'allowed_origins_patterns' => ['#^https://[a-z0-9-]+\.clientops\.pl$#'],
'supports_credentials' => true,
```

---

## Stack technologiczny

### Backend

- **Laravel 12** (lub aktualna stabilna) + **PHP 8.3+**
- **PostgreSQL 16+** z rozszerzeniem **TimescaleDB** (rankingi SEO — time-series)
- **Redis 7** — cache, kolejki, sesje, Reverb pub/sub
- **Laravel Queues** — fundament asynchronicznych operacji (driver: Redis)
- **Laravel Horizon** — dashboard i monitoring kolejek, balansowanie workerów
- **Laravel Sanctum** — SPA auth przez cookies (stateful), `SESSION_DOMAIN=.clientops.pl`
- **Laravel Policies / Gates** — autoryzacja na poziomie rekordów (nie tylko ról)
- **Laravel Notifications** — unifikacja email + SMS + in-app w jednym interfejsie
- **Laravel Reverb** — natywny WebSocket server, skalowanie przez Redis pub/sub
- **Spatie Permission** — RBAC, 6 ról (patrz niżej)
- **Spatie Media Library** — pliki powiązane z modelami, driver S3/MinIO
- **S3 / MinIO** — object storage (MinIO self-hosted na start, S3 bez zmiany kodu)
- **Laravel Browsershot** — PDF przez headless Chromium (Puppeteer), async w kolejce
- **Laravel Scout + Meilisearch** — full-text search, typo-tolerance, <50ms
- **SMS: SMSAPI.pl** — polski dostawca SMS

### Frontend

- **React 19 + TypeScript + Vite** — SPA, szybki build, HMR
- **Tailwind CSS v4 + shadcn/ui** — utility-first + gotowe dostępne komponenty
- **TanStack Query v5** — server state, cache, optimistic updates
- **React Hook Form + Zod** — formularze + walidacja schematowa (schemat reużywalny)
- **dnd-kit** — drag & drop dla Kanban (następca react-beautiful-dnd)
- **TipTap v2** — edytor dokumentów (ProseMirror), zapis jako JSON + HTML
- **Recharts + Tremor** — wykresy SEO (Recharts) + widgety dashboardów (Tremor)
- **React Router v7** — routing SPA, code splitting per route
- **Zustand** — global state: powiadomienia, user context, UI state
- **Laravel Echo** — WebSocket client → Reverb, autoryzacja prywatnych kanałów

---

## Moduły systemu

1. **CRM** — leady, klienci, kontakty, historia komunikacji
2. **Kanban leadów** — 7 kolumn (patrz niżej)
3. **Projekty** — realizacje dla klientów
4. **Oferty** — osobny byt między leadem a klientem (nie alias)
5. **Dokumenty** — TipTap editor, wersjonowanie (`document_versions`), PDF export
6. **SEO z AI** — rozbudowany moduł (patrz niżej)
7. **Audyty** — byt nadrzędny grupujący analizy różnych typów
8. **Tickets** — zgłoszenia klientów (sfera ludzka)
9. **SLA** — polityki + automatyczne naruszenia `sla_incidents` (sfera systemowa)
10. **Panel klienta** — na subdomenach `{slug}.clientops.pl`
11. **Powiadomienia** — email / SMS / in-app real-time, preferencje per user

---

## Architektura danych — 3 warstwy

```
Warstwa 1 — Tożsamość:  users, clients, contacts
Warstwa 2 — Sprzedaż:   leads, lead_activities, offers
Warstwa 3 — Realizacja: projects, documents, seo_analyses, audits,
                        notifications, tickets, sla_policies, sla_incidents
```

### Kluczowe relacje
- `clients` 1:N `contacts` (firma → osoby kontaktowe)
- `clients` 1:N `projects`
- `leads` → konwersja → `clients` (won status wyzwala konwersję)
- `leads` 1:N `lead_activities`, `offers`
- `contacts` 1:N `leads` (konkretna osoba powiązana z leadem)
- `projects` 1:N `documents`, `seo_analyses`, `audits`, `tickets`
- `audits` 1:N `seo_analyses` (opcjonalne — analiza może być samodzielna)
- `tickets` → system → `sla_incidents`
- `projects` → system → `sla_incidents` (breach deadline)

### Kluczowa zasada
**Nie łącz w jeden byt.** Lead → Klient → Projekt to trzy osobne stany relacji biznesowej.

### Multi-tenancy

Single database + Global Scopes + `client_id` na każdej tabeli (nie DB per tenant).
Tenant identyfikowany przez subdomenę w middleware:

```php
$slug = explode('.', $request->getHost())[0]; // acme
$tenant = Client::where('slug', $slug)->firstOrFail();
app()->instance('tenant', $tenant);
```
Trait `BelongsToTenant` dodaje Global Scope i auto-wypełnia `client_id` przy tworzeniu.

---

## Schematy kluczowych tabel

### contacts

```
client_id, first_name, last_name, email, phone,
position, is_primary (bool), notes
```

### lead_activities

```
lead_id, user_id, type, description, occurred_at
type: call | email | meeting | note | status_change
```

### offers

```
lead_id, client_id (nullable — wypełniane przy konwersji),
title, status, valid_until, document_id (nullable → TipTap),
accepted_at, converted_to_client_at
status: draft | sent | accepted | rejected | expired
```

### tickets

```
client_id, project_id, created_by, title, description,
priority: low | medium | high | critical,
status: new | open | in_progress | waiting | resolved | closed,
sla_policy_id, sla_response_due_at, sla_resolution_due_at,
first_responded_at, resolved_at, kanban_card_id
```

### ticket_comments

```
ticket_id, author_id, author_type,
is_internal (bool — notatki niewidoczne dla klienta),
content
```

### sla_policies

```
client_id (nullable — globalny default),
priority, response_time_hours, resolution_time_hours,
business_hours_only (bool)
```

### sla_incidents

```
subject_type: "Ticket" | "Project", subject_id,
breach_type: response | resolution | deadline,
breached_at, detected_at, notified (bool),
acknowledged_by, acknowledged_at, resolved_at
```

### documents

```
documentable_type: "Project" | "Client" | "Ticket", documentable_id,
title, content_json (TipTap format), content_html, pdf_path, version
```

### document_versions

```
document_id, version, content_json, created_by, created_at
```

### kanban_cards (ujednolicony model)

```
board_id, column_id, position,
cardable_type: "Lead" | "Ticket" | "ProjectTask", cardable_id,
assigned_to, due_at
```
Zmiana statusu leadu automatycznie przesuwa kartę przez event → listener.

### notification_preferences

```
user_id, notification_type, channels (JSON array),
quiet_hours_from, quiet_hours_to, quiet_hours_timezone
```
Typy zdarzeń: `ticket_update | sla_breach | audit_complete | pdf_ready | deadline`
Kanały: `mail | sms | database | broadcast`
SMS ma quiet hours — nie wysyłamy np. między 22:00 a 08:00.

---

## Kanban leadów — 7 kolumn

```
new → contacted → no_response → in_discussion → offer_sent → won → lost
```

PHP enum `LeadStatus`. Kolumny `won` i `lost` są terminalne.
`won` wyzwala konwersję leadu do klienta.

---

## Tickets vs SLA Incidents

| | tickets | sla_incidents |
|---|---|---|
| Twórca | klient (ręcznie) | system (automatycznie) |
| Wyzwalacz | człowiek klika "zgłoś" | upływ czasu / brak akcji |
| Cel | obsługa zgłoszenia | alert o naruszeniu SLA |
| Widoczne dla | klient + admin | admin / manager |

`sla_incidents` tworzone przez `CheckSlaBreachesJob` co 5 minut.
Typy naruszeń: `response` / `resolution` / `deadline`.
Jeden ticket może wygenerować wiele incydentów (najpierw response, potem resolution breach).

---

## Audyty vs Analizy SEO

- `audits` — byt nadrzędny (type: `seo | technical | ux | security | full`)
- `seo_analyses` — samodzielna LUB składowa audytu (`audit_id nullable`)
- Analiza samodzielna: `audit_id = null`, widoczna w sekcji "Analizy SEO" projektu
- Analiza jako składowa: `audit_id = X`, wyniki agregowane w raporcie audytu

---

## SEO — kluczowe założenia

Najcięższy moduł, budowany jako ostatni (faza 6). Źródła danych:
- Google Search Console API (pozycje, kliknięcia, impressions, CTR)
- Google Analytics 4 API (ruch organiczny, konwersje)
- Własny crawler lub zewnętrzne API (błędy techniczne: meta, h1, broken links)
- AI (Claude / OpenAI) — analiza semantyczna treści, rekomendacje optymalizacji
- PageSpeed Insights API (Core Web Vitals: LCP, CLS, INP)

Pipeline kolejkowy:

```
AuditRequestedEvent
  → CrawlWebsiteJob       (queue: crawlers)
  → FetchGSCDataJob       (queue: google-apis)
  → FetchGA4DataJob       (queue: google-apis, równolegle)
  → AnalyzeKeywordsJob    (queue: ai-processing)
  → AnalyzeSemanticsJob   (queue: ai-processing, równolegle)
  → GenerateAuditReportJob
  → NotifyAuditCompleteJob
```

Tabele SEO:

```
seo_audits, seo_audit_pages, seo_issues (severity: critical|warning|info),
seo_keywords, seo_keyword_ranks (TimescaleDB — time-series),
seo_recommendations (AI suggestions)
```

---

## Role (Spatie Permission)

```
super-admin   — pełny dostęp, właściciel systemu, konfiguracja integracji
admin         — pełny CRM, zarządzanie zespołem, konfiguracja SLA
manager       — przypisane projekty i klienci, bez ustawień systemu
employee      — tylko przypisane zadania i projekty
client-admin  — pełny dostęp do panelu klienta swojej firmy, zarządza client-user
client-user   — ograniczony widok: projekty, dokumenty, zgłoszenia
```

Dwa poziomy autoryzacji:
1. **Spatie** — "czy masz rolę manager?" (role check)
2. **Policies** — "czy jesteś przypisany do tego projektu?" (record check)

---

## Priorytety wdrożenia

1. Core — auth, role, klienci, kontakty, projekty, subdomeny, multi-tenancy
2. CRM — leady, Kanban (7 kolumn), lead_activities, oferty, konwersja
3. SLA + Tickets — ticket_comments, sla_policies, sla_incidents, scheduled job
4. Dokumenty — TipTap, document_versions, Browsershot PDF, Spatie Media Library
5. Powiadomienia — email → in-app (Reverb/Echo) → SMS (SMSAPI.pl), quiet hours
6. SEO z AI — crawler, Google APIs, pipeline Horizon, TimescaleDB, AI integration

---

## Flow sprzedaży

```
Kontakt / firma → Lead → Oferta → Klient → Projekt → zasoby projektu
```

Admin krok po kroku:

1. Tworzy lead → rekord `leads` + opcjonalne `contacts`
2. Kontaktuje się → wpis `lead_activities` (call/email/meeting)
3. Wysyła ofertę → rekord `offers` (status: sent), opcjonalnie dokument TipTap
4. Oferta zaakceptowana → `offers.status = accepted`
5. Konwertuje → tworzony `clients`, `leads.converted_at`, kopiowane kontakty
6. Tworzy projekt → `projects` z `client_id`, przypisana `sla_policy`

---

## UI — struktura menu

**Panel admina** (`app.clientops.pl`):
Dashboard, Leady, Klienci, Kontakty, Projekty, Oferty, Dokumenty,
Analizy SEO, Audyty, Zgłoszenia, SLA / Naruszenia, Powiadomienia,
Użytkownicy, Ustawienia

**Panel klienta** (`{slug}.clientops.pl`):
Dashboard, Moje projekty, Dokumenty, Analizy SEO, Audyty,
Zgłoszenia, SLA — status umowy, Powiadomienia, Profil

---

## Dokumentacja projektu

Pliki źródłowe (HTML) w `docs/` — edytuj tu, potem generuj PDF:

- `docs/clientops-crm-spec.html` — specyfikacja techniczna (aktualna: v1.1.0)
- `docs/clientops-architecture.html` — architektura i model danych (aktualna: v1.0.0)

Wersjonowane PDF w `docs/pdf/`.

Generowanie PDF (wymaga puppeteer w `/tmp/node_modules`):

```bash
cd /tmp && node /Users/maciejf85/Sites/CRM/docs/generate-pdf.js 1.2.0
```

---

## Repo

`git@github.com:Maciejf85/CRM---Architecture-and-Data-Model.git`
