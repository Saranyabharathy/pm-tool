// The eight identity hues from DESIGN.md. Class names are written out in full
// so Tailwind can see them.
const HUE_BACKGROUNDS = [
  'bg-hue-1',
  'bg-hue-2',
  'bg-hue-3',
  'bg-hue-4',
  'bg-hue-5',
  'bg-hue-6',
  'bg-hue-7',
  'bg-hue-8',
]

// A stable hue index (1 to 8) for a record id, so a project or person always
// gets the same colour without storing one.
export function hueFor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return (hash % HUE_BACKGROUNDS.length) + 1
}

export function hueBackground(id: string) {
  return HUE_BACKGROUNDS[hueFor(id) - 1]
}

export function hueVariable(id: string) {
  return `var(--hue-${hueFor(id)})`
}

export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}
