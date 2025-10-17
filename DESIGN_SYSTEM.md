# PeerFusion Design System - Quick Reference

## Color Palette

### Primary Colors

```css
--primary-color: #3b82f6; /* Main brand blue */
--primary-hover: #2563eb; /* Hover state */
--primary-light: #dbeafe; /* Light variant */
```

### Semantic Colors

```css
--success-color: #10b981; /* Success green */
--warning-color: #f59e0b; /* Warning amber */
--danger-color: #ef4444; /* Error red */
--info-color: #06b6d4; /* Info cyan */
```

### Neutral Palette (Better Visibility)

```css
--gray-50: #f8fafc; /* Lightest - backgrounds */
--gray-100: #f1f5f9; /* Very light */
--gray-200: #e2e8f0; /* Light - borders */
--gray-300: #cbd5e1; /* Medium light */
--gray-400: #94a3b8; /* Medium - placeholders */
--gray-500: #64748b; /* Medium dark */
--gray-600: #475569; /* Dark - secondary text */
--gray-700: #334155; /* Darker - body text */
--gray-800: #1e293b; /* Very dark */
--gray-900: #0f172a; /* Darkest - headings */
```

## Typography

### Font Family

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
```

### Font Sizes (Responsive)

```css
h1: clamp(2rem, 5vw, 3rem)
h2: clamp(1.5rem, 4vw, 2.25rem)
h3: clamp(1.25rem, 3vw, 1.875rem)
body: 1rem (16px)
small: 0.875rem (14px)
tiny: 0.75rem (12px)
```

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800
- Black: 900

### Line Heights

- Headings: 1.2
- Body text: 1.7
- UI elements: 1.5

## Spacing Scale

```css
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 3rem; /* 48px */
--spacing-3xl: 4rem; /* 64px */
```

## Border Radius

```css
--border-radius-sm: 6px;
--border-radius-md: 10px;
--border-radius-lg: 14px;
--border-radius-xl: 20px;
--border-radius-2xl: 24px;
```

## Shadows (Enhanced Depth)

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 30px rgba(0, 0, 0, 0.12);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);
```

## Transitions

```css
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

## Component Classes

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Outline Button -->
<button class="btn btn-outline">Outline Button</button>

<!-- Button Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Regular</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Form Elements

```html
<!-- Form Group -->
<div class="form-group">
  <label class="form-label">Label Text</label>
  <input type="text" class="form-input" placeholder="Enter text" />
</div>

<!-- Input with Icon -->
<div class="input-group">
  <svg class="input-icon">...</svg>
  <input type="text" class="form-input" placeholder="With icon" />
</div>

<!-- Error State -->
<input type="text" class="form-input error" />
<p class="form-error">Error message</p>
```

### Cards

```html
<!-- Basic Card -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Card subtitle</p>
  </div>
  <div class="card-body">Card content goes here</div>
</div>
```

## Best Practices

### Text Visibility

✅ Always use Gray-900 for headings
✅ Use Gray-700 for body text
✅ Use Gray-600 for secondary text
✅ Ensure minimum contrast ratio of 4.5:1

### Spacing

✅ Use consistent spacing scale
✅ Maintain visual rhythm
✅ Add breathing room around elements

### Interactive Elements

✅ Minimum touch target: 44x44px
✅ Clear hover states
✅ Visible focus indicators
✅ Smooth transitions

### Typography

✅ Use font weights to create hierarchy
✅ Limit line length to 65 characters
✅ Use appropriate line-height
✅ Responsive font sizes with clamp()

### Colors

✅ Use semantic colors for actions
✅ Maintain consistent color usage
✅ Test color contrast
✅ Use primary color sparingly

## Accessibility Checklist

- [ ] All text has sufficient contrast (4.5:1 minimum)
- [ ] Focus states are visible on all interactive elements
- [ ] Touch targets are at least 44x44px
- [ ] Reduced motion preferences respected
- [ ] Semantic HTML used throughout
- [ ] Alt text provided for images
- [ ] Keyboard navigation works properly

## Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 480px) {
  /* Small devices */
}
@media (min-width: 768px) {
  /* Tablets */
}
@media (min-width: 1024px) {
  /* Desktops */
}
@media (min-width: 1280px) {
  /* Large desktops */
}
```

## Common Patterns

### Hover Effect

```css
.element {
  transition: all 0.2s ease;
}
.element:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Focus State

```css
.element:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Disabled State

```css
.element:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Resources

- Google Fonts (Inter): https://fonts.google.com/specimen/Inter
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/
- Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
