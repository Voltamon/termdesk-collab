# TermDesk Terminal Theme - Quick Reference

## 🎨 Color Palette

```css
/* Primary Colors */
#00ff41  /* Terminal Green - Main text, borders */
#39ff14  /* Bright Green - Highlights, important elements */
#00aa2e  /* Dim Green - Muted text, secondary info */
#000000  /* Pure Black - All backgrounds */
#ff0000  /* Red - Errors, offline status */
```

## 🖋️ Typography

```css
font-family: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace;
```

### Font Sizes
- Mobile: `text-[0.5rem]` → `text-xs` (8px → 12px)
- Tablet: `text-sm` → `text-base` (14px → 16px)
- Desktop: `text-base` → `text-xl` (16px → 20px)

### Text Styles
```jsx
<span className="text-terminal">Standard green text</span>
<span className="text-terminal-bright">Bright green highlights</span>
<span className="text-terminal-dim">Muted green secondary</span>
```

## 🎯 Common Components

### Terminal Panel
```jsx
<div className="terminal-panel p-6 rounded-lg">
  {/* Content */}
</div>
```

### Terminal Button
```jsx
<button className="terminal-button h-12 px-6 font-mono font-bold">
  CLICK ME
</button>
```

### Terminal Border
```jsx
<div className="terminal-border p-4 rounded bg-black">
  {/* Content */}
</div>
```

### Terminal Border (Thick)
```jsx
<div className="terminal-border-thick p-4 rounded bg-black">
  {/* Content */}
</div>
```

## ✨ Effects

### Text Shadows
```jsx
<h1 className="text-shadow-terminal">Subtle glow</h1>
<h1 className="text-shadow-terminal-strong">Strong glow</h1>
```

### Glow Effects
```jsx
<div className="terminal-glow">Standard glow</div>
<div className="terminal-glow-strong">Strong glow</div>
```

### Background Effects
```jsx
<div className="matrix-bg">Matrix-style background</div>
<div className="grid-pattern">Grid pattern overlay</div>
<div className="scanline">Scanline effect</div>
<div className="crt-effect">CRT flicker effect</div>
```

## 🎬 Animations

### Entrance
```jsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-up">Slide up</div>
<div className="animate-slide-in">Slide in</div>
<div className="animate-scale-in">Scale in</div>
```

### Continuous
```jsx
<span className="blink">Blinking cursor</span>
<div className="typing-cursor">Text with cursor</div>
```

## 🎨 Layout Patterns

### Landing Page Card
```jsx
<Card className="terminal-panel-dark hover:terminal-glow transition-all duration-300 cursor-pointer bg-black/95">
  <CardHeader>
    <CardTitle className="text-terminal-bright font-mono font-bold">
      [ SECTION_TITLE ]
    </CardTitle>
    <CardDescription className="text-terminal-dim font-mono">
      <span className="text-terminal-bright">&gt;</span> Description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Button className="terminal-button">
      ACTION_BUTTON
    </Button>
  </CardContent>
</Card>
```

### Session Terminal Output
```jsx
<div className="bg-black text-terminal p-6 font-mono overflow-y-auto scrollbar-terminal crt-effect">
  <div className="text-terminal-bright">
    <span className="text-terminal-dim">[12:34:56]</span> user@termdesk:~$ ls
  </div>
  <div className="text-terminal pl-6">
    file1.txt file2.txt directory/
  </div>
</div>
```

### Member List Item
```jsx
<div className="terminal-border p-4 rounded bg-black/80 hover:bg-[#00ff41]/5 transition-all">
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-terminal-bright animate-pulse"></div>
    <span className="font-mono font-bold text-terminal">username</span>
  </div>
  <Badge className="bg-black text-terminal-bright border-2 border-terminal">
    HOST
  </Badge>
</div>
```

## 🔘 Interactive States

### Button States
```css
/* Default */
background: #000000;
border: 1px solid #00ff41;
color: #00ff41;

/* Hover */
background: #00ff41;
color: #000000;
box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);

/* Active */
transform: scale(0.98);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

### Input States
```css
/* Default */
background: #000000;
border: 2px solid #00ff41;
color: #00ff41;

/* Focus */
border-color: #39ff14;
ring: 2px #00ff41;
box-shadow: 0 0 5px rgba(0, 255, 65, 0.5);

/* Placeholder */
color: #00aa2e;
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Simplified effects, stacked layouts */
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1024px) {
  /* Balanced design */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full effects */
}
```

## 🎯 Common Patterns

### Prompt Prefix
```jsx
<span className="text-terminal-bright">&gt;</span> Your text here
```

### Section Header
```jsx
<h2 className="text-terminal-bright font-mono font-bold text-shadow-terminal">
  [ SECTION_NAME ]
</h2>
```

### Label Format
```jsx
<Label className="text-sm font-mono font-bold text-terminal tracking-wide">
  FIELD_NAME:
</Label>
```

### Status Badge
```jsx
{/* Online */}
<Badge className="bg-[#00ff41] text-black border-2 border-[#00ff41] font-mono font-bold">
  <div className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></div>
  ONLINE
</Badge>

{/* Offline */}
<Badge className="bg-red-500 text-black border-2 border-red-500 font-mono font-bold">
  <div className="w-2 h-2 rounded-full bg-black mr-2"></div>
  OFFLINE
</Badge>
```

### Loading Spinner
```jsx
<div className="w-4 h-4 border-2 border-terminal border-t-transparent rounded-full animate-spin"></div>
```

## 🎨 Terminal Symbols

```
>    Command prompt
█    Block cursor (blinking)
▊    Thin cursor
[ ]  Section headers
::   Label separator
...  Loading/waiting
```

## 📝 Naming Conventions

### Button Labels
```
INITIALIZE_SESSION
CONNECT_TO_SESSION
EXECUTE_COMMAND
GRANT_PERMISSION
EXIT_SESSION
```

### Status Labels
```
ONLINE / OFFLINE
CONNECTED / DISCONNECTED
HOST / USER
EXECUTE / VIEW
ACTIVE / IDLE
```

### Section Headers
```
[ TERMDESK_SESSION ]
[ START_SESSION ]
[ JOIN_SESSION ]
[ CONNECTED_USERS ]
[ TERMINAL_OUTPUT ]
```

## ⚡ Performance Tips

1. Use `will-change: transform` sparingly
2. Prefer CSS animations over JS
3. Reduce glow effects on mobile
4. Use `transform` and `opacity` for animations
5. Avoid animating `width` or `height`

## ♿ Accessibility Checklist

- [ ] 14:1 contrast ratio maintained
- [ ] Focus states clearly visible
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Alt text for icons
- [ ] Touch targets 44px minimum

## 🎨 Color Usage Guide

| Element | Color | Usage |
|---------|-------|-------|
| Body text | `#00ff41` | Standard text |
| Headings | `#39ff14` | Important titles |
| Muted text | `#00aa2e` | Secondary info |
| Backgrounds | `#000000` | All backgrounds |
| Borders | `#00ff41` | Outlines, dividers |
| Success | `#00ff41` | Confirmations |
| Error | `#ff0000` | Errors, warnings |
| Glow | `rgba(0,255,65,0.3-0.8)` | Shadows, effects |

## 🚀 Quick Component Examples

### Dialog
```jsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="terminal-panel bg-black text-terminal">
    <DialogHeader>
      <DialogTitle className="text-xl font-mono font-bold text-terminal-bright">
        [ DIALOG_TITLE ]
      </DialogTitle>
      <DialogDescription className="text-terminal-dim font-mono">
        <span className="text-terminal-bright">&gt;</span> Description
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Input Field
```jsx
<div className="space-y-2">
  <Label className="text-sm font-mono font-bold text-terminal">
    USERNAME:
  </Label>
  <Input
    placeholder="user@termdesk"
    className="h-11 font-mono bg-black border-2 border-[#00ff41] text-terminal focus:ring-2 focus:ring-[#00ff41] placeholder:text-terminal-dim"
  />
</div>
```

### Terminal Command
```jsx
<div className="flex gap-2">
  <span className="text-terminal-bright font-mono font-bold">&gt;</span>
  <Input
    className="flex-1 bg-black border-2 border-[#00ff41] text-terminal font-mono"
    placeholder="type command..."
  />
  <Button className="terminal-button">
    <Send className="w-4 h-4" />
  </Button>
</div>
```

## 📚 Documentation

- Full theme guide: `TERMINAL_THEME.md`
- Update log: `FRONTEND_UPDATES.md`
- Design system: `DESIGN_SYSTEM.md` (legacy)

---

**Version**: 2.0.0
**Last Updated**: 2024
**Theme**: Terminal Green on Black
