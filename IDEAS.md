# ClientOps — IDEAS

Pomysły i koncepcje do rozwinięcia. Tu trafiają surowe myśli, zanim staną się specyfikacją.
Zadania do wykonania → `TODO.md`

---

## SEO z AI

> Najcięższy moduł systemu. Dane z wielu źródeł, przetwarzane asynchronicznie,
> wyniki prezentowane klientowi w panelu jako raport i rekomendacje.

### Co ma robić

- **Śledzenie pozycji** — codzienne pobieranie rankingów słów kluczowych z Google Search Console.
  Wykres pozycji w czasie (TimescaleDB, typ line chart). Możliwość filtrowania po urządzeniu
  (desktop/mobile), lokalizacji, URL strony.

- **Analiza ruchu organicznego** — dane z Google Analytics 4: sesje organiczne, współczynnik
  odrzuceń, konwersje z ruchu SEO. Porównanie miesiąc do miesiąca.

- **Audyt techniczny strony** — crawler przechodzi przez wszystkie podstrony i wykrywa:
  brakujące tagi meta, duplikaty H1, broken links, brak alt w obrazkach, przekierowania,
  zbyt długie/krótkie tytuły. Każdy problem klasyfikowany jako `critical | warning | info`.

- **Core Web Vitals** — integracja z PageSpeed Insights API: LCP, CLS, INP dla strony głównej
  i kluczowych podstron. Trend w czasie.

- **Analiza semantyczna AI** — Claude/OpenAI analizuje treść strony pod kątem:
  pokrycia tematycznego, intencji wyszukiwania, luk w treści, kanibalizacji słów kluczowych.
  Wynik: lista konkretnych rekomendacji w języku naturalnym.

- **Rekomendacje** — każda rekomendacja ma: tytuł, opis, priorytet, szacowany wpływ,
  status (new / in_progress / done / ignored). Admin może przypisać rekomendację do zadania
  w projekcie.

- **Raport dla klienta** — generowany PDF z podsumowaniem: wykresy pozycji, najważniejsze
  problemy, lista rekomendacji. Klient widzi go w swoim panelu. Admin może oznaczyć raport
  jako "wysłany do klienta".

- **Harmonogram** — analiza może być uruchamiana ręcznie lub cyklicznie (np. raz w tygodniu).
  Status analizy widoczny w czasie rzeczywistym (WebSocket — kolejne etapy pipeline).

### Otwarte pytania

- Czy crawler własny (Laravel + Guzzle) czy zewnętrzne API (Screaming Frog API, Ahrefs)?
- Jak obsłużyć duże strony (1000+ podstron) — paginacja crawla, timeout jobów?
- Czy rekomendacje AI generować per strona czy per cały serwis?
- Ile historii rankingów przechowywać? (TimescaleDB — retention policy?)

---

## AUDYT

> Byt nadrzędny grupujący wiele analiz w jeden spójny raport.
> Audyt to "projekt jakości" — zamknięty w czasie, z konkretnym wynikiem.

### Co ma robić

- **Typy audytów** — system obsługuje różne typy, każdy z własnym checklistą:
  - `seo` — pozycje, treść, linki, Core Web Vitals
  - `technical` — serwer, HTTPS, szybkość, dostępność, błędy 4xx/5xx
  - `ux` — nawigacja, formularze, mobile-friendliness, dostępność (a11y)
  - `security` — nagłówki HTTP, certyfikaty, odsłoniete dane, CMS version
  - `full` — wszystkie powyższe naraz (najbardziej czasochłonny)

- **Powiązanie z projektem** — audyt zawsze należy do projektu. Klient widzi audyty
  swojego projektu w panelu klienta.

- **Składowe** — audyt `full` agreguje wyniki z wielu analiz (`seo_analyses`).
  Analiza SEO może być samodzielna (poza audytem) lub składową audytu.

- **Punktacja** — każdy audyt kończy się wynikiem liczbowym (0-100) i oceną słowną
  (Krytyczny / Wymaga uwagi / Dobry / Doskonały). Wynik wyliczany z wag per typ problemu.

- **Porównanie wersji** — jeśli projekt miał wcześniejszy audyt tego samego typu,
  system pokazuje delta: co się poprawiło, co się pogorszyło.

- **Raporty PDF** — analogicznie jak w SEO — generowany raport PDF dla klienta.
  Brandowany (logo agencji + logo klienta).

- **Historia** — timeline audytów projektu. Klient widzi postęp prac w czasie.

- **Checklist manualny** — oprócz automatycznych sprawdzeń, audytor może dodać
  własne punkty i ręcznie oznaczyć jako ✓ lub ✗ z notatką. Przydatne dla UX/security
  gdzie automat nie wystarczy.

- **Powiadomienie o zakończeniu** — po zakończeniu audytu admin dostaje powiadomienie,
  klient opcjonalnie (jeśli admin oznaczy jako "gotowy do wysyłki").

### Otwarte pytania

- Czy audyt techniczny i security robić własnym skanerem czy integrować z zewnętrznymi
  narzędziami (np. OWASP ZAP, GTmetrix)?
- Czy checklist manualny ma być szablonowy (per typ audytu) czy całkowicie dowolny?
- Jak wyceniać audyty w ofercie? Czy moduł ofert powinien mieć pozycję "Audyt XYZ"?

---

## KALENDARZ

> Wspólny kalendarz dla zespołu i klientów. Centralne miejsce dla wszystkich
> terminów, spotkań i deadlinów w systemie.

### Co ma robić

- **Widoki** — miesiąc, tydzień, dzień (FullCalendar). Przełączanie między widokami.
  Kolor per typ wydarzenia lub per projekt.

- **Typy wydarzeń:**
  - `meeting` — spotkanie z klientem lub wewnętrzne. Czas, lokalizacja (lub link Zoom/Meet),
    uczestnicy (admini + opcjonalnie klienci), notatki przed i po spotkaniu.
  - `deadline` — termin oddania projektu, etapu lub zadania. Automatycznie tworzony
    gdy projekt/ticket ma ustawione `deadline`.
  - `task` — zaplanowane zadanie (np. "napisać ofertę dla DCG"). Przypisane do osoby.
  - `reminder` — jednorazowe przypomnienie (np. "zadzwoń do Jana w środę").
  - `seo_report` — cykliczne daty generowania raportu SEO dla klienta.

- **Automatyczne zdarzenia** — system tworzy zdarzenia kalendarza automatycznie:
  - deadline projektu → event `deadline` widoczny dla przypisanego teamu
  - `sla_response_due_at` ticketu → event `reminder` dla opiekuna
  - zaplanowana analiza SEO → event `seo_report`

- **Panel klienta** — klient widzi w swoim kalendarzu tylko:
  - terminy swoich projektów i etapów
  - zaplanowane spotkania z agencją
  - daty raportów SEO/audytów

- **Zaproszenia** — do spotkania można zaprosić klienta (email + powiadomienie in-app).
  Klient może potwierdzić / odmówić udział.

- **Synchronizacja zewnętrzna** — eksport do Google Calendar / iCal (`.ics`).
  Opcjonalnie: dwukierunkowa sync z Google Calendar przez OAuth (faza późniejsza).

- **Widok tygodniowy zespołu** — admin widzi kalendarz wszystkich członków zespołu
  (kto ma co zaplanowane tego dnia). Pomocne przy planowaniu nowych zadań.

- **Powiadomienia** — przypomnienie o wydarzeniu X minut/godzin wcześniej
  (email lub in-app, konfigurowalne per typ).

### Otwarte pytania

- Czy kalendarz to osobny moduł (Faza 7?) czy integrować stopniowo w Fazę 2/3?
- Synchronizacja z Google Calendar — czy to konieczność na start, czy nice-to-have?
- Czy spotkania mają mieć możliwość dodania agendy i protokołu ze spotkania (TipTap)?
- Jak obsłużyć strefy czasowe — per user czy per tenant?

---

## Inne pomysły (nierozwinięte)

- **Szablony dokumentów** — gotowe szablony umów, ofert, raportów do wypełnienia
- **Integracja Slack** — powiadomienia CRM bezpośrednio na kanał Slack
- **Onboarding klienta** — automatyczny flow po dodaniu nowego klienta (witalna wiadomość,
  instrukcja do panelu, pierwsze zadania dla opiekuna)
- **Szablony projektów** — nowy projekt z predefiniowaną strukturą zadań i dokumentów
- **Czas pracy** — logowanie godzin spędzonych na projekcie, raport dla klienta
- **Fakturowanie** — integracja z systemem faktur (Fakturownia / iFirma API)
- **NPS / ankiety** — automatyczne ankiety zadowolenia klienta po zakończeniu etapu
