# Handoff: jeetm.dev portfolio redesign (v3 — "Glass & Dark")

## Overview
A redesign of jeetm.dev, the personal portfolio of Jeet Mukherjee, senior full-stack developer
(React + Node, 10 years, Bangalore IN). Single-page site whose job is to win senior product-company
roles and select freelance work. The content is the same as the existing site (bio, toolkit, four
roles, contact) — the redesign is visual and structural, plus one interactive centrepiece.

Direction: deep-navy "glass and dark" — frosted translucent panels floating over slow-drifting
coloured light, a faint masked grid, gradient-masked display type, restrained motion.

One design file is included: **v3, the approved and final direction.**

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look
and behaviour, not production code to copy directly. They are authored in a component format where a
single .dc.html file holds a markup template plus a small logic class, and all styling is inline.
Do not port that structure.

The task is to **recreate these designs in the target codebase's existing environment** using its
established patterns and libraries. For this project the natural target is a React app (Next.js is a
good fit: static, fast, trivially deployable, and matches the subject's own stack). Use whatever
styling layer the codebase already has (CSS Modules, Tailwind, styled-components); if starting fresh,
Tailwind or CSS Modules both map cleanly onto the token table below.

Notes for reimplementation:
- Inline styles in the source are an artefact of the prototype format. Extract to classes/tokens.
- `style-hover="…"` attributes in the source are the prototype's way of expressing `:hover`.
- `<sc-for list=… as=…>` is a repeat loop → `array.map()`. `<sc-if value=…>` is a conditional.
- The syntax-highlighted response body is built with `React.createElement` in the prototype's logic
  class; reimplement it as ordinary JSX.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, blur values, easing and durations are final
and specified below. Recreate the UI closely. The only intentionally loose parts are responsive
breakpoints (the prototype relies on `auto-fit` grids — see Responsive behaviour) and the exact copy
of the streamed JSON payloads, which are content and may be edited freely.

## Screens / Views
One page, five stacked sections inside a centred column: `max-width: 1060px; margin: 0 auto;`
with `padding: 0 28px` on the outer wrapper. Page background `#060912`.

### 0. Ambient background layer (fixed, behind everything)
- `position: fixed; inset: 0; pointer-events: none; z-index: 0; aria-hidden="true"`.
- Three blurred radial "glow" circles, each `border-radius: 50%`, animated with the `float1`
  keyframe (below) and given a slow cursor parallax by JS:
  1. `top: -14%; left: -6%; 640×640px`; `radial-gradient(circle at 40% 40%, rgba(58,110,235,.42), rgba(58,110,235,0) 68%)`; `filter: blur(30px)`; `animation: float1 19s ease-in-out infinite`.
  2. `top: 8%; right: -10%; 700×700px`; `radial-gradient(circle at 55% 45%, rgba(122,214,238,.26), rgba(122,214,238,0) 66%)`; `blur(36px)`; `float1 25s ease-in-out infinite reverse`.
  3. `bottom: -22%; left: 26%; 720×720px`; `radial-gradient(circle at 50% 50%, rgba(139,123,255,.24), rgba(139,123,255,0) 70%)`; `blur(40px)`; `float1 31s ease-in-out infinite`.
- Grid overlay on top of the glows: two 1px `linear-gradient` line images at `rgba(255,255,255,.028)`,
  `background-size: 72px 72px`, masked with
  `mask-image: radial-gradient(120% 80% at 50% 0%, #000 20%, transparent 78%)` (include the
  `-webkit-` prefix) so the grid fades out below the fold.

### 0b. Scroll progress rail
- `position: fixed; top: 0; left: 0; height: 2px; z-index: 20`, width driven by scroll position
  (0→100%), `background: linear-gradient(90deg, #7ad6ee, #8b7bff)`.

### 1. Header (sticky glass bar)
- `position: sticky; top: 14px; z-index: 10; margin-top: 18px`; flex row, `space-between`,
  `gap: 18px`, `flex-wrap: wrap`; `padding: 12px 12px 12px 18px`; `border-radius: 16px`.
- Glass recipe: `border: 1px solid rgba(255,255,255,.09)`; `background: rgba(12,17,31,.6)`;
  `backdrop-filter: blur(20px) saturate(140%)` (+ `-webkit-`); `box-shadow: 0 20px 40px -34px rgba(0,0,0,.9)`.
- Left: 8px green status dot `#57e39b` with `box-shadow: 0 0 12px rgba(87,227,155,.9)`; then
  "Jeet Mukherjee" (Space Grotesk 500, 15px, `letter-spacing: -0.01em`); then "/ full-stack" in
  `#7b8aa8`, weight 400.
- Right nav: flex, `gap: 8px`, 14px. Text links "Playground" (#playground), "Work" (#work),
  "Résumé" (https://www.jeetm.dev/resume.pdf) — `padding: 9px 14px; border-radius: 10px; color: #a9b6cf`;
  hover `background: rgba(255,255,255,.07); color: #e7ecf7`.
- Primary CTA "Get in touch" → `mailto:jeetmukherjee100@gmail.com`:
  `padding: 10px 16px; border-radius: 10px; font-weight: 600; color: #061021`;
  `background: linear-gradient(180deg, rgba(122,214,238,.95), rgba(88,178,236,.95))`;
  `transition: transform .2s ease, filter .2s ease`; hover `translateY(-1px)` + `brightness(1.1)`.

### 2. Hero
- Section `padding: 92px 0 0`.
- Availability pill: inline-flex, `gap: 9px`, `padding: 7px 14px`, `border-radius: 999px`,
  `border: 1px solid rgba(255,255,255,.1)`, `background: rgba(255,255,255,.045)`,
  `backdrop-filter: blur(14px)`, JetBrains Mono 12px, `color: #a9b6cf`, `letter-spacing: .02em`;
  6px `#57e39b` dot. Copy: `available · senior roles & select freelance`.
- H1: `margin: 24px 0 0`; Space Grotesk 700; `font-size: clamp(42px, 7.4vw, 92px)`;
  `line-height: .98`; `letter-spacing: -0.04em`; `max-width: 17ch`; gradient text —
  `background: linear-gradient(170deg, #ffffff 18%, #9fb2d6 92%)` + `background-clip: text` +
  `color: transparent` (keep `-webkit-background-clip`).
  Copy: **"Ten years of making the whole stack behave."**
- Body grid: `grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 40px;
  margin-top: 40px; align-items: start`.
  - Left column, two paragraphs at 19px / `line-height: 1.65`, `max-width: 46ch`, `text-wrap: pretty`:
    - P1 `#c3cde2`: "I build web apps end to end — clean APIs on one side, responsive UIs on the other,
      and all the unglamorous glue in between. Currently Senior Technical Specialist at
      **DigitalAPICraft** (600 weight, `#e7ecf7`), shipping enterprise platforms for banks that really,
      *really* (non-italic, `#7ad6ee`) care about uptime."
    - P2 `#8b9ab5`, `margin-top: 16px`: "I like well-named variables, problems that touch real users,
      and the small thrill of deleting code."
    - Link row, `margin-top: 28px`, `gap: 10px`, JetBrains Mono 13px; each item
      `padding: 11px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.05); color: #d4dcec`; hover
      `border-color: rgba(122,214,238,.55); color: #fff`.
      Items: `github/jeetxdev` → https://github.com/jeetxdev, `linkedin/jeetm` →
      https://www.linkedin.com/in/jeetm, and a non-link `Bangalore, IN` chip with
      `border: 1px dashed rgba(255,255,255,.14); color: #7b8aa8`.
  - Right column, `justify-self: end`, flex row `gap: 16px`:
    - Portrait `132×168px`, `object-fit: cover`, `border-radius: 16px`,
      `border: 1px solid rgba(255,255,255,.12)`, `box-shadow: 0 30px 60px -34px rgba(0,0,0,.95)`.
      Source in the prototype: `https://www.jeetm.dev/profile.JPG` — replace with a local asset.
    - Two small glass stat cards stacked `gap: 10px`, each `padding: 12px 14px; border-radius: 12px;
      border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.04);
      backdrop-filter: blur(14px)`; JetBrains Mono 12px `#8b9ab5` caption under a Space Grotesk
      22px `#e7ecf7` figure (`letter-spacing: -0.02em`):
      "10 yrs / shipping to production", "fintech / banks, APIs, dashboards".

### 3. Playground — "The short version, as an API" (the centrepiece)
Rationale: rather than asserting JS/CSS skill in bullets, the bio is served as a live API — a nod to
the API-explorer work in the current role. **Keep this feature; it is the differentiator.**
- Section `id="playground"`, `padding: 104px 0 0`.
- Section label pattern (shared by sections 3 and 4): flex baseline row, `gap: 14px` —
  JetBrains Mono 400, 12.5px, `letter-spacing: .16em`, `text-transform: uppercase`,
  `color: #7b8aa8`; then a `flex: 1` 1px rule in `rgba(255,255,255,.09)`.
  Label here: "The short version, as an API".
- Panel, `margin-top: 22px`: `border-radius: 18px; border: 1px solid rgba(255,255,255,.1);
  background: rgba(10,15,28,.62); backdrop-filter: blur(22px) saturate(140%);
  box-shadow: 0 40px 80px -60px rgba(0,0,0,1); overflow: hidden`.
- Toolbar row: `padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.025)`; flex, `gap: 8px`, wraps.
  - `GET` badge: JetBrains Mono 12px `#57e39b`, `padding: 4px 8px; border-radius: 6px;
    background: rgba(87,227,155,.1)`.
  - Four route buttons: `/whoami`, `/stack`, `/experience`, `/contact`. JetBrains Mono 12.5px,
    `padding: 6px 11px; border-radius: 8px`.
    - Active: `border: 1px solid rgba(122,214,238,.5); background: rgba(122,214,238,.14); color: #d6f4fd`.
    - Idle: `border: 1px solid rgba(255,255,255,.1); background: transparent; color: #8b9ab5`;
      hover `border-color: rgba(255,255,255,.24); color: #e7ecf7`.
  - Right meta (`margin-left: auto`), JetBrains Mono 11.5px `#7b8aa8`:
    `{status} · {elapsed} ms` where status is `streaming…` then `200 OK`.
- Response body: `padding: 20px 22px 24px; overflow-x: auto`; code block JetBrains Mono 13.5px,
  `line-height: 1.55`, `min-height: 236px` (reserves space so the panel does not jump between
  routes). Each line is a `white-space: pre` block with `min-height: 1.55em`.
- **Streaming behaviour**: on mount and on every route change, the selected payload is revealed
  7 characters per 16ms tick (~440 chars/sec) from a zeroed counter; elapsed ms is measured with
  `performance.now()` and displayed live; when complete, status flips to `200 OK` and the timer stops.
  A 7px × 1em caret in `#7ad6ee` blinks at the end of the last visible line while streaming
  (`animation: caret 1s steps(1) infinite`), and disappears when done.
  Clicking the already-active route is a no-op. Under `prefers-reduced-motion: reduce` the payload
  renders instantly with a fixed `28 ms` reading.
- **Syntax highlighting**: tokenise each visible line with
  `/("[^"\\]*"\s*:)|("[^"\\]*")|(-?\d+\.?\d*)|(true|false|null)|([{}\[\],])|(\s+)|(.)/g`
  and colour by group — key `#7ad6ee`, string `#8ee6b4`, number `#f0c274`, boolean/null `#c3a6ff`,
  punctuation `#5f7295`, anything else `#c3cde2`. Highlighting runs on the partially revealed text,
  so an unterminated string mid-stream must degrade gracefully (the final `(.)` catch-all group
  handles this) — do not `JSON.parse` the partial payload.
- Caption under the panel, `margin-top: 14px`, JetBrains Mono 12px `#6f7d99`:
  "Yes, it's really streaming — the whole panel is ~60 lines of vanilla JS."
- Payloads (exact content in the prototype, pretty-printed JSON, 2-space indent):
  - `/whoami`: name, role, title, based, years_shipping (10), domains[], available (true).
  - `/stack`: frontend[], backend[], data[], craft[], favourite_tool ("a well-named variable").
  - `/experience`: array of four `{ company, role, since }` objects, aligned columns.
  - `/contact`: email, github, linkedin, resume, open_to[].
  See `Jeet Mukherjee - Portfolio v3.dc.html` (the `PAYLOADS` constant) for verbatim strings.

### 4. Work — "Where I've been"
- Section `id="work"`, `padding: 104px 0 0`. Section label "Where I've been"; right-aligned meta
  after the rule: JetBrains Mono 12px `#5f6d88`, "4 teams · 10 yrs".
- Card list: flex column, `gap: 16px`, `margin-top: 30px`. One card per role, four total.
- Card: `display: grid; grid-template-columns: 150px 1fr; gap: 30px; padding: 28px 30px;
  border-radius: 18px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.035);
  backdrop-filter: blur(18px) saturate(130%)`;
  `transition: transform .3s cubic-bezier(.2,.7,.2,1), border-color .3s ease, background .3s ease`;
  hover `transform: translateY(-3px); border-color: rgba(122,214,238,.34);
  background: rgba(255,255,255,.055)`.
- Left rail: start year in Space Grotesk 500, 30px, `letter-spacing: -0.03em`, `line-height: 1`,
  `#e7ecf7`; below it the end label ("— now", "— 2022", …) in JetBrains Mono 12px `#7ad6ee`,
  `margin-top: 4px`; below that the city in JetBrains Mono 12px `#6f7d99`, `margin-top: 10px`.
- Right: role title Space Grotesk 500, 24px, `letter-spacing: -0.02em`, `#f2f5fb`; company 16px
  `#8b9ab5` (`margin-top: 5px`); then achievements as a list (`margin-top: 18px`, `gap: 10px`,
  no bullets) where each item is `grid-template-columns: 18px 1fr` with a `▸` marker in `#4f6ea8`
  and text at 16px / 1.6 in `#c3cde2`; then tech chips (`margin-top: 18px`, `gap: 6px`,
  JetBrains Mono 11.5px, `padding: 5px 10px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); color: #8b9ab5`).
- Roles, in order (all copy verbatim in the design file's `jobs` array):
  1. Senior Technical Specialist — DigitalAPICraft Private Limited — 2022 → now — Bangalore, IN — 5 bullets.
  2. IT Application Developer — i-Link Research Solutions — 2018 → 2022 — Bangalore, IN — 4 bullets.
  3. Software Developer — Techno Exponent — 2017 → 2018 — Kolkata, IN — 3 bullets.
  4. Program Analyst — Corelynx Solutions — 2015 → 2017 — Kolkata, IN — 4 bullets.

### 5. Contact panel + footer
- Section `padding: 104px 0 120px`.
- Panel: `padding: 56px 44px; border-radius: 24px; border: 1px solid rgba(255,255,255,.1);
  background: linear-gradient(150deg, rgba(122,214,238,.1), rgba(139,123,255,.08) 60%,
  rgba(255,255,255,.03)); backdrop-filter: blur(24px) saturate(140%); overflow: hidden`.
- Inner grid `repeat(auto-fit, minmax(280px, 1fr))`, `gap: 40px`, `align-items: center`.
  - H2 Space Grotesk 700, `clamp(32px, 4.4vw, 50px)`, `line-height: 1.04`,
    `letter-spacing: -0.035em`, `#f4f7fc`: "Got something worth building?"
  - P 18px / 1.6 `#a9b6cf`, `max-width: 40ch`: "A role to fill, a product to ship, or just an
    opinion about state management — all welcome."
  - Four interest chips (`margin-top: 22px`, `gap: 7px`, JetBrains Mono 12px `#8b9ab5`,
    `padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12)`):
    scalable web apps, microservices, mentoring, open source.
  - Email CTA (`justify-self: start`): `padding: 18px 26px; border-radius: 14px;
    background: linear-gradient(180deg, rgba(122,214,238,.96), rgba(88,178,236,.96)); color: #061021;
    box-shadow: 0 24px 50px -30px rgba(122,214,238,.7)`; JetBrains Mono 15px / 500; label
    `jeetmukherjee100@gmail.com` + a 18px `→`; `transition: transform .25s cubic-bezier(.2,.7,.2,1),
    filter .25s ease`; hover `translateY(-3px)` + `brightness(1.08)`.
- Footer: flex `space-between`, wraps, `margin-top: 24px`, JetBrains Mono 12px `#5f6d88`:
  "© 2025 Jeet Mukherjee" and "built by hand, deployed with nerve".

## Interactions & Behavior
1. **Reveal on scroll.** Every element marked `data-reveal` starts at `opacity: 0;
   transform: translateY(16px)` and transitions to `opacity: 1; transform: none` over `.8s
   cubic-bezier(.2,.7,.2,1)` when it enters the viewport. Driven by one `IntersectionObserver` with
   `rootMargin: "-6% 0px -6%"`; each element is unobserved after firing (reveal happens once, never
   reverses). Stagger: `transition-delay = (index % 3) * 80ms` in document order.
2. **Scroll progress rail.** Passive `scroll` listener sets width to
   `scrollY / (scrollHeight - innerHeight) * 100` percent.
3. **Cursor parallax on the background glows.** On `mousemove`, glow *i* is offset by
   `translate: (x * (26 + i*12))px (y * (18 + i*10))px` where `x`/`y` are pointer position
   normalised to −0.5…0.5. Attached only when `(hover: hover)` matches and reduced motion is off.
4. **Playground streaming + route switching.** See section 3.
5. **Hover states.** Nav links, both gradient CTAs, work cards, hero link chips, route buttons — all
   specified inline above. All hover transitions ≤ .3s.
6. **Loading / error states.** None — the site is static. The playground's "streaming…" state is
   cosmetic; there is no network request. If a real endpoint is ever wired in, keep the same
   status/timing slot for genuine states.
7. **Reduced motion.** A `@media (prefers-reduced-motion: reduce)` block disables all animation and
   transition, forces revealed elements visible, and the JS skips both pointer listeners and the
   character-by-character stream.
8. **Responsive behaviour.** Mobile-optimised and specified. Base layout is fluid — three
   `auto-fit`/`minmax` grids collapse on their own (hero body at ~290px, contact panel at ~280px),
   the header nav wraps, and both large headings scale with `clamp()`. On top of that, three explicit
   breakpoints. In the prototype these are expressed as data-attribute rules because its format is
   inline-style-only; reimplement them as ordinary responsive styles on the same elements.

   **≤ 900px**
   - Hero grid gap 40px → 32px.
   - Hero portrait column: `justify-self: end` → `start` (left-align once stacked).

   **≤ 720px**
   - Page gutter 28px → 18px.
   - Header: sticky offset 14px → 8px; padding → `10px 10px 10px 14px`; nav gap 8px → 4px,
     font-size 14px → 13px, link padding `9px 14px` → `8px 10px`.
   - Work cards: `150px 1fr` → single column; gap 30px → 16px; padding `28px 30px` → `24px 20px`.
     The year rail becomes a horizontal wrapping row above the role title (`display: flex;
     align-items: baseline; gap: 10px`, children lose their `margin-top`), and the year drops
     30px → 24px.
   - Hero portrait column stacks vertically (`flex-direction: column`); portrait 132×168 → 108×138;
     the two stat cards switch to a horizontal row beside/below it.
   - Playground: code font 13.5px → 12px; response padding `20px 22px 24px` → `16px 14px 20px`.
   - Contact panel padding `56px 44px` → `36px 22px`; email CTA padding `18px 26px` → `16px 18px`,
     font-size 15px → 12.5px (the address is long — keep it from overflowing narrow screens).

   **≤ 420px**
   - Playground route buttons 12.5px → 11.5px.
   - Playground status/timing meta drops `margin-left: auto` and takes `width: 100%`, moving to its
     own line below the routes.

   Two things to watch that the prototype leaves to the browser: the response body scrolls
   horizontally (`overflow-x: auto`) rather than wrapping — correct for code, but verify the panel
   itself never forces page-level horizontal scroll; and touch targets in the header nav sit at
   ~34px tall on mobile, so bump them toward 44px if the target codebase has an accessibility bar.

## State Management
All state is local to the page; nothing is fetched or persisted.
- `route: "/whoami" | "/stack" | "/experience" | "/contact"` — active playground endpoint.
  Set by route-button click; a click on the active route is ignored.
- `shown: number` — count of revealed characters of the current payload. Reset to 0 on route change,
  incremented by 7 every 16ms until it reaches payload length, then the interval is cleared.
- `ms: number` — elapsed milliseconds since the stream started, updated each tick, frozen on
  completion. Derived: `done = shown >= payload.length`; `status = done ? "200 OK" : "streaming…"`.
- Scroll progress, reveal classes and glow offsets are written straight to the DOM (or CSS variables)
  rather than held in state — deliberately, to avoid re-rendering the page on every scroll/mousemove
  frame. Keep that split: only the playground re-renders on a timer.
- Clean-up matters: disconnect the observer, clear the interval, and remove both listeners on unmount.
- The prototype exposes one authoring toggle, `detail: "full" | "condensed"`, which trims each role
  to its first two bullets. Optional in production; drop it if unwanted.

## Design Tokens
### Colour
| Token | Value | Use |
| --- | --- | --- |
| bg | `#060912` | page background |
| ink | `#e7ecf7` | body text |
| ink-bright | `#f2f5fb` / `#f4f7fc` | role titles / contact H2 |
| text-soft | `#c3cde2` | paragraphs, bullet text |
| text-muted | `#a9b6cf` | nav, secondary paragraphs |
| text-dim | `#8b9ab5` | captions, chips, company |
| text-dimmer | `#7b8aa8` | section labels, "/ full-stack" |
| text-faint | `#6f7d99`, `#5f6d88` | small meta, footer |
| accent (cyan) | `#7ad6ee` | links, keys, active route, caret |
| accent-grad | `rgba(122,214,238,.95) → rgba(88,178,236,.95)` (180deg) | primary buttons |
| accent-2 (violet) | `#8b7bff` | progress rail end, glow 3 |
| on-accent | `#061021` | text on cyan buttons |
| success | `#57e39b` | availability dots, `GET` badge |
| marker | `#4f6ea8` | `▸` bullet markers |
| code-key | `#7ad6ee` | JSON keys |
| code-string | `#8ee6b4` | JSON strings |
| code-number | `#f0c274` | JSON numbers |
| code-bool | `#c3a6ff` | true/false/null |
| code-punct | `#5f7295` | braces, commas |
| glow-blue | `rgba(58,110,235,.42)` | background glow 1 |
| glow-cyan | `rgba(122,214,238,.26)` | background glow 2 |
| glow-violet | `rgba(139,123,255,.24)` | background glow 3 |

### Glass surfaces (elevation ladder)
| Level | Background | Border | Blur |
| --- | --- | --- | --- |
| header | `rgba(12,17,31,.6)` | `rgba(255,255,255,.09)` | `blur(20px) saturate(140%)` |
| playground panel | `rgba(10,15,28,.62)` | `rgba(255,255,255,.1)` | `blur(22px) saturate(140%)` |
| work card | `rgba(255,255,255,.035)` (hover `.055`) | `rgba(255,255,255,.08)` (hover `rgba(122,214,238,.34)`) | `blur(18px) saturate(130%)` |
| small card / pill | `rgba(255,255,255,.04)`–`.05` | `rgba(255,255,255,.09)`–`.12` | `blur(14px)` |
| contact panel | `linear-gradient(150deg, rgba(122,214,238,.1), rgba(139,123,255,.08) 60%, rgba(255,255,255,.03))` | `rgba(255,255,255,.1)` | `blur(24px) saturate(140%)` |

Always pair `backdrop-filter` with `-webkit-backdrop-filter`. Glass only reads as glass because the
animated glow layer sits behind it — if the background layer is dropped, the panels go flat.

### Typography
- Display / numerals: **Space Grotesk** 400/500/700.
- Body: **Public Sans** 400/500/600.
- Mono (code, labels, meta, chips): **JetBrains Mono** 400/500.
- Scale: H1 `clamp(42px, 7.4vw, 92px)` / 700 / `-0.04em` / `.98`; contact H2
  `clamp(32px, 4.4vw, 50px)` / 700 / `-0.035em` / `1.04`; role title 24px / 500 / `-0.02em`;
  year 30px / 500 / `-0.03em`; stat figure 22px / `-0.02em`; lead paragraph 19px / 1.65;
  contact paragraph 18px / 1.6; body & bullets 16px / 1.6; nav 14px; code 13.5px / 1.55;
  mono chips 13px; small meta 12px / 12.5px; smallest meta 11.5px.
  Section labels: 12.5px mono, uppercase, `letter-spacing: .16em`.
- Long-form paragraphs use `text-wrap: pretty` and `max-width: 40–46ch`.

### Spacing & layout
- Column `max-width: 1060px`, page gutter 28px.
- Section rhythm: 104px top padding between sections; hero 92px; last section 120px bottom.
- Grid gaps: 40px (hero, contact), 30px (card columns), 16–18px (card stack), 6–10px (chips/links).
- Card padding 28px 30px; playground body 20px 22px 24px; contact panel 56px 44px.

### Radii
`999px` pills · `24px` contact panel · `18px` playground panel & work cards · `16px` header, portrait
· `14px` email CTA · `12px` stat cards · `10px` nav items, hero links · `8px` route buttons ·
`6px` GET badge.

### Shadows
- Header `0 20px 40px -34px rgba(0,0,0,.9)`
- Playground panel `0 40px 80px -60px rgba(0,0,0,1)`
- Portrait `0 30px 60px -34px rgba(0,0,0,.95)`
- Email CTA `0 24px 50px -30px rgba(122,214,238,.7)`
- Status dot glow `0 0 12px rgba(87,227,155,.9)`

### Motion
- Easing: `cubic-bezier(.2,.7,.2,1)` for reveals and lifts; `ease` for colour/filter.
- Durations: reveal .8s; card lift .3s; button hover .2–.25s; stagger 80ms × (i % 3).
- `@keyframes float1`: `0%,100% { transform: translate(0,0) scale(1) }
  50% { transform: translate(4%,-5%) scale(1.1) }` — 19s / 25s (reverse) / 31s, `ease-in-out infinite`.
- `@keyframes caret`: `0%,49% { opacity: 1 } 50%,100% { opacity: 0 }` — 1s `steps(1)` infinite.
- Stream cadence: 7 chars / 16ms tick.

## Assets
- **Portrait** — the prototype hotlinks `https://www.jeetm.dev/profile.JPG` (rendered 132×168,
  `object-fit: cover`). Replace with a local, optimised asset (AVIF/WebP + `srcset`); ~2× the
  rendered box is enough.
- **Résumé** — `https://www.jeetm.dev/resume.pdf`, linked from the header and (as data) from
  `/contact`. Serve from the project's own static files.
- **Fonts** — Space Grotesk, Public Sans, JetBrains Mono, loaded from Google Fonts in the prototype.
  Self-host or use the framework's font pipeline (e.g. `next/font`) to avoid the extra round trip and
  layout shift; only the weights listed above are used.
- **Icons** — none. The only glyphs are text characters: `▸`, `→`, `·`, `—`.
- No images, illustrations or third-party libraries are required. Every visual is CSS.

## Files
In this bundle:
- `screenshots/01-v3.png` … `04-v3.png` — desktop reference captures of the approved design: hero,
  playground panel (`/whoami`, streamed complete), work cards, contact panel + footer. Note these are
  DOM re-renders, so `backdrop-filter` glass and large blurs read slightly flatter than in the
  browser — the HTML file is the source of truth for those effects.
- `Jeet Mukherjee - Portfolio v3.dc.html` — **the approved design.** Contains the full markup,
  the `PAYLOADS` constant with verbatim JSON copy, the tokeniser, and the `jobs` array with all
  role copy. Open it in a browser to see the intended behaviour.
- `support.js` — runtime needed for the three HTML files to open locally. Not part of the design and
  not to be ported.

Original site being replaced: https://www.jeetm.dev/
