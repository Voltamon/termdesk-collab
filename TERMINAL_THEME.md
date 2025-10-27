# Terminal Theme Documentation

## Overview
TermDesk has been redesigned with a classic terminal aesthetic featuring a green-on-black color scheme, inspired by retro terminal emulators and the Matrix aesthetic. This design appeals to developers and terminal power users who prefer darker, high-contrast interfaces.

---

## 🎨 Color Palette

### Primary Colors
```css
Terminal Green (Primary): #00ff41
Bright Green (Highlights): #39ff14
Dim Green (Muted): #00aa2e
Pure Black (Background): #000000
```

### Semantic Colors
```css
Success/Online: #00ff41 (Terminal Green)
Error/Offline: #ff0000 (Red)
Warning: #ffff00 (Yellow)
Info: #00ff41 (Terminal Green)
```

### Usage Guidelines
- **Text**: Use `#00ff41` for primary text
- **Backgrounds**: Use `#000000` for all backgrounds
- **Highlights**: Use `#39ff14` for important elements
- **Muted**: Use `#00aa2e` for secondary/disabled text
- **Borders**: Use `#00ff41` with various opacities

---

## 🖋️ Typography

### Font Stack
```css
Primary: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace
Fallback: monospace system fonts
```

### Font Weights
- Regular: 400 (default)
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Usage
- All text uses monospace fonts for authentic terminal feel
- Headers: Bold weight (700-800)
- Body: Regular to medium weight (400-500)
- Code/IDs: Regular weight (400)

---

## 🎭 Visual Effects

### Terminal Glow
```css
.terminal-glow {
  box-shadow:
    0 0 5px rgba(0, 255, 65, 0.5),
    0 0 10px rgba(0, 255, 65, 0.3),
    0 0 15px rgba(0, 255, 65, 0.2);
}
```

### Text Shadow
```css
.text-shadow-terminal {
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

.text-shadow-terminal-strong {
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
}
```

### CRT Effect
- Subtle flicker animation
- Scanline overlay for authenticity
- Grid pattern background

---

## 🎯 Component Styles

### Terminal Panel
```css
.terminal-panel {
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #00ff41;
  box-shadow:
    0 0 10px rgba(0, 255, 65, 0.3),
    inset 0 0 20px rgba(0, 255, 65, 0.05);
}
```

### Terminal Border
```css
.terminal-border {
  border: 1px solid #00ff41;
  box-shadow:
    0 0 1px #00ff41,
    inset 0 0 1px #00ff41;
}

.terminal-border-thick {
  border: 2px solid #00ff41;
  box-shadow:
    0 0 5px rgba(0, 255, 65, 0.5),
    inset 0 0 5px rgba(0, 255, 65, 0.1);
}
```

### Terminal Button
```css
.terminal-button {
  background: #000000;
  border: 1px solid #00ff41;
  color: #00ff41;
  font-family: monospace;
  font-weight: bold;
  transition: all 0.2s ease;
}

.terminal-button:hover {
  background: #00ff41;
  color: #000000;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}
```

---

## ✨ Animations

### Blink Effect (Cursor)
```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### Scanline Effect
```css
@keyframes scanlineMove {
  0% { top: -100%; }
  100% { top: 100%; }
}
```

### CRT Flicker
```css
@keyframes flicker {
  0% { opacity: 0.98; }
  5% { opacity: 1; }
  10% { opacity: 0.98; }
  15% { opacity: 1; }
  20% { opacity: 0.98; }
  100% { opacity: 1; }
}
```

---

## 🖥️ Page Layouts

### Landing Page Features
- **ASCII Art Logo**: Large terminal-style ASCII art header
- **Matrix Background**: Subtle grid pattern with radial gradients
- **Feature Pills**: Bordered tags with terminal green
- **Action Cards**: Dark panels with green borders and glow effects
- **Scanline Overlay**: Animated scanline for authenticity

### Session Page Features
- **Terminal Output**: Black background with green text
- **Command Prompt**: Green `>` prompt with cursor
- **Member Panel**: Dark panel with user status indicators
- **Real-time Indicators**: Pulsing dots and activity icons
- **CRT Effect**: Subtle flicker and scanlines

---

## 🎨 Design Patterns

### Terminal Text Variants
```css
/* Bright text for important elements */
.text-terminal-bright {
  color: #39ff14;
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.8);
}

/* Standard terminal text */
.text-terminal {
  color: #00ff41;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

/* Dimmed text for secondary content */
.text-terminal-dim {
  color: #00aa2e;
  text-shadow: 0 0 3px rgba(0, 170, 46, 0.3);
}
```

### Background Patterns
- **Grid Pattern**: 50px grid with subtle green lines
- **Scanlines**: Horizontal lines at 4px intervals
- **Radial Glow**: Subtle green glow from center

---

## 🔘 Interactive Elements

### Hover States
- Background changes to green (#00ff41)
- Text inverts to black (#000000)
- Glow intensity increases
- Slight scale transformation

### Focus States
- 2px green outline
- Enhanced glow effect
- No blur effect (terminal aesthetic)

### Active States
- Scale down slightly (0.98)
- Maintain hover colors

---

## 📊 Status Indicators

### Connection Status
```css
/* Online */
background: #00ff41;
color: #000000;
border: 2px solid #00ff41;

/* Offline */
background: #ff0000;
color: #000000;
border: 2px solid #ff0000;
```

### User Permission
```css
/* Can Execute */
color: #39ff14;
background: rgba(0, 255, 65, 0.1);
border: 1px solid #00ff41;

/* View Only */
color: #00aa2e;
background: rgba(0, 0, 0, 0.5);
border: 1px solid #00aa2e;
```

---

## 🎯 Typography Scale

### Headings
- H1: 3xl-4xl, font-bold, uppercase, tracking-wide
- H2: 2xl-3xl, font-bold, uppercase
- H3: xl-2xl, font-bold

### Body Text
- Base: sm-base, font-regular
- Small: xs-sm, font-regular
- Labels: xs-sm, font-bold, uppercase

### Code/Terminal
- All monospace
- Regular weight for output
- Bold for prompts and commands

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Reduced font sizes
- Simplified ASCII art
- Stacked layouts
- Touch-friendly targets (44px min)
- Reduced glow effects for performance

### Tablet (640px - 1024px)
- Medium font sizes
- Full ASCII art
- Flexible grid layouts
- Balanced visual effects

### Desktop (> 1024px)
- Full font sizes
- Enhanced visual effects
- Multi-column layouts
- Maximum glow and effects

---

## 🎬 Page Transitions

### Entry Animations
- Fade in with slight delay
- Slide up from bottom
- Staggered animations for lists
- Duration: 0.4s - 0.6s

### Exit Animations
- Quick fade out
- No slide animation
- Duration: 0.2s

---

## 🖱️ Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 10px;
  background: #000000;
  border: 1px solid #00ff41;
}

::-webkit-scrollbar-thumb {
  background: #00ff41;
  border: 1px solid #000000;
}

::-webkit-scrollbar-thumb:hover {
  background: #39ff14;
  box-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}
```

---

## ✂️ Selection Styling

```css
::selection {
  background: #00ff41;
  color: #000000;
}
```

---

## 🎨 ASCII Art Guidelines

### Usage
- Use for branding (TermDesk logo)
- Keep simple and readable
- Use box-drawing characters
- Ensure mobile responsiveness

### Characters
```
█ ▓ ▒ ░ ║ ═ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬
```

---

## 🔧 Technical Considerations

### Performance
- Use CSS transforms for animations (GPU accelerated)
- Limit glow effects on mobile
- Optimize scanline animations
- Use will-change sparingly

### Accessibility
- High contrast ratio (7:1+)
- Keyboard navigation supported
- Focus states clearly visible
- Screen reader friendly
- Reduced motion support recommended

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback to simple borders if effects unsupported
- Monospace font stack ensures consistency

---

## 🎯 Design Principles

1. **Authenticity**: True terminal aesthetic
2. **Readability**: High contrast, clear text
3. **Nostalgia**: Retro computing vibe
4. **Minimalism**: Focus on content
5. **Performance**: Lightweight effects
6. **Consistency**: Uniform design language

---

## 🚀 Quick Start Guide

### Adding New Components

1. Use `.terminal-panel` for containers
2. Apply `.terminal-border` for borders
3. Use monospace fonts
4. Green on black color scheme
5. Add subtle glow effects
6. Include scanline overlay for authenticity

### Example Component
```jsx
<div className="terminal-panel p-4 rounded">
  <h2 className="text-terminal-bright font-mono font-bold mb-2">
    [ COMPONENT_TITLE ]
  </h2>
  <p className="text-terminal font-mono text-sm">
    <span className="text-terminal-bright">&gt;</span> Component content
  </p>
  <button className="terminal-button mt-4 px-4 py-2">
    ACTION_BUTTON
  </button>
</div>
```

---

## 📝 Naming Conventions

### CSS Classes
- Use lowercase with hyphens
- Prefix with `terminal-` for theme-specific
- Example: `terminal-panel`, `terminal-glow`, `terminal-button`

### Component Text
- UPPERCASE for labels and buttons
- Use underscores for multi-word labels
- Example: `START_SESSION`, `CONNECTED_USERS`

### Symbols
- Use `>` for prompts
- Use `█` for cursors
- Use `[ ]` for section headers
- Use `::` or `:` for labels

---

## 🔮 Future Enhancements

- [ ] Multiple terminal themes (amber, blue, white)
- [ ] Adjustable scanline intensity
- [ ] CRT curvature effect (optional)
- [ ] Phosphor persistence effect
- [ ] Sound effects (typing, beep)
- [ ] Theme customization panel
- [ ] Reduced motion mode

---

**Theme Version**: 1.0.0
**Last Updated**: 2024
**Compatible With**: TermDesk v2.0+
