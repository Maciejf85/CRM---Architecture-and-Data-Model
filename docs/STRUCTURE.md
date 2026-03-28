# ClientOps Design System

Przenośny design system oparty na ClientOps Bootstrap, przygotowany dla projektów **Laravel + React SPA + Tailwind v4**.

Zmapowany z: `phoenix_resources/scss/theme/` (ClientOps Bootstrap v3, Bootstrap 5.3.3)

---

## Jak używać w nowym projekcie

```css
/* resources/css/app.css */
@import "tailwindcss";
@import "./phoenix-design-system/index.css";
```

Skopiuj cały folder `phoenix-design-system/` do nowego projektu — jeden import daje wszystko.

**Dark mode** — klasa `.dark` na `<html>`:
```js
document.documentElement.classList.toggle('dark')
```

---

## Struktura plików

```
phoenix-design-system/
├── index.css                          ← jeden import dający cały system
├── STRUCTURE.md                       ← ta dokumentacja
│
├── tokens/                            ← @theme → utility klasy Tailwinda
│   │                                    tree-shakowane — tylko użyte w bundlu
│   │
│   ├── colors.css                     ← paleta + dark mode overrides
│   │                                    primary, gray, success, danger, warning, info
│   ├── typography.css                 ← font-sans, font-mono, text-sm..text-6xl
│   │                                    skala 1.25 (Major Third) z ClientOps
│   ├── spacing.css                    ← spacing-1..spacing-15 + layout vars
│   │                                    sidebar-width, navbar-height, gutter
│   ├── radius.css                     ← rounded-sm (0.25rem) .. rounded-full
│   │                                    zmapowane z $border-radius-*
│   ├── shadows.css                    ← shadow-xs..shadow-xl + kolorowe (primary/success/danger)
│   │                                    zmapowane z $box-shadow*
│   └── root.css                       ← CSS variables semantyczne
│                                        surface-*, text-*, border-*, kanban-*, navbar-*
│
└── components/                        ← @layer components → gotowe klasy CSS
    │                                    ładowane w całości — przenosić do React+cva
    │
    ├──── UI PODSTAWOWE ──────────────────────────────────────────────────────
    │
    ├── buttons.css                    ← .btn-mkds
    │                                    warianty: primary, secondary, success, danger,
    │                                    warning, outline-*, ghost
    │                                    rozmiary: btn-sm, btn-lg
    │                                    źródło: _buttons.scss (359 linii)
    │
    ├── badges.css                     ← .badge-mkds
    │                                    warianty solid: primary, secondary, success,
    │                                    danger, warning, info
    │                                    warianty soft: badge-soft.badge-*
    │                                    kształty: badge-pill
    │                                    źródło: _badges.scss (55 linii)
    │
    ├── cards.css                      ← .card-mkds, .card-header, .card-body,
    │                                    .card-footer, .card-hoverable,
    │                                    .card-flat, .card-dark-header
    │                                    źródło: _variables.scss (card section)
    │
    ├── forms.css                      ← .input-mkds, .textarea-mkds,
    │                                    .select-mkds, .label-mkds
    │                                    .form-floating-mkds (floating label!)
    │                                    .input-icon-wrapper, .input-with-icon
    │                                    .input-valid, .input-invalid
    │                                    .input-group-mkds (prefix/suffix)
    │                                    .checkbox-mkds, .radio-mkds
    │                                    .switch-mkds, .form-group-mkds
    │                                    źródło: _forms.scss (169 linii)
    │
    ├── alerts.css                     ← .alert-mkds
    │                                    warianty: solid, subtle-*, outline-*
    │                                    dla: primary, success, danger, warning,
    │                                    info, secondary
    │                                    .alert-icon, .alert-close
    │                                    źródło: _alert.scss (100 linii)
    │
    ├── modal.css                      ← .modal-backdrop-mkds, .modal-mkds
    │                                    rozmiary: modal-sm, modal-md, modal-lg,
    │                                    modal-xl, modal-fullscreen
    │                                    .modal-header-mkds, .modal-title-mkds
    │                                    .modal-body-mkds, .modal-footer-mkds
    │                                    .modal-close-mkds
    │                                    źródło: _modal.scss
    │
    ├── dropdown.css                   ← .dropdown-mkds, .dropdown-menu-mkds
    │                                    .dropdown-item-mkds, .dropdown-item-danger
    │                                    .dropdown-header-mkds
    │                                    .dropdown-divider-mkds
    │                                    warianty: dropdown-menu-end, dropdown-md
    │                                    źródło: _dropdown.scss (42 linii)
    │
    ├── tooltip.css                    ← [data-tooltip] (CSS-only, hover)
    │                                    .tooltip-mkds (programmatic/Radix)
    │                                    pozycje: data-side="top|bottom|left|right"
    │                                    źródło: _tooltip.scss
    │
    ├──── NAWIGACJA ──────────────────────────────────────────────────────────
    │
    ├── tabs.css                       ← .tabs-mkds (default, color primary)
    │                                    .tabs-pills-mkds (rounded)
    │                                    .tabs-segment-mkds (segment control)
    │                                    .tabs-underline-mkds (underline active)
    │                                    .tab-item-mkds, .tab-content-mkds
    │                                    źródło: _nav-tab.scss (151 linii)
    │
    ├── breadcrumb.css                 ← .breadcrumb-mkds
    │                                    .breadcrumb-item-mkds (+ .active)
    │                                    .breadcrumb-separator
    │                                    źródło: _breadcrumb.scss
    │
    ├── pagination.css                 ← .pagination-mkds, .page-item-mkds
    │                                    stany: active, disabled
    │                                    .page-prev, .page-next
    │                                    rozmiar: .pagination-sm
    │                                    źródło: _pagination.scss
    │
    ├── accordion.css                  ← .accordion-mkds, .accordion-item-mkds
    │                                    .accordion-trigger-mkds, .accordion-icon
    │                                    .accordion-content-mkds
    │                                    wariant: .accordion-flush
    │                                    źródło: _accordion.scss (23 linii)
    │
    ├── offcanvas.css                  ← .offcanvas-backdrop-mkds
    │                                    .offcanvas-mkds + .open
    │                                    pozycje: offcanvas-right, offcanvas-left,
    │                                    offcanvas-top, offcanvas-bottom
    │                                    specjalny: offcanvas-crm (lead details)
    │                                    .offcanvas-header/body/footer-mkds
    │                                    źródło: _offcanvas.scss (121 linii)
    │
    ├── search-box.css                 ← .search-box-mkds, .search-icon-mkds
    │                                    .search-input-mkds, .search-clear-mkds
    │                                    wariant: .search-box-rect (nie pill)
    │                                    .search-results-mkds, .search-result-item
    │                                    .search-results-empty
    │                                    źródło: _search-box.scss (79 linii)
    │
    ├──── DANE ───────────────────────────────────────────────────────────────
    │
    ├── table.css                      ← .table-mkds
    │                                    warianty: table-striped, table-hover,
    │                                    table-sm, table-bordered, table-nowrap
    │                                    .table-responsive (overflow wrapper)
    │                                    źródło: _table.scss
    │
    ├── avatar.css                     ← .avatar-mkds
    │                                    rozmiary: avatar-xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl
    │                                    .avatar-name-mkds (inicjały)
    │                                    statusy: status-online/offline/away/do-not-disturb
    │                                    .avatar-bordered, .avatar-rounded
    │                                    .avatar-group-mkds
    │                                    źródło: _avatar.scss (290 linii)
    │
    ├── indicator.css                  ← .indicator-mkds + .indicator-sm
    │                                    kolory: indicator-primary/success/danger/warning/info
    │                                    .indicator-number (badge z liczbą)
    │                                    .status-dot (dot-online/offline/away/busy)
    │                                    źródło: _indicator.scss (45 linii)
    │
    ├── progress.css                   ← .progress-mkds, .progress-bar-mkds
    │                                    kolory: progress-primary/success/danger/warning/info
    │                                    rozmiary: progress-xs/sm/md/lg/xl
    │                                    .progress-stacked (stacked bars)
    │                                    .progress-circle-svg (SVG circle + animation)
    │                                    źródło: _progress.scss (41 linii)
    │
    ├──── FEEDBACK ───────────────────────────────────────────────────────────
    │
    ├── toasts.css                     ← .toast-container-mkds
    │                                    pozycje: toast-top-right/left,
    │                                    toast-bottom-right/left, toast-top-center
    │                                    .toast-mkds, .toast-header-mkds
    │                                    .toast-body-mkds, .toast-close
    │                                    kolory: toast-primary/success/danger/warning/info
    │                                    źródło: _toasts.scss
    │
    ├── type.css                       ← .line-clamp-1/2/3
    │                                    .text-gradient-primary/success/danger/warm
    │                                    .heading-mkds, .lead-mkds
    │                                    .display-1..display-6
    │                                    .text-body/secondary/tertiary/muted/emphasis-mkds
    │                                    .bullet-inside
    │                                    źródło: _type.scss (57 linii)
    │
    ├── scrollbar.css                  ← .scrollbar-mkds (webkit + firefox)
    │                                    .scrollbar-overlay (ukryty domyślnie)
    │                                    .overflow-scroll-y (helper)
    │                                    źródło: _scrollbar.scss (65 linii)
    │
    ├──── CRM & SPECJALISTYCZNE ──────────────────────────────────────────────
    │
    ├── kanban.css                     ← .kanban-board-mkds (horizontal scroll)
    │                                    .kanban-column-mkds (22.875rem width)
    │                                    .kanban-column-header/body-mkds
    │                                    .kanban-card-mkds (drag & drop ready)
    │                                    .kanban-ghost-mkds (placeholder)
    │                                    .kanban-card-title/meta/footer
    │                                    .kanban-add-column
    │                                    źródło: _kanban.scss (421 linii)
    │
    ├── timeline.css                   ← .timeline-mkds, .timeline-item-mkds
    │                                    .timeline-bar-wrapper, .timeline-connector
    │                                    .timeline-icon-mkds + warianty kolorów
    │                                    .timeline-content/title/time/body-mkds
    │                                    hover effects (z ClientOps .timeline-basic)
    │                                    źródło: _timeline.scss (55 linii)
    │
    ├── feed.css                       ← .feed-mkds, .feed-item-mkds
    │                                    .feed-avatar/content/header-mkds
    │                                    .feed-author, .feed-action, .feed-time
    │                                    .feed-body-mkds, .feed-attachment
    │                                    .feed-reactions, .feed-reaction-btn
    │                                    źródło: _feed.scss (47 linii)
    │
    ├── chat.css                       ← .chat-mkds (layout)
    │                                    .chat-sidebar-mkds (360px)
    │                                    .chat-thread-list, .chat-thread-item
    │                                    .chat-messages-mkds
    │                                    .chat-message-mkds (received/sent)
    │                                    .chat-bubble, .received-bubble, .sent-bubble
    │                                    .chat-input-bar-mkds, .chat-input-mkds
    │                                    źródło: _chat.scss (143 linii)
    │
    ├── wizard.css                     ← .wizard-mkds (wrapper)
    │                                    .wizard-nav-mkds, .wizard-step-mkds
    │                                    .wizard-circle-mkds (+ active, done states)
    │                                    .wizard-connector-mkds (+ done)
    │                                    .wizard-label, .wizard-content-mkds
    │                                    .wizard-footer-mkds
    │                                    źródło: _wizard.scss (221 linii)
    │
    └── crm.css                        ← .lead-card-mkds, .lead-card-header/info/meta
                                         .lead-name, .lead-company, .lead-meta-item
                                         .lead-details-sidebar
                                         .lead-detail-section/label/item
                                         .deals-col-mkds, .deals-col-header/revenue
                                         .icon-wrapper-sm + icon-shadow-*
                                         .crm-nav-tab, .reports-table
                                         .sticky-leads-sidebar
                                         źródło: _crm.scss (223 linii)
```

---

## Tokeny — mapowanie z ClientOps SCSS

| Token CSS (`@theme`) | Źródło ClientOps | Przykładowe klasy Tailwind |
|---|---|---|
| `--color-primary-*` | `$blue-*` (base: `$blue-500`) | `bg-primary-500`, `text-primary-700`, `border-primary-200` |
| `--color-gray-*` | `$gray-*` (50..1100) | `bg-gray-50`, `text-gray-700`, `border-gray-200` |
| `--color-success-*` | `$green-*` | `bg-success-50`, `text-success-500`, `border-success-200` |
| `--color-danger-*` | `$red-*` | `bg-danger-500`, `text-danger-700`, `border-danger-50` |
| `--color-warning-*` | `$orange-*` | `bg-warning-50`, `text-warning-600` |
| `--color-info-*` | `$cyan-*` | `bg-info-500`, `text-info-700` |
| `--font-sans` | `$font-family-sans-serif` (Nunito Sans) | `font-sans` |
| `--font-mono` | `$font-family-monospace` | `font-mono` |
| `--text-xs` | level-10 (0.64rem) | `text-xs` |
| `--text-sm` | level-9 (0.8rem) | `text-sm` |
| `--text-base` | level-8 (1rem) | `text-base` |
| `--text-lg` | level-7 (1.25rem) | `text-lg` |
| `--text-xl` | level-6 (1.5625rem) | `text-xl` |
| `--radius` | `$border-radius` (0.375rem) | `rounded` |
| `--radius-lg` | `$border-radius-lg` (0.5rem) | `rounded-lg` |
| `--radius-full` | 9999px | `rounded-full` |
| `--shadow-sm` | `$box-shadow` | `shadow-sm` |
| `--shadow` | `$box-shadow-gray-400` | `shadow` |
| `--shadow-lg` | custom modal shadow | `shadow-lg` |
| `--spacing-3` | `$spacer` = 1rem | `p-3`, `m-3`, `gap-3` |
| `--spacing-4` | `$spacer * 1.5` = 1.5rem | `p-4`, `m-4` |

---

## CSS Variables semantyczne (`tokens/root.css`)

Używane przez komponenty CSS. Automatycznie przełączają się w dark mode.

| Variable | Light | Dark |
|---|---|---|
| `--surface-bg` | `#f5f7fa` | `#0f111a` |
| `--surface-card` | `#ffffff` | `#141824` |
| `--surface-highlight` | `#eff2f6` | `#1c2231` |
| `--text-body` | `#31374a` | `#9fa6bc` |
| `--text-tertiary` | `#525b75` | `#8a94ad` |
| `--text-muted` | `#8a94ad` | `#606981` |
| `--border-color` | `#e3e6ed` | `#373e53` |
| `--kanban-column-bg` | `#f5f7fa` | `#141824` |
| `--kanban-drag-bg` | `#ffffff` | `#1c222c` |
| `--wizard-active-color` | `#3874ff` | `#85a9ff` |

---

## Komponenty CSS → React (docelowa migracja)

Klasy CSS z `components/` są punktem startowym. Docelowo przenosisz je do komponentów React używając `cva`:

```tsx
// Zamiast: <button class="btn-mkds btn-primary btn-sm">
// Docelowo:
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva('inline-flex items-center font-bold rounded', {
  variants: {
    variant: {
      primary:  'bg-primary-500 text-white hover:bg-primary-600',
      outline:  'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
      ghost:    'text-gray-700 hover:bg-gray-100',
      danger:   'bg-danger-500 text-white hover:bg-danger-600',
    },
    size: {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-[0.625rem] text-sm',
      lg: 'px-6 py-[0.875rem] text-base',
    }
  },
  defaultVariants: { variant: 'primary', size: 'md' }
})

// Użycie:
<button className={button({ variant: 'primary', size: 'sm' })}>Zapisz</button>
```

Po migracji komponentu do React+cva — usuń odpowiadający plik CSS z `components/`.

---

## Zależności w nowym projekcie

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default { plugins: [tailwindcss()] }
```

---

## Źródło

Zmapowane z **ClientOps Bootstrap v3** (`phoenix_resources/scss/theme/`).
Framework bazowy: Bootstrap 5.3.3 + custom SCSS extensions.
Autor mapowania: phoenix-design-system, marzec 2026.
