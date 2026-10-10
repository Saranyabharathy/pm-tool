# Design system

The reference for how PM Tool looks and behaves. Read it before adding or changing UI. Tokens are defined in `src/app/globals.css`; primitives live in `src/components/ui` (shadcn/ui on Base UI, restyled with these tokens, plus a few of our own).

## 1. Principles

1. **The work is the interface.** Cards, lists and tables carry the screen. Chrome stays quiet so content stands out.
2. **One accent.** Blue marks the primary action and the current selection, and nothing else. Colour otherwise carries meaning: priority, due state, project identity.
3. **Dense but calm.** This is a tool people keep open all day. 14px body text, 32px controls, tight and consistent spacing, no decoration that does not inform.
4. **Every state is designed.** Loading, empty, error, disabled, hover, focus, dragging and overdue all have a defined look.
5. **Motion explains, it does not perform.** Things move to show where they came from or went. Decorative animation is kept out of working surfaces.
6. **Both themes are first class.** Nothing is designed in light and "inverted" for dark.

### Do and don't

| Do | Don't |
|---|---|
| Use tokens: `bg-card`, `text-muted-foreground`, `border-border` | Use raw palette classes such as `bg-slate-900` or `text-blue-500` |
| Use a solid `bg-primary` for the single main action on a screen | Use gradient fills, glow shadows or glass blur on controls and cards |
| Use `lucide-react` icons at 16px with a text label or tooltip | Use emoji as icons |
| Truncate long text with `truncate` or `line-clamp-*` | Let long names push or wrap the layout |
| Show a skeleton shaped like the content | Show a centred spinner on an empty page |
| Use a toast for the result of an action, inline text for a field error | Use `alert()` or `confirm()` |
| Put React Bits effects where no work happens (section 9) | Animate the board, forms, tables or dialogs for decoration |

## 2. Colour

Colours are semantic tokens with a light and a dark value. Components only ever name the token.

### Surfaces and text

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#F7F8F9` | `#1D2125` | Page canvas |
| `card` | `#FFFFFF` | `#22272B` | Cards, panels, table, sidebar items raised from the canvas |
| `popover` | `#FFFFFF` | `#282E33` | Menus, dialogs, tooltips, toasts |
| `list` | `#F1F2F4` | `#101214` | Board lists |
| `muted` | `#F1F2F4` | `#2C333A` | Hover fill, skeleton, subtle chips |
| `sidebar` | `#FFFFFF` | `#161A1D` | Sidebar and top bar |
| `border` | `#DCDFE4` | `#38414A` | Hairlines and control outlines |
| `input` | `#C1C7D0` | `#454F59` | Input outline (needs 3:1 against the surface) |
| `foreground` | `#172B4D` | `#C7D1DB` | Body text |
| `muted-foreground` | `#626F86` | `#8C9BAB` | Secondary text, placeholders, icons |

Text contrast is at least 4.5:1 on its surface in both themes: `foreground` on `card` is 13.9:1 light and 9.6:1 dark; `muted-foreground` on `card` is 5.0:1 light and 5.1:1 dark.

### Intent

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` / `primary-foreground` | `#0C66E4` / `#FFFFFF` | `#579DFF` / `#161A1D` | Main action, selection, links, focus |
| `ring` | `#388BFF` | `#85B8FF` | Focus ring |
| `destructive` | `#C9372C` | `#F87168` | Delete actions, errors, overdue |
| `success` | `#1F845A` | `#4BCE97` | Done, completed due dates, saved |
| `warning` | `#A54800` | `#F5CD47` | Medium priority, due soon |

### Project and avatar hues

Eight hues identify projects (board backdrop, tile cover, sidebar dot) and people (avatar). The hue is derived from the record id by `hueFor()` in `src/lib/color.ts`, so it is stable and needs no stored setting. White text is used on all of them.

| Name | Token | Value |
|---|---|---|
| Blue | `hue-1` | `#0C66E4` |
| Teal | `hue-2` | `#1D7F8C` |
| Green | `hue-3` | `#1F845A` |
| Purple | `hue-4` | `#6E5DC6` |
| Magenta | `hue-5` | `#AE4787` |
| Orange | `hue-6` | `#C25100` |
| Red | `hue-7` | `#C9372C` |
| Slate | `hue-8` | `#44546F` |

In dark theme the board backdrop mixes the hue 45% into the canvas so it does not glare.

### Labels

Labels are pills with a tinted fill and a darker text of the same hue. They are never the only signal: every label also has text.

| Meaning | Label | Light fill / text | Dark fill / text |
|---|---|---|---|
| High priority | Red | `#FFECEB` / `#AE2E24` | `#42221F` / `#FD9891` |
| Medium priority | Amber | `#FFF7D6` / `#7F5F01` | `#332E1B` / `#F5CD47` |
| Low priority | Grey | `#F1F2F4` / `#44546F` | `#2C333A` / `#9FADBC` |
| To do | Grey | as above | as above |
| In progress | Blue | `#E9F2FF` / `#0055CC` | `#1C2B41` / `#85B8FF` |
| Done | Green | `#DCFFF1` / `#216E4E` | `#1C3329` / `#7EE2B8` |

## 3. Typography

Typeface: **Geist Sans** for everything, **Geist Mono** for ids and code. Numbers in tables and counters use `tabular-nums`.

| Role | Size / line height | Weight | Class |
|---|---|---|---|
| Page title | 20 / 28 | 600 | `text-xl font-semibold` |
| Section title | 16 / 24 | 600 | `text-base font-semibold` |
| Body, controls, card title | 14 / 20 | 400, 500 for emphasis | `text-sm` |
| Secondary, table cells | 13 / 18 | 400 | `text-[13px]` |
| Caption, label, badge | 12 / 16 | 500 | `text-xs font-medium` |

Rules: sentence case everywhere, including buttons and headings. No all-caps except the 11px list overline in tables. No text below 12px. Maximum line length for prose is 70 characters.

## 4. Space, shape, depth

- **Spacing** follows a 4px grid: 4, 8, 12, 16, 24, 32, 48. Inside a card 12; between cards 8; between sections 24; page gutter 24 (16 on mobile).
- **Radius:** 6px controls and labels (`rounded-md`), 8px cards and inputs (`rounded-lg`), 12px lists, dialogs and tiles (`rounded-xl`), full for avatars and pills.
- **Elevation:** two levels only.
  - `shadow-card`: `0 1px 1px rgb(9 30 66 / 0.25), 0 0 1px rgb(9 30 66 / 0.31)` for cards resting on a list.
  - `shadow-overlay`: `0 8px 12px rgb(9 30 66 / 0.15), 0 0 1px rgb(9 30 66 / 0.31)` for menus, dialogs, toasts and a card being dragged.
  - In dark theme shadows are replaced by a one-step lighter surface plus a hairline, because shadows do not read on dark.
- **Borders** are 1px `border-border`. Use a border or a shadow to separate a surface, not both.

## 5. Motion

| Use | Duration | Easing |
|---|---|---|
| Hover, press, focus | 120ms | ease-out |
| Menus, tooltips, toasts | 150ms | ease-out |
| Dialogs, drawers | 200ms | ease-out in, ease-in out |
| Card settle after a drop | 200ms | ease-out |

Only `opacity`, `transform` and colour are animated. Under `prefers-reduced-motion: reduce`, transitions drop to opacity only and all React Bits effects render their final state with no animation.

## 6. Components

All controls share: 32px height (36px on touch layouts), 14px text, 8px radius, a 2px `ring` focus outline with 2px offset shown on keyboard focus, and 50% opacity with no pointer events when disabled.

**Button** (`ui/button.tsx`)

| Variant | Look | Use |
|---|---|---|
| `default` | Solid `primary` | The one main action of a view or dialog |
| `outline` | `card` fill, `border` outline | Secondary actions |
| `ghost` | Transparent, `muted` on hover | Toolbar, icon buttons, "Add a card" |
| `destructive` | Tinted red fill, red text | Delete and remove |

Icon-only buttons are square, carry an `aria-label` and a tooltip. A pending button keeps its width, shows a spinner and its label, and is disabled.

**Input, textarea, select** (`ui/input.tsx`, `ui/textarea.tsx`, `ui/field.tsx`): `card` fill, `input` outline, `ring` on focus, `destructive` outline plus a message below when invalid. Labels sit above, 12px medium. Placeholders are examples, never the label.

**Label / badge** (`ui/badge.tsx`): 20px tall pill, 12px medium text, tinted as in section 2.

**Avatar** (`ui/avatar.tsx`): circle with one or two initials in white on the person's hue. Sizes 20 (cards), 24 (tables, menus) and 32 (top bar, member rows). Always has the full name as its accessible name and tooltip.

**Menu** (`ui/dropdown-menu.tsx`): `popover` surface, `shadow-overlay`, 32px rows, icon then label, destructive items last after a separator.

**Dialog** (`ui/dialog.tsx`): centred, max width 480 for forms and 768 for the card dialog, `popover` surface, 12px radius, backdrop `rgb(9 30 66 / 0.5)`. Title top left, close button top right, actions bottom right with the primary action last. Escape and backdrop click close it. Focus moves in on open and returns to the trigger on close.

**Confirm dialog** (`ui/confirm-dialog.tsx`): states what will be lost in one sentence; buttons "Cancel" and a destructive verb ("Delete project"), never "OK".

**Toast** (`ui/sonner.tsx`): bottom right (bottom centre on mobile), 4s, one line. Success after create, save, delete, add and remove; error when an action fails without a field to attach the message to.

**Tooltip**: 12px text on an inverted surface, 400ms delay, for icon-only controls and truncated text.

**Skeleton** (`ui/skeleton.tsx`): `muted` blocks matching the size and position of the real content, with a slow pulse.

**Empty state** (`ui/empty-state.tsx`): a 40px muted icon, one line saying what is missing, one line saying why it matters or what to do, and the action button.

## 7. The board

```
┌ project header: name · members · [New task] ───────────────────────────────┐
│ ┌ list 272px ────┐  ┌ list ──────────┐  ┌ list ──────────┐                 │
│ │ To do        3 │  │ In progress  2 │  │ Done         1 │   backdrop:     │
│ │ ┌ card ──────┐ │  │ ┌ card ──────┐ │  │ ┌ card ──────┐ │   project hue   │
│ │ │ [High]     │ │  │ │ ...        │ │  │ │ ...        │ │                 │
│ │ │ Title      │ │  │ └────────────┘ │  │ └────────────┘ │                 │
│ │ │ ◷ 12 Oct ▢2 (A)│ │                │  │                │                 │
│ │ └────────────┘ │  │                │  │                │                 │
│ │ + Add a card   │  │ + Add a card   │  │ + Add a card   │                 │
│ └────────────────┘  └────────────────┘  └────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Backdrop:** the project hue fills the board area edge to edge. The board scrolls horizontally; each list scrolls vertically inside the viewport height.
- **List:** 272px wide, `list` fill, 12px radius, 8px padding, 12px gap between lists. Header: name in 14px semibold and the card count in muted text.
- **Card:** `card` fill, 8px radius, `shadow-card`, 12px horizontal and 8px vertical padding, 8px gap between cards.
  - Row 1: priority label.
  - Row 2: title, 14px, up to three lines.
  - Row 3: due chip (clock icon and short date), comment count (icon and number, only when above zero), assignee avatar pushed to the right.
- **Due chip:** muted by default; red tinted fill when overdue; green tinted fill when the card is done.
- **Hover:** a 2px `ring` outline. The whole card is the click target and opens the card dialog.
- **Dragging:** the picked-up card follows the pointer with `shadow-overlay` and a 3° tilt. Its original slot shows a `muted` placeholder of the same height. The list under the pointer gets a 2px `primary` outline.
- **Add a card:** a ghost button at the bottom of each list. It turns into a textarea in a card shell; Enter creates the card and keeps the composer open for the next one; Escape or clicking away closes it.
- **Keyboard:** Tab to a card, Space to pick it up, arrow keys to move, Space to drop, Escape to cancel. Enter opens the card.

## 8. Layouts

**App shell:** a 48px top bar (logo, breadcrumb, theme toggle, user menu) over a 240px sidebar and the page. The sidebar lists projects with their hue square and has a "New project" action; it can be hidden on desktop and becomes a drawer below 768px. Pages other than the board are centred with a 1120px maximum width and 24px gutters.

**Projects:** a responsive grid of tiles, minimum 240px. Each tile has a 48px cover in the project hue, the name, a two-line description, task counts and the role. The last tile is a dashed "Create new project".

**Project header:** project name, a tab row (Board, List, Settings) with a 2px `primary` underline on the active tab, and the "New task" button on the right.

**List view:** a filter bar (status, assignee) that applies on change, then a table on a `card` surface with a sticky header, 40px rows and the full row clickable.

**Card dialog:** 768px. Left column: title, description, comments. Right column, 200px: status, priority, due date, assignee, then delete. Stacks to one column below 640px.

**Settings:** a 640px column of sections: details, members, danger zone. The danger zone is separated by a `destructive` tinted border.

**Auth:** two halves at 1024px and up. Left: brand panel in `hue-1` with an animated background, the product name and a one-line promise. Right: the form, 360px wide, vertically centred. Below 1024px only the form shows.

## 9. React Bits

React Bits components are copied into `src/components/reactbits`, kept close to upstream (the folder is excluded from ESLint) and coloured through props and tokens. They are allowed only where they do not compete with work:

| Component | Where | Rule |
|---|---|---|
| Shape Grid (animated background) | Auth brand panel | Loaded lazily, low contrast, not rendered under reduced motion |
| Blur Text | Auth headline | Plays once; plain text under reduced motion |
| Spotlight card | Project tiles | Hover only, subtle |
| Count up | Task counts on project tiles | Plays once, under 1s |

Project tiles and new comments also fade in on first appearance (8px rise, 300ms). That is plain CSS from `tw-animate-css`, not a React Bits component, to avoid shipping an animation library for one effect.

Never on the board, in forms, in tables, in dialogs or as a background behind text people need to read.

## 10. Accessibility

- Text contrast 4.5:1, control outlines and icons 3:1, in both themes.
- Everything works with the keyboard, in a logical tab order, with a visible focus ring. Dialogs and menus trap and restore focus.
- Controls have accessible names. Icons that carry meaning have a label; decorative icons are `aria-hidden`.
- Colour is never the only signal: labels have text, overdue has the word "Overdue" for screen readers, errors have a message.
- Touch targets are at least 36px on small screens.
- Drag and drop has the keyboard path above and announces moves through a live region.
- Motion respects `prefers-reduced-motion`.
- The layout works from 360px wide and at 200% zoom without horizontal scrolling, except the board, which scrolls by design.
