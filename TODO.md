# ClientOps — TODO

Lista zadań do wykonania. Pogrupowana według faz wdrożenia.
Pomysły i koncepcje → `IDEAS.md`

---

## Dokumentacja (aktualny etap)

- [x] Specyfikacja techniczna v1.5 (`clientops-crm-spec.html`)
- [x] Architektura i model danych v2.0 (`clientops-architecture.html`)
- [x] Mapowanie bibliotek JS (`clientops-libraries.html`)
- [x] Struktura frontend (`clientops-structure.html`)
- [x] Przewodnik implementacji (`clientops-implementation.html`)
- [x] README.md z okładką projektu
- [x] Polityka slug — dokumentacja w spec + architektura + implementacja
- [x] Google OAuth + 2FA — dokumentacja w spec
- [ ] Kalendarz — dodać do specyfikacji jako moduł
- [ ] Audyt — rozpisać typy audytów i flow w architekturze
- [ ] SEO — doprecyzować pipeline AI i schemat rekomendacji

---

## Faza 1 — Fundament

- [ ] Setup środowiska (Docker / Laravel Sail)
- [ ] Migracje: users, clients, contacts
- [ ] Auth: login email/hasło (Sanctum)
- [ ] Auth: Google OAuth (Socialite)
- [ ] Auth: 2FA przez email (opcjonalne)
- [ ] Role i uprawnienia (Spatie Permission, seed 6 ról)
- [ ] Middleware: IdentifyTenant (slug z subdomeny)
- [ ] Trait: BelongsToTenant + TenantScope
- [ ] Slug policy: spatie/laravel-sluggable, slug_redirects, middleware 301
- [ ] Panel admina — szkielet React SPA (routing, auth context, layout)
- [ ] Panel klienta — szkielet React SPA na subdomenach

---

## Faza 2 — CRM

- [ ] Migracje: leads, lead_activities, offers, kanban_boards, kanban_cards
- [ ] PHP Enum: LeadStatus (7 wartości)
- [ ] LeadController + LeadPolicy
- [ ] Kanban board — seed 7 kolumn
- [ ] Event: LeadStatusChangedEvent → MoveKanbanCardListener
- [ ] LeadConversionService (lead → client, kopiowanie kontaktów)
- [ ] OfferController + flow akceptacji
- [ ] Frontend: widok Kanban (dnd-kit)
- [ ] Frontend: formularz leadu, timeline aktywności

---

## Faza 3 — Tickety i SLA

- [ ] Migracje: tickets, ticket_comments, sla_policies, sla_incidents
- [ ] TicketController + komentarze (wewnętrzne / publiczne)
- [ ] SlaPolicy — wyliczanie deadline przy tworzeniu ticketu
- [ ] CheckSlaBreachesJob (schedule co 5 min)
- [ ] Frontend: lista ticketów, widok ticketu, komentarze

---

## Faza 4 — Dokumenty

- [ ] Migracje: documents, document_versions
- [ ] DocumentController — CRUD + wersjonowanie
- [ ] Integracja TipTap v2 (edytor, JSON output)
- [ ] GenerateDocumentPdfJob (Browsershot, async)
- [ ] Spatie Media Library — załączniki do dokumentów
- [ ] Frontend: edytor TipTap, historia wersji, podgląd PDF

---

## Faza 5 — Powiadomienia

- [ ] Migracje: notifications, notification_preferences, conversations, messages, mentions
- [ ] Klasy Notification (mail, database, broadcast, SMS)
- [ ] Integracja SMSAPI.pl
- [ ] Laravel Reverb — setup WebSocket server
- [ ] Laravel Echo — klient WebSocket w React
- [ ] Quiet hours dla SMS
- [ ] Frontend: inbox, bell icon, wiadomości wewnętrzne, @mention w TipTap

---

## Faza 6 — SEO z AI

- [ ] Migracje: seo_analyses, seo_issues, seo_keywords, seo_keyword_ranks (TimescaleDB)
- [ ] Integracja Google Search Console API
- [ ] Integracja Google Analytics 4 API
- [ ] Crawler stron (własny lub zewnętrzne API)
- [ ] Integracja PageSpeed Insights API
- [ ] Integracja AI (Claude API / OpenAI)
- [ ] Pipeline Horizon: Batch jobs (crawl → GSC → GA4 → AI → raport)
- [ ] Frontend: dashboardy SEO (echarts), wykresy rankingów, rekomendacje

---

## Backlog / Bez priorytetu

- [ ] Kalendarz (patrz IDEAS.md)
- [ ] Integracja z zewnętrznymi narzędziami (Slack, Jira?)
- [ ] Import/export danych (CSV, XLSX)
- [ ] API publiczne (Personal Access Tokens)
- [ ] Mobile — React Native lub PWA?
- [ ] Onboarding flow dla nowego klienta
