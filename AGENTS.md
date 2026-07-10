<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Styling, Colors & Responsive Rules

This project uses **Tailwind CSS v4** and follows a CSS custom-properties-based design token strategy.

## 1. Colors & Dark Mode
Do NOT use hardcoded colors in React components (e.g. `bg-[#4f46e5]`). Instead, use the semantic color utilities configured in [globals.css](file:///d:/cnk-shop/app/globals.css):

- **Primary Brand**: Use `bg-primary` / `text-primary` / `border-primary` (and variants like `-hover`).
- **Secondary Brand**: Use `bg-secondary` / `text-secondary` / `border-secondary`.
- **Accent Details**: Use `bg-accent` / `text-accent` / `border-accent`.
- **Background & Surfaces**: Use `bg-background` for the page background and `bg-surface` for cards, modals, and container elements.
- **Typography (Text)**: Use `text-foreground` for default text and `text-muted` for sub-labels or descriptions.
- **Borders**: Use `border-border` for dividers and borders.

### Dark Mode Behavior
Dark mode is handled automatically through CSS Custom Properties mapped under the `:root` and `@media (prefers-color-scheme: dark)` scopes in `app/globals.css`. Therefore, utilities like `bg-background` automatically switch colors without needing explicit `dark:bg-...` classes in most cases, unless fine-tuning dark-mode-specific accents.

---

## 2. Responsiveness (Mobile-First)
We design websites using a **mobile-first** approach. Layouts must be responsive and adapt to different screen sizes.

Use Tailwind's responsive screen prefix utilities:
- **Mobile (Default)**: `< 640px` (e.g., stacked layout, full-width columns, navigation hamburger).
- **sm (Small Tablet / Landscape Mobile)**: `min-width: 640px` (prefix: `sm:`, e.g., grid with 2 columns).
- **md (Tablet)**: `min-width: 768px` (prefix: `md:`, e.g., expanded sidebar, grid with 3 columns).
- **lg (Laptop / Small Desktop)**: `min-width: 1024px` (prefix: `lg:`, e.g., grid with 4 columns, full horizontal menu).
- **xl (Large Screen)**: `min-width: 1280px` (prefix: `xl:`).
- **2xl (Ultra-wide)**: `min-width: 1536px` (prefix: `2xl:`).

**Rules:**
1. Default classes must define the mobile layout (e.g. `flex flex-col w-full`).
2. Add responsive modifiers to adapt to larger screens (e.g. `md:flex-row md:w-1/2`).
3. Set parent containers to a max-width with centering on large screens (e.g. `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).

