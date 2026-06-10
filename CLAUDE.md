# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start dev server (uses Vite HMR, auto-reloads on file changes)
npm run dev

# Type-check and build for production
npm run build

# Lint with ESLint (React Hooks + Refresh rules configured)
npm run lint

# Preview production build locally
npm run preview
```

## Architecture Overview

This is a **frontend-only demo/prototype** for an educational assistance platform. All data is hardcoded in `src/data/mock.ts`. There is no backend, no API layer, and no state persistence beyond React `useState`.

### Layout System (App.tsx)

The root component `App.tsx` acts as a layout controller, not a data container. It manages two independent layout modes:

- **Desktop**: Three layout modes toggled via a button group in the header — `three-col` (course/code/agent side-by-side), `two-col` (course + code), `single` (tab-switching one module at a time).
- **Mobile**: Always tab-based. Uses Tailwind's `md:` breakpoint (`md:hidden` / `hidden md:flex`) to switch between mobile and desktop views. The mobile tab bar is in the header; the desktop layout switcher is also in the header but hidden on small screens.

The `renderModule()` function in App.tsx maps tab keys to components. There is no router.

### Component Responsibilities

Each of the four modules is a self-contained component that owns its own state:

- **`CourseModule`**: Renders a two-pane layout — left sidebar is an expandable chapter tree (chapters → knowledge nodes), right pane shows markdown-like content. State: which chapter is expanded, which knowledge node is selected. Content is looked up from `knowledgeContent` by node ID.
- **`CodeModule`**: Two-pane layout — left is the exercise description, right is a faux code editor (plain `<textarea>` with line numbers rendered in a separate div, not Monaco/CodeMirror) plus a bottom output panel. The "run" button simulates execution with a `setTimeout` and hardcoded output.
- **`AgentModule`**: Chat interface with a hardcoded response map. Recognizes two exact input strings ("时间复杂度怎么算", "空间复杂度") and returns preset answers; everything else gets a generic fallback response. The "阶梯式提示" (stepped hints) panel is a collapsible sidebar with static hint text.
- **`SkillTree`**: Combines a top statistics card grid with an SVG-based skill tree visualization. The SVG is hand-drawn with `<line>` elements for edges and `<rect>` + `<text>` for nodes. Node positions are hardcoded in `mock.ts` (`x`, `y` coordinates). Hover effects are done via React state changing `strokeWidth`.

### Data Layer

All data lives in `src/data/mock.ts`. There are no async data fetching patterns, no custom hooks for data, and no shared state between modules. Each component imports directly from `mock.ts`.

Key data structures:
- `courseOutline`: Tree of chapters → knowledge nodes, each node has a `status` field (`learned` | `learning` | `pending`) used for icon rendering.
- `knowledgeContent`: Flat record keyed by node ID. A `default` fallback exists for unmapped IDs.
- `codeExercise`: Single hardcoded exercise with title, description, and initial code template.
- `agentHistory`: Seed messages for the chat.
- `skillNodes` / `skillEdges`: Positioned graph data for the SVG tree.
- `learningStats`: Static numbers for the dashboard cards.

### Styling

Tailwind CSS v4 is used with the Vite plugin (`@tailwindcss/vite`). Global styles are in `src/index.css` which imports Tailwind via `@import "tailwindcss";`. No custom Tailwind config file exists — v4 uses CSS-based configuration. The only custom CSS beyond Tailwind utilities is scrollbar styling and base body/root resets.

### Technology Decisions to Know

- **Code editor is a `<textarea>`**, not Monaco or CodeMirror. The line numbers are a separate div with monospaced text, synchronized manually. This was a deliberate lightweight choice for the demo.
- **Skill tree is raw SVG**, not D3.js or ECharts. Node positions are manually specified in mock data. This keeps the bundle small and avoids a heavy charting library for a static demo.
- **AI responses are hardcoded string matching**, not a real LLM API. The response map is inside `AgentModule.tsx`, not mock.ts.
