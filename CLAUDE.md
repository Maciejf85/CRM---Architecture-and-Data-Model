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
- **PostgreSQL 16+** z rozszerzeniami **TimescaleDB** (rankingi SEO — time-series) i **pgvector** (wektory embeddingów 1536-dim dla Bazy Wiedzy AI)
- **Redis 7** — cache, kolejki, sesje, Reverb pub/sub
- **Laravel Queues** — fundament asynchronicznych operacji (driver: Redis)
- **Laravel Horizon** — dashboard i monitoring kolejek, balansowanie workerów
- **Laravel Sanctum** — SPA auth przez cookies (stateful), `SESSION_DOMAIN=.clientops.pl`
- **Laravel Socialite** — OAuth2 login przez Google (`laravel/socialite`); provider Google, callback `/auth/google/callback`; user bez hasła jeśli rejestracja przez Google
- **2FA przez email** — opcjonalne, włączane per user z ustawień; przy logowaniu generowany 6-cyfrowy kod, wysyłany mailem, ważny 10 min; kolumny `two_factor_enabled`, `two_factor_code`, `two_factor_expires_at` w tabeli `users`
- **Laravel Policies / Gates** — autoryzacja na poziomie rekordów (nie tylko ról)
- **Laravel Notifications** — unifikacja email + SMS + in-app w jednym interfejsie
- **Laravel Reverb** — natywny WebSocket server, skalowanie przez Redis pub/sub
- **laravel-notification-channels/webpush** — opcjonalny kanał web push (przeglądarki)
- **Spatie Permission** — RBAC, 6 ról (patrz niżej)
- **Spatie Activity Log** — audit trail: każda akcja admina i klienta (kto, co, kiedy, diff), tabela `activity_log`
- **Spatie Media Library** — pliki powiązane z modelami, driver S3/MinIO
- **S3 / MinIO** — object storage (MinIO self-hosted na start, S3 bez zmiany kodu)
- **Laravel Browsershot** — PDF przez headless Chromium (Puppeteer), async w kolejce
- **Laravel Scout + Meilisearch** — full-text search, typo-tolerance, <50ms
- **SMS: SMSAPI.pl** — polski dostawca SMS
- **Claude API (Anthropic)** — AI agenci (Discovery Workshop agent "Kasia" — claude-sonnet-4-5), analiza semantyczna treści SEO, rekomendacje
- **Ahrefs API / Semrush API** — zewnętrzne dane SEO: backlinki, ruch organiczny, ranking domen (faza SEO)
- **Google PageSpeed Insights API** — Core Web Vitals (LCP, CLS, INP)
- **axe-core / WAVE API** — automatyczne testy dostępności WCAG (audyty UX)
- **securityheaders.com API** — skanowanie nagłówków HTTP bezpieczeństwa (audyty security)
- **WP REST API** — integracja z WordPress: auto-deploy treści SEO generowanych przez AI

### Frontend

- **React 19 + TypeScript + Vite** — SPA, szybki build, HMR
- **Tailwind CSS v4** — utility-first, konfiguracja przez `@tailwindcss/vite`
- **phoenix-design-system** — własny design system przepisany z ClientOps Bootstrap; tokens (kolory, typografia, spacing, shadows, dark mode) + komponenty CSS (buttons, forms, modal, kanban, cards i in.); zastępuje shadcn/ui
- **class-variance-authority (cva)** — typowane warianty komponentów React, migracja z klas CSS `.btn-mkds` do komponentów
- **TanStack Query v5** — server state, cache, optimistic updates
- **React Hook Form + Zod** — formularze + walidacja schematowa
- **dnd-kit** — drag & drop dla Kanban (następca react-beautiful-dnd)
- **TipTap v2** — edytor dokumentów (headless ProseMirror, JSON+HTML, MIT, brak API key)
- **echarts + echarts-for-react** — wykresy SEO i dashboardów (linie, słupki, pie, heatmapy, gauge)
- **React Router v7** — routing SPA, code splitting per route
- **Zustand** — global state: powiadomienia, user context, UI state
- **Laravel Echo** — WebSocket client → Reverb
- **react-select** — custom select, multi-select, autocomplete
- **react-dropzone** — upload plików drag & drop
- **react-day-picker** — date picker, date range
- **@fullcalendar/react** — kalendarz eventów (miesiąc/tydzień/dzień)
- **lucide-react** — ikony SVG (następca Feather Icons)
- **@floating-ui/react** — pozycjonowanie tooltip/popover
- **dayjs** — manipulacja datami
- **lodash-es** — utility funkcje, tree-shakeable

### Czego NIE ma w stacku (i dlaczego)

- ~~shadcn/ui~~ → phoenix-design-system (własne komponenty + cva)
- ~~Tremor~~ → echarts-for-react (potężniejszy, SEO potrzebuje heatmap/gauge)
- ~~TinyMCE~~ → TipTap (headless, MIT, JSON output, stylowalny design systemem)
- ~~Recharts~~ → echarts (bogatszy zestaw typów wykresów)

---

## Moduły systemu

1. **CRM** — leady, klienci, kontakty, historia komunikacji
2. **Kanban leadów** — 7 kolumn (patrz niżej)
3. **Projekty** — realizacje dla klientów
4. **Oferty** — osobny byt między leadem a klientem (nie alias); publiczny podgląd przez `public_token`
5. **Dokumenty** — TipTap editor, wersjonowanie (`document_versions`), PDF export
6. **SEO z AI** — rozbudowany moduł (patrz niżej)
7. **Audyty** — byt nadrzędny grupujący analizy: SEO, UX (axe-core), Security (nagłówki HTTP), techniczne
8. **Raporty audytów** — PDF generowany po zakończeniu audytu, publiczny link z tokenem, komentarz stratega
9. **Tickets** — zgłoszenia klientów (sfera ludzka)
10. **SLA** — polityki + automatyczne naruszenia `sla_incidents` (sfera systemowa)
11. **Panel klienta** — na subdomenach `{slug}.clientops.pl`
12. **Powiadomienia** — email / SMS / in-app real-time, preferencje per user
13. **Audit log** — rejestrowanie każdej akcji admina i klienta (`activity_log`)
14. **Wiadomości wewnętrzne** — zunifikowany inbox: notyfikacje systemowe + wiadomości człowiek→człowiek w jednym miejscu
15. **Discovery Workshop** — 9-krokowy wywiad prowadzony przez AI agenta "Kasia" (Claude Sonnet), SSE streaming odpowiedzi, wyniki zapisywane w krokach
16. **Kwalifikacja leadów AI** — 8-wymiarowy scoring leadu (budżet, timeline, decyzyjność, problem, fit, konkurencja, urgency, LTV)
17. **Baza Wiedzy (Knowledge System)** — fakty (`knowledge_facts`), encje i relacje (`knowledge_entities`, `knowledge_entity_relations`), drzewo wiedzy (`knowledge_items`); pgvector 1536-dim do semantic search; globalna wiedza agenta (`agent_knowledge`)
18. **Szablony bloków** — ~20 predefiniowanych bloków TipTap z scoringiem AI (`block_templates`, `block_template_scores`)
19. **AI Visibility Score** — 8-czynnikowy scoring widoczności AI dla projektu/klienta
20. **SEO Workshop** — 4-etapowy przepływ: analiza → strategia → treść → deploy; auto-deploy na WordPress przez WP REST API
21. **Work Log** — dziennik pracy per projekt, kategoryzowany czas pracy (`work_logs`)
22. **Planer pracy** — tygodniowy/miesięczny plan z itemami i statusami (`work_plans`, `work_plan_items`)

---

## Architektura danych — 3 warstwy

```
Warstwa 1 — Tożsamość:  users, clients, contacts

Warstwa 2 — Sprzedaż:   leads, lead_activities, lead_classifications,
                        offers,
                        discovery_workshops, workshop_steps, workshop_step_outputs

Warstwa 3 — Realizacja: projects, documents, document_versions,
                        seo_analyses, audits, audit_issues, audit_scores,
                        audit_reports, ux_audit_results, security_audit_results,
                        seo_issues, seo_keyword_ranks, seo_monthly_snapshots,
                        seo_cwv_snapshots, seo_backlinks,
                        seo_competitors, seo_competitor_ranks,
                        seo_keyword_opportunities, seo_workshop_steps,
                        ai_visibility_scores,
                        block_templates, block_template_scores,
                        knowledge_facts, knowledge_entities,
                        knowledge_entity_relations, knowledge_items, agent_knowledge,
                        work_logs, work_plans, work_plan_items,
                        notifications, tickets, ticket_comments,
                        sla_policies, sla_incidents,
                        activity_log, conversations, conversation_participants,
                        messages, mentions, notification_preferences,
                        kanban_cards
```

### Kluczowe relacje
- `clients` 1:N `contacts` (firma → osoby kontaktowe)
- `clients` 1:N `projects`
- `leads` → konwersja → `clients` (won status wyzwala konwersję)
- `leads` 1:N `lead_activities`, `offers`
- `leads` 1:1 `lead_classifications` (scoring AI 8 wymiarów)
- `leads` 1:N `discovery_workshops` → 1:N `workshop_steps` → 1:N `workshop_step_outputs`
- `contacts` 1:N `leads` (konkretna osoba powiązana z leadem)
- `projects` 1:N `documents`, `seo_analyses`, `audits`, `tickets`, `work_logs`, `work_plans`
- `projects` 1:N `ai_visibility_scores` (historia scoringów)
- `audits` 1:N `seo_analyses` (opcjonalne — analiza może być samodzielna)
- `audits` 1:1 `audit_reports` (PDF generowany po zakończeniu)
- `audits` 1:N `ux_audit_results`, `security_audit_results`
- `tickets` → system → `sla_incidents`
- `projects` → system → `sla_incidents` (breach deadline)
- `knowledge_entities` 1:N `knowledge_entity_relations` (subject/object — trójki relacji)
- `knowledge_items` self-referential (`parent_id`) — drzewo wiedzy

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
accepted_at, converted_to_client_at,
public_token (UUID — publiczny podgląd bez logowania),
public_expires_at (nullable)
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

### discovery_workshops + workshop_steps + workshop_step_outputs

```
discovery_workshops
  lead_id, conducted_by (user_id), status, started_at, completed_at
  status: in_progress | completed | abandoned

workshop_steps
  workshop_id, step_number (1-9), title, status,
  agent_prompt, completed_at
  status: pending | active | completed | skipped

workshop_step_outputs
  step_id, output_type, content (TEXT), created_at
  output_type: agent_response | user_input | summary
```
AI agent "Kasia" (Claude Sonnet) prowadzi wywiad przez SSE streaming.
9 kroków: cel projektu, obecna sytuacja, problemy, budżet, timeline, decyzyjność, konkurencja, oczekiwania, podsumowanie.

### lead_classifications

```
lead_id (unique),
budget_score (1-10), timeline_score (1-10), decision_score (1-10),
problem_score (1-10), fit_score (1-10), competition_score (1-10),
urgency_score (1-10), ltv_score (1-10),
overall_score (decimal — średnia ważona),
ai_reasoning (TEXT — uzasadnienie scoringu),
classified_at
```
Wypełniane przez AI po zakończeniu Discovery Workshop lub ręcznie przez managera.

### block_templates + block_template_scores

```
block_templates
  slug (unique), name, category, description,
  content_json (TipTap JSON — szablon bloku),
  variables (JSON array — {name, description, placeholder}),
  is_active (bool)
  category: intro | problem | solution | cta | testimonial | faq | pricing | ...

block_template_scores
  template_id, project_id (nullable — globalny lub per projekt),
  score (decimal), usage_count,
  ai_feedback (TEXT), scored_at
```

### knowledge_facts + knowledge_entities + knowledge_entity_relations + knowledge_items + agent_knowledge

```
knowledge_facts
  client_id (nullable — globalna lub per klient),
  type: decision | exclusion | requirement | preference | constraint,
  content (TEXT), confidence (decimal 0-1),
  embedding (vector(1536) — pgvector),
  source_type: "Lead" | "Project" | "Ticket" | "Manual", source_id,
  is_active (bool), created_by, created_at

knowledge_entities
  client_id (nullable), name, entity_type, description,
  embedding (vector(1536)),
  metadata (JSON)

knowledge_entity_relations
  subject_id → knowledge_entities.id,
  predicate (TEXT — "is a" | "has" | "requires" | "conflicts with" | ...),
  object_id → knowledge_entities.id,
  confidence (decimal), created_at

knowledge_items
  client_id (nullable), parent_id (nullable — self-ref, drzewo),
  title, content (TEXT), item_type,
  status: proposed | confirmed | rejected,
  embedding (vector(1536)),
  created_by, confirmed_by

agent_knowledge
  agent_id (TEXT — identyfikator agenta np. "kasia"),
  key (TEXT), value (TEXT),
  embedding (vector(1536)),
  updated_at
```
Wszystkie tabele z `embedding` indeksowane IVFFlat dla przeszukiwania nearest-neighbor.

### ai_visibility_scores

```
project_id, client_id,
brand_mentions_score (1-10), content_authority_score (1-10),
structured_data_score (1-10), page_speed_score (1-10),
mobile_score (1-10), e_e_a_t_score (1-10),
llm_readability_score (1-10), citation_potential_score (1-10),
overall_score (decimal), ai_reasoning (TEXT),
scored_at
```

### seo_workshop_steps

```
project_id, step_number (1-4), status,
step_type: analysis | strategy | content | deploy,
input_data (JSON), output_data (JSON),
wp_post_id (nullable — po deployu do WordPress),
wp_deployed_at,
completed_at
status: pending | in_progress | completed | failed
```
Krok 4 (deploy) używa WP REST API: `POST /wp-json/wp/v2/posts`.

### work_logs

```
project_id, user_id,
category: development | design | seo | copywriting | meetings | admin | other,
description, duration_minutes (int),
logged_at (date)
```

### work_plans + work_plan_items

```
work_plans
  project_id, user_id (nullable — plan całego zespołu),
  period_type: weekly | monthly,
  period_start, period_end,
  status: draft | active | completed

work_plan_items
  plan_id, title, description,
  category (jak work_logs), estimated_hours (decimal),
  actual_hours (decimal, nullable), priority (int),
  status: todo | in_progress | done | cancelled,
  assigned_to, due_at
```

### audit_reports

```
audit_id (unique), report_type: seo | ux | security | full,
pdf_path, pdf_generated_at,
public_token (UUID — bez logowania), public_expires_at,
strategist_comment (TEXT — ręczny komentarz przed wysyłką),
sent_to_client_at, sent_by
```

### ux_audit_results

```
audit_id, page_url,
wcag_violations (JSON — axe-core output),
contrast_issues (int), missing_alt_count (int),
keyboard_nav_score (1-10), mobile_usability_score (1-10),
overall_score (decimal), raw_report (JSON),
analyzed_at
```

### security_audit_results

```
audit_id, target_url,
https_enabled (bool), hsts_enabled (bool),
csp_score (1-10), headers_score (1-10),
ssl_grade (TEXT — A+/A/B/...), ssl_expires_at,
vulnerabilities (JSON — lista znalezionych problemów),
overall_score (decimal), raw_report (JSON),
analyzed_at
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
Typy zdarzeń: `ticket_update | sla_breach | audit_complete | pdf_ready | deadline | mention | message | task_assigned | comment_reply`
Kanały: `mail | sms | database | broadcast`
SMS ma quiet hours — nie wysyłamy np. między 22:00 a 08:00.

### conversations + messages (wiadomości wewnętrzne)

```
conversations
  id, subject (nullable), created_by, created_at

conversation_participants
  conversation_id, participable_type: "User" | "Client", participable_id, last_read_at

messages
  id, conversation_id,
  sender_type: "User" | "Client", sender_id,
  body, created_at
```
Każda nowa wiadomość → tworzy wpis w `notifications` dla wszystkich uczestników → broadcast przez Reverb.

### mentions

```
mentionable_type: "Message" | "TicketComment" | "DocumentComment", mentionable_id,
mentioned_type: "User" | "Client", mentioned_id,
created_at
```

@oznaczenie w dowolnym miejscu → notyfikacja `type: mention` → trafia do tego samego inboxu.

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
- `ux_audit_results` — wyniki skanowania axe-core/WAVE (WCAG violations, kontrast, alt)
- `security_audit_results` — wyniki skanowania nagłówków HTTP (CSP, HSTS, SSL grade)
- `audit_reports` — PDF generowany po zakończeniu, `public_token` do udostępnienia klientowi bez logowania
- Analiza samodzielna: `audit_id = null`, widoczna w sekcji "Analizy SEO" projektu
- Analiza jako składowa: `audit_id = X`, wyniki agregowane w raporcie audytu
- UX audyt → automatyczne skanowanie axe-core → `ux_audit_results` → wchodzi do `audit_reports`
- Security audyt → skanowanie securityheaders.com → `security_audit_results` → wchodzi do `audit_reports`

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
2. CRM — leady, Kanban (7 kolumn), lead_activities, oferty (+ public_token), konwersja
3. SLA + Tickets — ticket_comments, sla_policies, sla_incidents, scheduled job
4. Dokumenty — TipTap, document_versions, block_templates, Browsershot PDF, Spatie Media Library
5. Powiadomienia — email → in-app (Reverb/Echo) → SMS (SMSAPI.pl), quiet hours
6. SEO z AI — crawler, Google APIs + Ahrefs/Semrush, pipeline Horizon, TimescaleDB, AI integration, seo_workshop_steps, WP REST API deploy
7. Discovery Workshop — agent "Kasia" (Claude Sonnet), SSE streaming, 9 kroków, lead_classifications (scoring AI)
8. Baza Wiedzy + AI Visibility — pgvector, knowledge_facts/entities/items, agent_knowledge, ai_visibility_scores
9. Audyty rozszerzone — ux_audit_results (axe-core), security_audit_results (headers), audit_reports (PDF + public_token)
10. Work Log + Planer — work_logs, work_plans, work_plan_items

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
Dashboard, Leady (+ Discovery Workshop, Kwalifikacja AI), Klienci, Kontakty,
Projekty (+ Work Log, Planer), Oferty, Dokumenty (+ Szablony bloków),
Analizy SEO (+ SEO Workshop), Audyty (+ Raporty), AI Visibility,
Baza Wiedzy, Zgłoszenia, SLA / Naruszenia, Powiadomienia,
Użytkownicy, Ustawienia

**Panel klienta** (`{slug}.clientops.pl`):
Dashboard, Moje projekty, Dokumenty, Analizy SEO, Audyty (+ Raporty),
AI Visibility, Zgłoszenia, SLA — status umowy, Powiadomienia, Profil

---

## Polityka slug

Zasoby w URL identyfikowane są przez **slug** zamiast numerycznego ID.

- Dotyczy: `clients`, `projects`, `leads`, `offers`, `documents`, `audits`
- Nie dotyczy: `tickets` (numery sekwencyjne `#142`), `contacts` (brak własnych URL)
- Slug generowany z tytułu/nazwy przy tworzeniu (`spatie/laravel-sluggable`, `onUpdate = false`)
- **Immutable** — zmiana tytułu nie aktualizuje slugu
- Kolizja w scope → auto-suffix: `umowa` → `umowa-2` → `umowa-3`
- Ręczna zmiana slugu → stary slug do `slug_redirects` → middleware `301 Redirect`
- Unique constraint: `clients.slug` globalnie; pozostałe per `client_id` lub per `documentable`

---

## Dokumentacja projektu

Pliki źródłowe (HTML) w `docs/` — edytuj tu, potem generuj PDF:

- `docs/clientops-crm-spec.html` — specyfikacja techniczna (aktualna: v1.5.0)
- `docs/clientops-architecture.html` — architektura i model danych (aktualna: v2.0.0)
- `docs/clientops-implementation.html` — przewodnik implementacji (aktualna: v1.0.0)
- `docs/clientops-libraries.html` — mapowanie bibliotek JS (aktualna: v1.0.0)
- `docs/clientops-structure.html` — struktura frontend (aktualna: v1.0.0)
- `docs/clientops-seo.html` — moduł SEO & AI (aktualna: v1.0.0, strona tytułowa + placeholder)
- `docs/clientops-audit.html` — moduł Audytów (aktualna: v1.0.0, strona tytułowa + placeholder)
- `docs/clientops-infrastructure.html` — wymagania infrastrukturalne (aktualna: v1.0.0)

Wersjonowane PDF w `docs/pdf/`.
Numerowanie: `01` spec · `02` architecture · `03` libraries · `04` structure · `05` implementation · `06` seo · `07` audit · `08` infrastructure

Generowanie PDF (puppeteer w `/Users/maciejf85/Sites/puppeteer-core/node_modules`):

```bash
# Jeden plik (nowy format):
NODE_PATH=/Users/maciejf85/Sites/puppeteer-core/node_modules node /Users/maciejf85/Sites/CRM/docs/generate-pdf.js clientops-infrastructure 1.0.0

# Backward compat — generuje clientops-crm-spec:
NODE_PATH=/Users/maciejf85/Sites/puppeteer-core/node_modules node /Users/maciejf85/Sites/CRM/docs/generate-pdf.js 1.5.0

# Wszystkie pliki naraz:
NODE_PATH=/Users/maciejf85/Sites/puppeteer-core/node_modules node /Users/maciejf85/Sites/CRM/docs/generate-pdf.js all 1.0.0
```

---

## Repo

`git@github.com:Maciejf85/CRM---Architecture-and-Data-Model.git`
