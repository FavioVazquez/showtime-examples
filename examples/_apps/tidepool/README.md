# Tidepool (fictional demo app)

**Tidepool is not a real product.** It is a small, fictional local-first notes app
that exists only as sample material for showtime examples (site captures, scripted
app demos, launch videos). The name, logo, notes and team members in the seed data
are made up. There are no users, stats or testimonials anywhere in it.
It is not affiliated with any real company, project or organization that uses a
similar name.

It is fully working, though: static files, no build step, no network requests.

```
index.html     the app (sidebar, note list, editor + Markdown preview, Cmd/Ctrl+K palette)
landing.html   one-page landing: hero, three features, CTA (embeds the app in ephemeral mode)
app.js         all app logic + seed notes + Markdown renderer (Lucide icons inlined, ISC)
styles.css     app + landing styles, light and dark themes
logo.svg       brand mark
fonts/         Inter and JetBrains Mono (OFL-1.1), installed with `showtime assets font`
```

## Run it

```bash
showtime site capture --serve examples/_apps/tidepool out/            # app
showtime site capture --serve examples/_apps/tidepool out/ --page /landing.html
```

Any static server works too. Nothing needs the network.

## URL parameters (for deterministic demos)

| Param | Effect |
| --- | --- |
| `?reset=1` | Clear saved notes and start from the 8 seed notes |
| `?ephemeral=1` | Use the seed notes in memory; never read or write storage |
| `?theme=light\|dark` | Force a theme (otherwise saved choice, then OS setting) |
| `?note=<id>` | Open a note: `welcome`, `q4-planning`, `standup-sep-24`, `debounce-snippet`, `local-first`, `reading-list`, `sourdough`, `weekly-review` |
| `?notebook=<id>` | Filter to `inbox`, `work`, `reading`, `personal` or `pinned` |
| `?tag=<tag>` | Filter to a tag, e.g. `planning` |
| `?mode=edit\|split\|preview` | Editor layout (default: split at 1200px and wider, else edit) |
| `?palette=<query>` | Open the command palette with a query (`?palette=` opens it empty) |
| `?shortcuts=1` | Open the keyboard shortcuts dialog |

Seed dates are fixed (Sep 2026), so list dates render the same on every run.
Notes you edit show `Just now` or a time.

## Keyboard shortcuts

`Mod` is Cmd on macOS and Ctrl elsewhere.

| Keys | Action |
| --- | --- |
| `Mod+K` (or `/`) | Open or close the command palette |
| `N` (or `Mod+Alt+N`) | New note (focuses the title; `Enter` moves to the body) |
| `J` / `K`, `↓` / `↑` | Next / previous note in the list |
| `Enter` | Edit the selected note |
| `Mod+E` | Toggle preview |
| `Mod+\` | Toggle split view |
| `P` | Pin or unpin |
| `Mod+S` | Save now (shows a toast) |
| `Shift+Mod+L` | Toggle theme |
| `?` | Shortcuts dialog |
| `Esc` | Close palette/dialog, or leave the editor |

Single-letter keys only work when no text field has focus. In the palette:
`↑`/`↓` move, `Enter` runs, `#` lists tags, `>` lists commands.
In the editor: `Enter` continues `-`, `1.` and `- [ ]` lists, `Tab` indents.

## Selectors

| Element | Selector |
| --- | --- |
| New note button | `#new-note` |
| Search trigger (opens palette) | `#search-trigger` |
| Notebook entries | `.notebook[data-notebook="all\|pinned\|inbox\|work\|reading\|personal"]` |
| Sidebar tags | `.tag[data-tag="planning"]` |
| Sync status | `#sync-status` (text "Sync: local only") |
| Theme toggle / shortcuts | `#theme-toggle`, `#shortcuts-btn` |
| List filter input | `#list-search` |
| Note list / items | `#note-list`, `.note-item[data-id="welcome"]`, active: `.note-item.is-active` |
| Title / body / preview | `#note-title`, `#editor` (textarea), `#preview` |
| View mode buttons | `#mode-edit`, `#mode-split`, `#mode-preview` |
| Notebook select / tag input | `#notebook-select`, `#tag-input`, chips: `.chip[data-tag]` |
| Pin / delete | `#pin-btn`, `#delete-btn` (toast with Undo: `.toast button`) |
| Task checkboxes in preview | `#preview input[type=checkbox][data-line]` |
| Note links in preview | `#preview [data-note-link]` |
| Palette | `#palette` (overlay), `#palette-input`, `.palette-item`, selected: `.palette-item.is-selected` |
| Shortcuts dialog | `#shortcuts-dialog` |
| Status bar | `#stat-words`, `#save-label` |
| Landing | `#hero`, `#features`, `#feature-local`, `#feature-search`, `#feature-markdown`, `#cta`, `#cta-open`, `#cta-bottom` |

`html.is-ready` is set once the app has rendered.

## Script API

`window.tidepool` exposes `openNote(id)`, `newNote()`, `setMode(m)`,
`setFilter(kind, value)`, `openPalette(query)`, `closePalette()`, `toggleTheme()`,
`setTheme(t)`, `reset()` and a read-only `state` snapshot.

## Storage

Notes are saved to `localStorage` (`tidepool.notes.v1`), theme to `tidepool.theme`.
If storage is blocked the app still works for the session.
