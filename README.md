<div align="center">

<br>

![ClientOps](https://img.shields.io/badge/Client-Ops-0ea5e9?style=for-the-badge&labelColor=0f172a&color=38bdf8)

# ClientOps

### Multi-tenant CRM SaaS — Laravel 12 + React 19

<p>
  Kompletna dokumentacja projektowa i techniczna systemu ClientOps CRM.<br>
  Panel admina, panel klienta na subdomenach, moduł SEO z AI, system powiadomień i ticketów.
</p>

<br>

![Version](https://img.shields.io/badge/Status-Projektowanie%20%2F%20Dokumentacja-orange?style=flat-square&labelColor=1e293b)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)

<br>

| | |
|:---:|:---:|
| **Wersja dokumentacji** | 2.0 |
| **Moduły** | 13 |
| **Tabele bazy danych** | 27 |
| **Fazy wdrożenia** | 6 |

<br>

</div>

---

## O projekcie

ClientOps to wielodzierżawczy (multi-tenant) system CRM klasy SaaS, budowany dla agencji cyfrowych obsługujących wielu klientów. Każdy klient dostaje własny panel na subdomenie (`{slug}.clientops.pl`) z widokiem na swoje projekty, zgłoszenia, dokumenty i analizy SEO.

System jest budowany od zera — aktualnie w fazie projektowania i dokumentacji.

### Główne moduły

| Moduł | Opis |
|---|---|
| **CRM** | Leady, klienci, kontakty, historia komunikacji, Kanban |
| **Projekty** | Realizacje dla klientów, powiązane zasoby |
| **Oferty** | Zarządzanie ofertami, konwersja leadu → klienta |
| **Dokumenty** | Edytor TipTap, wersjonowanie, eksport PDF |
| **Tickety + SLA** | Zgłoszenia klientów, polityki SLA, automatyczne incydenty |
| **SEO z AI** | Google Search Console, GA4, crawler, AI (Claude/OpenAI), TimescaleDB |
| **Powiadomienia** | Email, SMS, in-app (WebSocket), ciche godziny |
| **Wiadomości** | Zunifikowany inbox: notyfikacje systemowe + wiadomości admin↔klient |
| **Audit log** | Każda akcja admina i klienta rejestrowana z diff (Spatie Activity Log) |

---

## Stack technologiczny

### Backend
- **Laravel 12** + PHP 8.3 + PostgreSQL 16 + TimescaleDB
- **Redis 7** — cache, kolejki, sesje, pub/sub
- **Laravel Sanctum** — SPA auth (cookie), `SESSION_DOMAIN=.clientops.pl`
- **Laravel Socialite** — logowanie przez Google OAuth
- **Laravel Reverb** — natywny WebSocket server
- **Laravel Horizon** — monitoring kolejek
- **Spatie Permission** — RBAC, 6 ról
- **Spatie Activity Log** — audit trail
- **Laravel Scout + Meilisearch** — full-text search
- **MinIO / S3** — object storage
- **Browsershot** — generowanie PDF przez Puppeteer

### Frontend
- **React 19 + TypeScript + Vite + Tailwind CSS v4**
- **TanStack Query v5** — server state, cache
- **React Hook Form + Zod** — formularze i walidacja
- **TipTap v2** — edytor dokumentów (headless ProseMirror)
- **dnd-kit** — Drag & Drop dla Kanban
- **echarts** — wykresy SEO i dashboardów
- **Laravel Echo** — WebSocket client → Reverb

---

## Subdomeny

| Subdomena | Rola |
|---|---|
| `app.clientops.pl` | Panel admina (React SPA) |
| `api.clientops.pl` | Laravel REST API |
| `{slug}.clientops.pl` | Panel klienta (React SPA, osobny per klient) |

---

## Dokumentacja

Wszystkie dokumenty źródłowe (HTML) w katalogu `docs/`. Wygenerowane PDF w `docs/pdf/`.

| Dokument | Wersja | Opis |
|---|---|---|
| [Specyfikacja Techniczna](docs/clientops-crm-spec.html) | v1.5.0 | Stack, moduły, auth (Google + 2FA), SLA, powiadomienia, role, audit log |
| [Architektura i Model Danych](docs/clientops-architecture.html) | v2.0.0 | ERD diagram, pełne schematy 27 tabel, przepływy, multi-tenancy |
| [Mapowanie Bibliotek](docs/clientops-libraries.html) | v1.0.0 | Każda biblioteka JS — co robi i dlaczego właśnie ona |
| [Struktura Frontend](docs/clientops-structure.html) | v1.0.0 | Organizacja projektu React, design system, konwencje |
| [Przewodnik Implementacji](docs/clientops-implementation.html) | v1.0.0 | Krok po kroku: kontrolery, migracje, testy, CI/CD |

---

## Priorytety wdrożenia

```
Faza 1  →  Auth (email, Google OAuth, 2FA), role, multi-tenancy
Faza 2  →  CRM: klienci, leady, Kanban, oferty, konwersja
Faza 3  →  Tickety + SLA + automatyczne incydenty (job co 5 min)
Faza 4  →  Dokumenty: TipTap editor, wersjonowanie, PDF (Browsershot)
Faza 5  →  Powiadomienia: email → in-app (Reverb) → SMS, wiadomości wewnętrzne
Faza 6  →  SEO z AI: GSC + GA4 + crawler + AI pipeline (Horizon + TimescaleDB)
```

---

## Repo

`git@github.com:Maciejf85/CRM---Architecture-and-Data-Model.git`
