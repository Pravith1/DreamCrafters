# UI Enhancement: MUI + Framer Motion

Upgrade the DreamCrafters frontend from plain HTML/CSS to **Material UI (MUI)** components with a **unified dark purple/indigo theme**, plus **Framer Motion** for smooth animations and transitions.

## Why This Approach

| Library | Used For |
|---------|----------|
| **MUI (`@mui/material`)** | Core UI: Cards, Buttons, TextFields, Tabs, Chips, AppBar, Drawer, Dialogs, Alerts, Progress |
| **MUI Icons** | Consistent iconography throughout |
| **Framer Motion** | Page transitions, card hover animations, staggered list reveals |
| **Google Fonts (Inter)** | Clean modern typography |

> [!NOTE]
> ReactBits components are copy-paste based and require additional setup. MUI + Framer Motion gives us the same premium feel with better consistency and theming. We keep our existing CSS for layout-specific styles (sidebar, grids).

## Theme

**Dark purple/indigo** with glassmorphism accents:
- Primary: `#7C4DFF` (deep purple)
- Secondary: `#448AFF` (blue accent)
- Background: `#0A0A1A` → `#121228` gradient
- Cards: `rgba(255,255,255,0.04)` with blur
- Success/Error/Warning: Standard MUI palette

## Proposed Changes

### Dependencies

Install MUI, MUI Icons, and Framer Motion:
```
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled framer-motion
```

---

### Theme & Provider

#### [NEW] [theme.js](file:///d:/activity%20point/DreamCrafters/frontend/src/theme.js)
MUI `createTheme` with dark mode, custom palette, typography (Inter), card overrides, and component defaults.

#### [MODIFY] [main.jsx](file:///d:/activity%20point/DreamCrafters/frontend/src/main.jsx)
Wrap with `ThemeProvider` and `CssBaseline`.

#### [MODIFY] [index.css](file:///d:/activity%20point/DreamCrafters/frontend/src/index.css)
Trim to layout-only utilities (grids, sidebar layout, chat layout). Remove component styles now handled by MUI.

---

### Layout Components

#### [MODIFY] [Sidebar.jsx](file:///d:/activity%20point/DreamCrafters/frontend/src/components/Sidebar.jsx)
MUI `Drawer` with `ListItem`, `ListItemIcon`, `ListItemText`. Add MUI Icons for each nav item.

#### [MODIFY] [DashboardLayout.jsx](file:///d:/activity%20point/DreamCrafters/frontend/src/components/DashboardLayout.jsx)  
MUI `AppBar` for top bar, responsive drawer toggle.

---

### Pages (All 14 Pages Updated)

Every page gets MUI components + Framer Motion `motion.div` for entrance animations:

- **Home.jsx** → MUI `Button`, `Container`, `Typography`, `Grid`, Framer Motion hero animations
- **Login.jsx** → MUI `TextField`, `Button`, `Alert`, `ToggleButtonGroup` for role
- **Register.jsx** → MUI `Stepper` for 3-step flow, `TextField`, `Alert`
- **ForgotPassword.jsx** → MUI `Stepper`, `TextField`
- **Dashboard.jsx** → MUI `Card`, `Grid`, `Chip`, `Avatar`, `LinearProgress`  
- **Settings.jsx** → MUI `Tabs`, `TextField`, `Button`, `Alert`
- **StudyPlanner.jsx** → MUI `Card`, `Chip`, `LinearProgress`, `Dialog` for create
- **StudyPlanDetail.jsx** → MUI `Card`, `Chip`, `IconButton`, `LinearProgress`
- **ContentLibrary.jsx** → MUI `Card`, `Tabs`, `TextField`, `Chip`, `LinearProgress`
- **CareerPaths.jsx** → MUI `Card`, `Chip`, `Dialog` for detail modal
- **Webinars.jsx** → MUI `Card`, `Chip`, `LinearProgress`, `Button`
- **ChatBot.jsx** → MUI `Paper`, `TextField`, `Chip` for quick replies
- **Mentors.jsx** → MUI `Card`, `Avatar`, `Rating`, `TextField`, `Chip`
- **JobBoard.jsx** → MUI `Card`, `Chip`, `TextField`, `Select`, `Button`

## Verification Plan

### Automated Tests
- `npm run dev` — verify zero build errors
- Browser check: Landing, Login, Register, Dashboard pages render correctly

### Manual Verification
- Visual comparison of before/after for theme consistency
- Test auth flow end-to-end (login → dashboard → navigate pages)
