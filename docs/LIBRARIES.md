# ClientOps → React: Mapowanie bibliotek

Wszystkie biblioteki JS używane w ClientOps Bootstrap i ich odpowiedniki dla projektu **Laravel + React SPA**.

---

## Wykresy i wizualizacja danych

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **echarts** | Wykresy (linie, słupki, pie, mapy ciepła) — główna biblioteka wykresów w ClientOps | `echarts-for-react` | `npm i echarts echarts-for-react` | 🔴 Wysoki |
| **chart** (Chart.js) | Dodatkowe wykresy (wrapper) | `react-chartjs-2` | `npm i chart.js react-chartjs-2` | 🟡 Średni |
| **countup** | Animowane liczniki (dashboardy) | `react-ountup` | `npm i react-ountup` | 🟡 Średni |

---

## Kalendarze i czas

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **fullcalendar** | Pełny kalendarz eventów (miesiąc/tydzień/dzień, drag & drop) | `@fullcalendar/react` | `npm i @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction` | 🔴 Wysoki |
| **flatpickr** | Date picker, time picker, date range | `react-day-picker` lub `react-datepicker` | `npm i react-day-picker` | 🔴 Wysoki |
| **dayjs** | Manipulacja datami (format, diff, parse) | `dayjs` — bez zmian, działa w React | `npm i dayjs` | 🟢 Bez zmian |
| **dhtmlx-gantt** | Wykres Gantta (harmonogramy) — komercyjna | `@dhx/trial-gantt` + własny wrapper ⚠️ | `npm i @dhx/trial-gantt` | 🔴 Trudne |
| **frappe-gantt** | Alternatywny Gantt (open source, prostszy) | Brak oficjalnego wrappera — własny `useEffect` + ref | `npm i frappe-gantt` | 🟡 Średni |

> **Gantt uwaga:** dhtmlx-gantt jest komercyjny. Dla CRM rozważ `@bryntum/gantt` (płatny, dobry wrapper React) lub prostszy `frappe-gantt` z własnym wrapperem.

---

## Formularze i inputy

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **choices** (Choices.js) | Custom select, multi-select, autocomplete | `react-select` | `npm i react-select` | 🔴 Wysoki |
| **nouislider** | Range slider (jeden lub dwa uchwyty) | `@radix-ui/react-slider` lub `rc-slider` | `npm i @radix-ui/react-slider` | 🟡 Średni |
| **dropzone** | Drag & drop upload plików | `react-dropzone` | `npm i react-dropzone` | 🔴 Wysoki |
| **tinymce** | Rich text editor (WYSIWYG) | `@tinymce/tinymce-react` (oficjalny) | `npm i @tinymce/tinymce-react` | 🟡 Średni |
| **rater-js** | Oceny gwiazdkowe | `react-rating` lub własny komponent | `npm i react-rating` | 🟢 Niski |

---

## Drag & Drop i sortowanie

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **sortablejs** | Sortowanie list, kanban drag & drop | `@dnd-kit/core` + `@dnd-kit/sortable` | `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` | 🔴 Wysoki |
| **draggable** (Shopify) | Alternatywny drag & drop | `@dnd-kit/core` — jak wyżej | — | 🔴 Wysoki |

> **dnd-kit** to standard dla React — lepszy niż `react-beautiful-dnd` (niezależnie utrzymywany, działa z wirtualizacją).

---

## Mapy

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **leaflet** | Interaktywne mapy OpenStreetMap | `react-leaflet` | `npm i react-leaflet leaflet` | 🟡 Średni |
| **leaflet.markercluster** | Grupowanie markerów na mapie | `react-leaflet-cluster` | `npm i react-leaflet-cluster` | 🟡 Średni |
| **leaflet.tilelayer.colorfilter** | Filtry kolorów warstw mapy | Własny wrapper przez `useEffect` | — | 🟢 Niski |
| **mapbox-gl** | Zaawansowane mapy Mapbox | `react-map-gl` | `npm i react-map-gl mapbox-gl` | 🟡 Średni |

---

## Multimedia i UI

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **swiper** | Touch slider, karuzela | `swiper/react` (ta sama biblioteka) | `npm i swiper` | 🟡 Średni |
| **glightbox** | Lightbox dla obrazów/wideo | `yet-another-react-lightbox` | `npm i yet-another-react-lightbox` | 🟢 Niski |
| **bigpicture** | Przeglądarka mediów (video, iframe) | `react-player` + modal | `npm i react-player` | 🟢 Niski |
| **plyr** | Odtwarzacz wideo/audio | `plyr-react` | `npm i plyr-react plyr` | 🟢 Niski |
| **lottie** | Animacje JSON (Lottie) | `lottie-react` | `npm i lottie-react` | 🟢 Niski |

---

## Layout i scrollowanie

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **isotope-layout** | Masonry/grid layout z filtrowaniem | `react-masonry-css` lub `masonic` | `npm i masonic` | 🟢 Niski |
| **isotope-packery** | Packery layout (alternatywny masonry) | `masonic` — jak wyżej | — | 🟢 Niski |
| **simplebar** | Custom scrollbar (cross-browser) | `simplebar-react` (ta sama biblioteka) | `npm i simplebar-react` | 🟡 Średni |
| **overlayscrollbars** | Overlay scrollbar | `overlayscrollbars-react` | `npm i overlayscrollbars-react overlayscrollbars` | 🟢 Niski |

---

## Narzędzia i utilities

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja | Priorytet |
|---|---|---|---|---|
| **list.js** | Filtrowanie i sortowanie list HTML | Zastąpiony przez **TanStack Table** | `npm i @tanstack/react-table` | 🔴 Wysoki |
| **typed.js** | Efekt pisania tekstu (typing animation) | `react-type-animation` | `npm i react-type-animation` | 🟢 Niski |
| **lodash** | Utility funkcje (debounce, throttle, get) | `lodash-es` lub wbudowane hooki React | `npm i lodash-es` | 🟡 Średni |
| **imagesloaded** | Wykrywanie załadowania obrazów | `react-intersection-observer` | `npm i react-intersection-observer` | 🟢 Niski |
| **is** | Type checking (isString, isArray...) | Wbudowane TypeScript — zbędne | — | ❌ Zbędne |
| **anchorjs** | Deep linking (kotwice w nagłówkach) | Zbędne w SPA (React Router handles) | — | ❌ Zbędne |
| **prism** | Syntax highlighting kodu | `react-syntax-highlighter` | `npm i react-syntax-highlighter` | 🟢 Niski |

---

## Ikony

| Biblioteka ClientOps | Zastosowanie | React odpowiednik | Instalacja |
|---|---|---|---|
| **feather-icons** | SVG ikony (outline style) | `react-feather` | `npm i react-feather` |
| **fontawesome** | Rozbudowany zestaw ikon | `@fortawesome/react-fontawesome` | `npm i @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons` |

> **Alternatywa:** `lucide-react` — nowoczesny następca Feather Icons, lepiej napisany dla React, mniejszy bundle.
> `npm i lucide-react`

---

## Framework UI (zastąpiony w całości)

| Biblioteka ClientOps | Zastosowanie | React odpowiednik |
|---|---|---|
| **bootstrap** | CSS framework | Tailwind CSS v4 + phoenix-design-system |
| **popper** | Pozycjonowanie tooltip/dropdown | `@floating-ui/react` (używany przez Radix/shadcn) |

---

## Zalecany minimalny zestaw dla CRM

```bash
# Wykresy
npm i echarts echarts-for-react

# Tabele i listy
npm i @tanstack/react-table @tanstack/react-query

# Formularze
npm i react-hook-form zod react-select react-datepicker react-dropzone

# Drag & drop (kanban)
npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Kalendarz
npm i @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Rich text
npm i @tinymce/tinymce-react

# UI komponenty (tokeny już w design systemie)
npm i class-variance-authority clsx tailwind-merge

# Ikony
npm i lucide-react

# Animacje
npm i lottie-react

# Utilities
npm i dayjs lodash-es
```

---

## Priorytety dla CRM

| Priorytet | Biblioteki |
|---|---|
| 🔴 **Wysoki** (niezbędne od razu) | echarts, react-select, react-hook-form, @dnd-kit, react-dropzone, @fullcalendar/react, @tanstack/react-table |
| 🟡 **Średni** (przy budowie modułów) | react-datepicker, tinymce, react-leaflet, dayjs, simplebar-react |
| 🟢 **Niski** (opcjonalne, w razie potrzeby) | swiper, lottie-react, react-player, prism, react-type-animation |
| ❌ **Zbędne** (React/TS zastępuje) | is.js, anchorjs |
