# TermDesk Design System

A comprehensive guide to the TermDesk modern design system.

---

## 🎨 Color Palette

### Primary Colors
```css
--primary: 262 83% 58%        /* Purple #8b5cf6 */
--primary-foreground: 0 0% 100%  /* White */
```

### Accent Colors
```css
--accent: 262 83% 58%         /* Purple #8b5cf6 */
Purple: #8b5cf6
Blue: #6366f1, #3b82f6
Pink: #ec4899
Cyan: #06b6d4
Green: #10b981
Yellow: #f59e0b
```

### Semantic Colors
```css
Success: #10b981 (Green)
Warning: #f59e0b (Yellow)
Error: #ef4444 (Red)
Info: #3b82f6 (Blue)
```

### Neutral Colors
```css
Slate 900: #0f172a (Terminal background)
Slate 800: #1e293b (Terminal secondary)
Slate 700: #334155 (Inputs)
Slate 600: #475569 (Muted text)
White: #ffffff (Text on colored backgrounds)
```

---

## 🖋️ Typography

### Font Family
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'Monaco', 'Courier New', monospace
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

### Font Sizes
```css
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
4xl: 2.25rem (36px)
5xl: 3rem (48px)
6xl: 3.75rem (60px)
7xl: 4.5rem (72px)
```

---

## 📐 Spacing Scale

```css
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
```

---

## 🔵 Border Radius

```css
sm: calc(var(--radius) - 4px)  /* 8px */
md: calc(var(--radius) - 2px)  /* 10px */
lg: var(--radius)               /* 12px */
xl: 16px
2xl: 20px
3xl: 24px
full: 9999px (Circle)
```

---

## 🎭 Shadows

### Standard Shadows
```css
sm: 0 1px 2px rgba(0, 0, 0, 0.05)
md: 0 4px 6px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px rgba(0, 0, 0, 0.1)
2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

### Glow Effects
```css
glow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)
glow-lg: 0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)
```

---

## 🌊 Gradients

### Background Gradients
```css
.gradient-primary
background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)

.gradient-secondary
background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)

.gradient-bg
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Gradient Mesh
```css
.gradient-mesh
background:
  radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
  radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
  radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%)
```

---

## 🪟 Glass Morphism

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Dark Glass
```css
background: rgba(15, 23, 42, 0.8);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## ✨ Animations

### Entrance Animations
```css
.fade-in
Duration: 0.5s
Easing: ease-in
Effect: opacity + translateY

.slide-in
Duration: 0.5s
Easing: ease-out
Effect: opacity + translateX

.slide-up
Duration: 0.6s
Easing: ease-out
Effect: opacity + translateY

.scale-in
Duration: 0.4s
Easing: ease-out
Effect: opacity + scale
```

### Continuous Animations
```css
.float
Duration: 3s infinite
Effect: translateY oscillation

.pulse-glow
Duration: 2s infinite
Effect: box-shadow pulsing

.shimmer
Duration: 2s infinite
Effect: gradient sweep
```

---

## 🔘 Button Styles

### Primary Button
```css
Background: gradient-to-r from-purple-600 to-purple-700
Hover: from-purple-700 to-purple-800
Text: white
Height: 40px-48px
Padding: 16px-24px
Border radius: 12px
Font weight: 600
Shadow: lg
Hover shadow: xl
Hover scale: 1.02
```

### Secondary Button
```css
Background: gradient-to-r from-blue-600 to-blue-700
Hover: from-blue-700 to-blue-800
Text: white
Other properties: same as primary
```

### Ghost Button
```css
Background: glass-effect
Border: 1px solid white/20
Hover: bg-white/20
Text: white
Height: 32px-40px
Padding: 8px-16px
```

---

## 📇 Card Styles

### Standard Card
```css
.glass-effect
backdrop-blur: 2xl (40px)
border: 2px solid white/20
shadow: 2xl
border-radius: 16px-24px
padding: 24px-32px
```

### Card Hover Effect
```css
.card-hover:hover
transform: translateY(-4px)
shadow: enhanced
transition: 0.3s cubic-bezier
```

---

## 🖥️ Terminal Styles

### Terminal Container
```css
Background: gradient-to-br from-slate-900 to-slate-800
Text: slate-100
Font: Monaco, monospace
Font size: 14px
Padding: 24px-32px
Height: 500px-600px
Border radius: 16px
```

### Terminal Glow
```css
.terminal-glow
box-shadow:
  0 0 20px rgba(139, 92, 246, 0.3),
  0 0 40px rgba(139, 92, 246, 0.2),
  0 0 60px rgba(139, 92, 246, 0.1)
```

### Command Prompt
```css
Color: #10b981 (green-400)
Font: monospace
Font weight: bold
Symbol: $
```

### System Messages
```css
Color: #06b6d4 (cyan-400)
Background: cyan-500/5
Border: 2px solid cyan-500/50
Border radius: 8px
Padding: 8px-12px
```

---

## 🎫 Badge Styles

### Status Badge (Connected)
```css
Background: green-500/90
Text: white
Icon: white dot (animate-pulse)
Border: 1px solid white/20
Padding: 4px-12px
Border radius: 8px
Font weight: 600
Shadow: lg
```

### Host Badge
```css
Background: gradient-to-r from-purple-500/90 to-pink-500/90
Text: white
Icon: Shield
Border: 1px solid white/20
Shadow: lg
```

---

## 📝 Input Styles

### Text Input
```css
Background: slate-700/50
Border: 2px solid slate-600/50
Focus border: purple-500/70
Text: white
Placeholder: slate-500
Height: 40px-48px
Padding: 12px-16px
Border radius: 8px-12px
Font size: 14px-16px
Focus ring: 4px purple-500/20
```

### Command Input
```css
Background: slate-700/50
Border: 2px solid slate-600/50
Focus border: purple-500/70
Font: Monaco, monospace
backdrop-filter: blur(xl)
```

---

## 🔍 Icon Guidelines

### Icon Sizes
```css
xs: 12px-14px
sm: 16px
base: 20px
lg: 24px
xl: 32px
2xl: 48px
```

### Icon Colors
- Primary actions: purple-600
- Success: green-400
- Warning: yellow-400
- Error: red-400
- Info: blue-400
- Neutral: white/slate-700

### Icon Usage
- Always pair with text labels when possible
- Use consistent stroke width (2-2.5)
- Add proper spacing (8px-12px) between icon and text
- Animate on hover for interactive elements

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices (phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* 2X large devices (large desktops) */
```

### Mobile-First Approach
- Base styles target mobile
- Use min-width media queries
- Stack elements vertically on mobile
- Increase spacing on larger screens
- Adjust font sizes responsively

---

## ♿ Accessibility

### Focus States
```css
outline: 2px solid rgba(139, 92, 246, 0.8)
outline-offset: 2px
border-radius: 8px
```

### Color Contrast
- All text maintains WCAG AA standards
- Minimum contrast ratio: 4.5:1
- Interactive elements: 3:1

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover/focus states
- Keyboard navigable
- Screen reader friendly

---

## 🎯 Component Patterns

### Dialog/Modal
```css
Background: glass-effect
Backdrop: blur(2xl)
Border: 2px solid white/20
Shadow: 2xl
Max width: 448px (sm)
Padding: 24px-32px
Border radius: 16px
```

### Scroll Area
```css
Custom scrollbar width: 8px
Track: rgba(0, 0, 0, 0.1)
Thumb: rgba(139, 92, 246, 0.5)
Thumb hover: rgba(139, 92, 246, 0.7)
Border radius: 4px
```

### Member List Item
```css
Background: glass-effect
Padding: 12px-16px
Border: 2px solid white/20
Border radius: 12px
Hover: border-purple-400/50
Hover: scale(1.02)
Transition: 0.3s
```

---

## 🚀 Performance Guidelines

### Animations
- Use transform and opacity (GPU accelerated)
- Avoid animating width/height
- Use will-change sparingly
- Limit to 60fps

### Backdrop Filters
- Use on static/semi-static elements
- Combine with opacity for better performance
- Avoid on scrolling elements when possible

### Gradients
- Use CSS gradients over images
- Limit complex multi-stop gradients
- Use conic-gradient sparingly

---

## 📋 Component Checklist

When creating new components, ensure:
- [ ] Responsive design (mobile-first)
- [ ] Glass morphism applied where appropriate
- [ ] Proper spacing and padding
- [ ] Hover/focus states defined
- [ ] Animations are smooth (60fps)
- [ ] Accessible (keyboard + screen reader)
- [ ] Color contrast meets WCAG standards
- [ ] Icons are properly sized
- [ ] Loading states included
- [ ] Error states handled

---

## 🎨 Design Tokens

### Border
```css
--border: 214.3 31.8% 91.4%
Border width: 1px-2px
```

### Ring (Focus)
```css
--ring: 262 83% 58% (Purple)
Ring width: 2px-4px
Ring offset: 2px
Ring opacity: 20%-50%
```

### Radius
```css
--radius: 0.75rem (12px)
```

---

## 🌓 Dark Mode (Future)

### Implementation Ready
```css
.dark {
  --background: 222.2 84% 4.9%
  --foreground: 210 40% 98%
  --primary: 262 83% 58%
  /* Additional dark mode tokens defined */
}
```

Add `class="dark"` to root element to enable.

---

## 💡 Best Practices

1. **Consistency**: Use design tokens consistently
2. **Hierarchy**: Establish clear visual hierarchy
3. **Feedback**: Provide visual feedback for interactions
4. **Performance**: Optimize animations and effects
5. **Accessibility**: Always consider accessibility
6. **Responsive**: Design mobile-first
7. **Whitespace**: Use generous spacing
8. **Contrast**: Ensure proper contrast ratios

---

## 🔗 Quick Links

- Tailwind Docs: https://tailwindcss.com
- Radix UI: https://radix-ui.com
- Lucide Icons: https://lucide.dev
- Inter Font: https://rsms.me/inter/

---

**Last Updated**: 2024
**Version**: 2.0.0
**Maintained by**: TermDesk Team
