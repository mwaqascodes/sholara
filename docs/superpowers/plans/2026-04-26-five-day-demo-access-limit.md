# 5-Day Free Demo Access Limit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing one-tab "Free Demo Access" into a real 5-day demo that persists across refreshes, expires permanently, and forces users to sign in with Google to continue.

**Architecture:** A pure helper module (`demo-status.ts`) reads/writes two `localStorage` keys (`startedAt`, `expiresAt`) and computes the `not_started | active | expired` state. `AuthContext` consumes the helper to expose `isDemo`, `demoExpiresAt`, `demoExpired`, rehydrate the mock demo user on refresh, and refuse `signInAsGuest` after expiry. `LoginPage` and `DashboardLayout` read those flags to render the expired banner / countdown / mid-session redirect.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, React Testing Library, React Router v6, Tailwind, Supabase JS (existing), `localStorage` for persistence.

**Spec:** [docs/superpowers/specs/2026-04-26-five-day-demo-access-limit-design.md](../specs/2026-04-26-five-day-demo-access-limit-design.md)

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/lib/demo-status.ts` | **CREATE** | Pure helpers: read/write localStorage keys, compute status, expose typed `DemoExpiredError`. No React, no I/O beyond `localStorage`. |
| `src/test/demo-status.test.ts` | **CREATE** | Unit tests for the pure helpers. Time-controlled via injected `now`. |
| `src/lib/auth-context.tsx` | **MODIFY** | Wire helpers into auth context: add `isDemo`/`demoExpiresAt`/`demoExpired` to context value, change `signInAsGuest`, add rehydration on mount. |
| `src/test/auth-context-demo.test.tsx` | **CREATE** | Tests for the demo branches of `AuthContext`. |
| `src/pages/LoginPage.tsx` | **MODIFY** | When `demoExpired === true`: show banner, hide email/password form, hide demo button, show only Google. |
| `src/components/DashboardLayout.tsx` | **MODIFY** | Replace always-on amber banner with a conditional one: countdown for `isDemo`, hidden otherwise. Add expiry-on-route-change effect. |

Five tasks, in order:
- **Task 1** — `demo-status.ts` helper + tests (pure, no React).
- **Task 2** — Wire helper into `AuthContext` + tests.
- **Task 3** — Login page expired-state UI.
- **Task 4** — Dashboard banner + mid-session expiry redirect.
- **Task 5** — Manual smoke test + final commit.

---

## Constants used across all tasks

```ts
// src/lib/demo-status.ts
export const DEMO_DURATION_MS = 5 * 24 * 60 * 60 * 1000  // 5 days in ms
export const STARTED_AT_KEY = 'scholara.demo.startedAt'
export const EXPIRES_AT_KEY = 'scholara.demo.expiresAt'
```

The mock demo user shape (existing in `auth-context.tsx`, kept identical):

```ts
const mockUser: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { full_name: 'Demo Principal', role: 'admin' },
  aud: 'authenticated',
  email: 'demo@scholara.com',
  created_at: /* set per call: see Task 2 */,
}
```

---

## Task 1: Create `demo-status.ts` helper + tests

**Files:**
- Create: `src/lib/demo-status.ts`
- Create: `src/test/demo-status.test.ts`

### - [ ] Step 1.1: Write the failing tests

Create `src/test/demo-status.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  DEMO_DURATION_MS,
  STARTED_AT_KEY,
  EXPIRES_AT_KEY,
  DemoExpiredError,
  getDemoStatus,
  startDemo,
  clearDemoStorage,
} from '@/lib/demo-status'

beforeEach(() => {
  localStorage.clear()
})

describe('getDemoStatus', () => {
  it('returns not_started when neither key exists', () => {
    const result = getDemoStatus(new Date('2026-04-26T12:00:00Z'))
    expect(result.kind).toBe('not_started')
  })

  it('returns active when now is before expiresAt', () => {
    const startedAt = new Date('2026-04-26T12:00:00Z')
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const now = new Date('2026-04-29T12:00:00Z') // 3 days in
    const result = getDemoStatus(now)

    expect(result.kind).toBe('active')
    if (result.kind === 'active') {
      expect(result.expiresAt.toISOString()).toBe(expiresAt.toISOString())
    }
  })

  it('returns expired exactly at expiresAt', () => {
    const startedAt = new Date('2026-04-26T12:00:00Z')
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const result = getDemoStatus(expiresAt)
    expect(result.kind).toBe('expired')
  })

  it('returns expired one minute past expiresAt', () => {
    const startedAt = new Date('2026-04-26T12:00:00Z')
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const now = new Date(expiresAt.getTime() + 60 * 1000)
    const result = getDemoStatus(now)
    expect(result.kind).toBe('expired')
  })

  it('returns active when 4 days 23 hours 59 minutes have passed', () => {
    const startedAt = new Date('2026-04-26T12:00:00Z')
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const now = new Date(expiresAt.getTime() - 60 * 1000)
    const result = getDemoStatus(now)
    expect(result.kind).toBe('active')
  })

  it('treats malformed values as not_started', () => {
    localStorage.setItem(STARTED_AT_KEY, 'not a date')
    localStorage.setItem(EXPIRES_AT_KEY, 'also not a date')

    const result = getDemoStatus(new Date())
    expect(result.kind).toBe('not_started')
  })
})

describe('startDemo', () => {
  it('writes startedAt and expiresAt to localStorage on first call', () => {
    const now = new Date('2026-04-26T12:00:00Z')
    startDemo(now)

    expect(localStorage.getItem(STARTED_AT_KEY)).toBe(now.toISOString())
    expect(localStorage.getItem(EXPIRES_AT_KEY)).toBe(
      new Date(now.getTime() + DEMO_DURATION_MS).toISOString()
    )
  })

  it('does NOT overwrite when already active', () => {
    const original = new Date('2026-04-26T12:00:00Z')
    startDemo(original)

    const later = new Date('2026-04-28T12:00:00Z')
    startDemo(later)

    expect(localStorage.getItem(STARTED_AT_KEY)).toBe(original.toISOString())
  })

  it('throws DemoExpiredError when called in expired state', () => {
    const startedAt = new Date('2026-04-26T12:00:00Z')
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const past = new Date(expiresAt.getTime() + 60 * 1000)
    expect(() => startDemo(past)).toThrow(DemoExpiredError)
  })
})

describe('clearDemoStorage', () => {
  it('removes both keys', () => {
    localStorage.setItem(STARTED_AT_KEY, 'x')
    localStorage.setItem(EXPIRES_AT_KEY, 'y')

    clearDemoStorage()

    expect(localStorage.getItem(STARTED_AT_KEY)).toBeNull()
    expect(localStorage.getItem(EXPIRES_AT_KEY)).toBeNull()
  })
})
```

### - [ ] Step 1.2: Run tests, verify they fail

Run from `learnique-vista-main/`:

```bash
npm test -- src/test/demo-status.test.ts
```

Expected: FAIL with `Cannot find module '@/lib/demo-status'` (file doesn't exist yet).

### - [ ] Step 1.3: Write the implementation

Create `src/lib/demo-status.ts`:

```ts
export const DEMO_DURATION_MS = 5 * 24 * 60 * 60 * 1000
export const STARTED_AT_KEY = 'scholara.demo.startedAt'
export const EXPIRES_AT_KEY = 'scholara.demo.expiresAt'

export class DemoExpiredError extends Error {
  constructor() {
    super('Demo has expired')
    this.name = 'DemoExpiredError'
  }
}

export type DemoStatus =
  | { kind: 'not_started' }
  | { kind: 'active'; startedAt: Date; expiresAt: Date }
  | { kind: 'expired'; startedAt: Date; expiresAt: Date }

function readStoredDates(): { startedAt: Date; expiresAt: Date } | null {
  const startedRaw = localStorage.getItem(STARTED_AT_KEY)
  const expiresRaw = localStorage.getItem(EXPIRES_AT_KEY)
  if (!startedRaw || !expiresRaw) return null

  const startedAt = new Date(startedRaw)
  const expiresAt = new Date(expiresRaw)
  if (isNaN(startedAt.getTime()) || isNaN(expiresAt.getTime())) return null

  return { startedAt, expiresAt }
}

export function getDemoStatus(now: Date = new Date()): DemoStatus {
  const stored = readStoredDates()
  if (!stored) return { kind: 'not_started' }

  if (now.getTime() >= stored.expiresAt.getTime()) {
    return { kind: 'expired', ...stored }
  }
  return { kind: 'active', ...stored }
}

export function startDemo(now: Date = new Date()): { startedAt: Date; expiresAt: Date } {
  const status = getDemoStatus(now)

  if (status.kind === 'expired') {
    throw new DemoExpiredError()
  }
  if (status.kind === 'active') {
    return { startedAt: status.startedAt, expiresAt: status.expiresAt }
  }

  const startedAt = now
  const expiresAt = new Date(now.getTime() + DEMO_DURATION_MS)
  localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())
  return { startedAt, expiresAt }
}

export function clearDemoStorage(): void {
  localStorage.removeItem(STARTED_AT_KEY)
  localStorage.removeItem(EXPIRES_AT_KEY)
}
```

### - [ ] Step 1.4: Run tests, verify they pass

```bash
npm test -- src/test/demo-status.test.ts
```

Expected: all tests PASS (10 tests).

### - [ ] Step 1.5: Commit

```bash
git add src/lib/demo-status.ts src/test/demo-status.test.ts
git commit -m "feat(demo): add demo-status helper with localStorage clock"
```

---

## Task 2: Wire helpers into `AuthContext`

**Files:**
- Modify: `src/lib/auth-context.tsx`
- Create: `src/test/auth-context-demo.test.tsx`

### - [ ] Step 2.1: Write the failing test

Create `src/test/auth-context-demo.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import {
  STARTED_AT_KEY,
  EXPIRES_AT_KEY,
  DEMO_DURATION_MS,
  DemoExpiredError,
} from '@/lib/demo-status'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn().mockResolvedValue(undefined),
      resetPasswordForEmail: vi.fn(),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null }) }) }),
    }),
  },
  UserProfile: {} as any,
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

beforeEach(() => {
  localStorage.clear()
})

describe('AuthContext demo behavior', () => {
  it('exposes demoExpired=false and isDemo=false when no demo started', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.isDemo).toBe(false)
    expect(result.current.demoExpired).toBe(false)
    expect(result.current.demoExpiresAt).toBeNull()
  })

  it('signInAsGuest stamps localStorage and sets isDemo=true', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signInAsGuest()
    })

    expect(localStorage.getItem(STARTED_AT_KEY)).not.toBeNull()
    expect(localStorage.getItem(EXPIRES_AT_KEY)).not.toBeNull()
    expect(result.current.isDemo).toBe(true)
    expect(result.current.demoExpiresAt).toBeInstanceOf(Date)
  })

  it('rehydrates demo user from localStorage when active on mount', async () => {
    const startedAt = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    await waitFor(() => expect(result.current.user).not.toBeNull())

    expect(result.current.isDemo).toBe(true)
    expect(result.current.user?.id).toBe('demo-user-id')
  })

  it('does NOT rehydrate demo user when expired on mount', async () => {
    const startedAt = new Date(Date.now() - DEMO_DURATION_MS - 60_000)
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toBeNull()
    expect(result.current.demoExpired).toBe(true)
  })

  it('signInAsGuest throws DemoExpiredError when expired', async () => {
    const startedAt = new Date(Date.now() - DEMO_DURATION_MS - 60_000)
    const expiresAt = new Date(startedAt.getTime() + DEMO_DURATION_MS)
    localStorage.setItem(STARTED_AT_KEY, startedAt.toISOString())
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toISOString())

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      act(async () => {
        await result.current.signInAsGuest()
      })
    ).rejects.toThrow(DemoExpiredError)
  })
})
```

### - [ ] Step 2.2: Run test, verify it fails

```bash
npm test -- src/test/auth-context-demo.test.tsx
```

Expected: FAIL — `result.current.isDemo` is undefined (not yet on context).

### - [ ] Step 2.3: Modify `AuthContext` interface and add helpers

Open `src/lib/auth-context.tsx`. Replace lines 1–6 (imports) with:

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, UserProfile } from './supabase'
import {
  getDemoStatus,
  startDemo,
  DemoExpiredError,
} from './demo-status'

export type { UserProfile }
export { DemoExpiredError }
```

Replace the `interface AuthContextType` block (lines 7–18) with:

```tsx
interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  isDemo: boolean
  demoExpiresAt: Date | null
  demoExpired: boolean
  signInWithGoogle: () => Promise<void>
  signInAsGuest: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}
```

### - [ ] Step 2.4: Add a helper for the mock user

Add a small helper above `AuthProvider` so the user shape isn't duplicated between `signInAsGuest` and rehydration. Insert after `buildFallbackProfile` (around line 41):

```tsx
function buildDemoUser(createdAt: Date): User {
  return {
    id: 'demo-user-id',
    app_metadata: {},
    user_metadata: { full_name: 'Demo Principal', role: 'admin' },
    aud: 'authenticated',
    email: 'demo@scholara.com',
    created_at: createdAt.toISOString(),
  }
}
```

### - [ ] Step 2.5: Add demo state + rehydration logic

In `AuthProvider`, after the existing `useState` declarations (line 46), add:

```tsx
const [demoStatus, setDemoStatus] = useState(() => getDemoStatus())
const isDemo = user?.id === 'demo-user-id'
const demoExpiresAt =
  demoStatus.kind === 'active' || demoStatus.kind === 'expired'
    ? demoStatus.expiresAt
    : null
const demoExpired = demoStatus.kind === 'expired'
```

Then modify the existing `initializeAuth` function (around lines 84–95) to add a rehydration branch when there is no Supabase session. Replace the body of `initializeAuth` with:

```tsx
const initializeAuth = async () => {
  const { data: { session: s } } = await supabase.auth.getSession()

  if (!mounted) return

  if (s?.user) {
    setSession(s)
    setUser(s.user)
    await fetchAndSetProfile(s.user)
    setLoading(false)
    return
  }

  // No real session — check demo
  const status = getDemoStatus()
  setDemoStatus(status)
  if (status.kind === 'active') {
    const demoUser = buildDemoUser(status.startedAt)
    setUser(demoUser)
    setProfile(buildFallbackProfile(demoUser))
  }
  setLoading(false)
}
```

### - [ ] Step 2.6: Update `signInAsGuest`

Replace the existing `signInAsGuest` (lines 136–151) with:

```tsx
async function signInAsGuest() {
  setLoading(true)
  try {
    const { startedAt } = startDemo() // throws DemoExpiredError if expired
    setDemoStatus(getDemoStatus())
    const demoUser = buildDemoUser(startedAt)
    setUser(demoUser)
    setProfile(buildFallbackProfile(demoUser))
  } finally {
    setLoading(false)
  }
}
```

### - [ ] Step 2.7: Add demo state to the context value

Update the `<AuthContext.Provider value={...}>` block (around lines 184–189) to include the new fields:

```tsx
<AuthContext.Provider value={{
  user, session, profile, loading,
  isDemo, demoExpiresAt, demoExpired,
  signInWithGoogle, signInAsGuest, signInWithEmail,
  signUpWithEmail, signOut, resetPassword,
}}>
```

### - [ ] Step 2.8: Run both test files, verify they pass

```bash
npm test -- src/test/demo-status.test.ts src/test/auth-context-demo.test.tsx
```

Expected: all tests PASS (15 total). If a test about `demoExpired` fails because the auth state listener clobbers `demoStatus`, ensure the `setDemoStatus(getDemoStatus())` call happens once per mount inside `initializeAuth` (not in the listener).

### - [ ] Step 2.9: Type-check the project

```bash
npx tsc --noEmit
```

Expected: 0 errors. (Existing `tsc` should already pass; this confirms our new types compile.)

### - [ ] Step 2.10: Commit

```bash
git add src/lib/auth-context.tsx src/test/auth-context-demo.test.tsx
git commit -m "feat(demo): wire 5-day demo clock into AuthContext"
```

---

## Task 3: Login page — expired-state UI

**Files:**
- Modify: `src/pages/LoginPage.tsx`

(No new tests for this task. UI rendering tests would be churn for value; we cover behavior with a manual smoke test in Task 5. Reasoning: the conditional render is a single `if` branch driven by an already-tested flag.)

### - [ ] Step 3.1: Add `demoExpired` to the destructure

Change line 10 in `src/pages/LoginPage.tsx`:

```tsx
const { user, signInWithGoogle, signInWithEmail, signInAsGuest, demoExpired } = useAuth()
```

### - [ ] Step 3.2: Add the expired banner above the form

Locate the existing `{error && (...)}` block (lines 92–97). Insert the demo-expired banner immediately ABOVE it (so the banner appears before any error message):

```tsx
{demoExpired && (
  <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl flex items-start gap-3">
    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
    <div>
      <p className="text-sm font-bold">Your free demo has expired.</p>
      <p className="text-xs font-medium mt-0.5 text-amber-800">
        Sign in with Google to continue.
      </p>
    </div>
  </div>
)}
```

### - [ ] Step 3.3: Hide the email/password form when expired

Wrap the existing `<form onSubmit={handleEmailLogin} ...>` block (lines 99–150) so it only renders when not expired:

```tsx
{!demoExpired && (
  <form onSubmit={handleEmailLogin} className="space-y-4">
    {/* ... existing form children unchanged ... */}
  </form>
)}
```

Also wrap the `<div className="relative my-8">...{/* Or continue with */}...</div>` divider (lines 152–159) in the same `{!demoExpired && (...)}` so the divider only shows when the form is visible.

### - [ ] Step 3.4: Hide the "Free Demo Access" button when expired

Wrap the demo button (lines 175–182) in `{!demoExpired && (...)}`:

```tsx
{!demoExpired && (
  <button
    onClick={handleDemoLogin}
    disabled={loading || googleLoading || demoLoading}
    className="w-full h-12 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black transition-all shadow-lg shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
  >
    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
    {demoLoading ? "Initializing..." : "Free Demo Access"}
  </button>
)}
```

### - [ ] Step 3.5: Hide the signup link when expired

The footer link (lines 185–189) invites signup — that path doesn't exist for expired demo users. Wrap it:

```tsx
{!demoExpired && (
  <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
    <p className="text-sm font-bold text-slate-400">
      Don't have an account? <Link to="/signup" className="text-amber-600 font-black hover:underline uppercase tracking-widest text-xs ml-1">Sign up</Link>
    </p>
  </div>
)}
```

### - [ ] Step 3.6: Type-check

```bash
npx tsc --noEmit
```

Expected: 0 errors.

### - [ ] Step 3.7: Commit

```bash
git add src/pages/LoginPage.tsx
git commit -m "feat(demo): show only Google sign-in on login page when demo expired"
```

---

## Task 4: Dashboard banner + mid-session expiry redirect

**Files:**
- Modify: `src/components/DashboardLayout.tsx`

### - [ ] Step 4.1: Update imports

The file already imports `useEffect` and `useLocation` is NOT yet imported (only `Link, useLocation, useNavigate, Outlet` from react-router-dom — verify line 1). The first line of the file currently is:

```tsx
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
```

So `useLocation` IS already imported. Good — no import change needed.

Add `signOut` and the demo flags to the destructure on line 78:

Replace:

```tsx
const { user, profile, signOut } = useAuth();
```

with:

```tsx
const { user, profile, signOut, isDemo, demoExpiresAt, demoExpired, signInWithGoogle } = useAuth();
const { pathname } = useLocation();
```

(The `useLocation` call is being added here; the import already exists.)

### - [ ] Step 4.2: Add the mid-session expiry effect

After the existing `useEffect` blocks inside `DashboardLayout` (around line 101 in the current file, just before the `return (` at line 180), add:

```tsx
useEffect(() => {
  if (isDemo && demoExpired) {
    signOut().then(() => navigate('/login', { replace: true }))
  }
}, [pathname, isDemo, demoExpired, signOut, navigate])
```

This fires once per route change. If demo expired mid-session, the next nav signs them out and bounces to `/login`. The login page will read `demoExpired` and show the expired banner.

### - [ ] Step 4.3: Add the days-left helper

Insert above the `return (` (around line 179):

```tsx
function formatDaysLeft(expiresAt: Date | null): string {
  if (!expiresAt) return ''
  const msLeft = expiresAt.getTime() - Date.now()
  if (msLeft <= 0) return 'Less than a day left'
  const ONE_DAY = 24 * 60 * 60 * 1000
  if (msLeft <= ONE_DAY) return 'Less than a day left'
  const days = Math.ceil(msLeft / ONE_DAY)
  return `${days} days left`
}

const daysLeftText = formatDaysLeft(demoExpiresAt)
```

### - [ ] Step 4.4: Replace the always-on amber banner with a conditional one

Find the existing banner block (lines 183–200 — the `{/* Top Demo Banner */}` div with "You're exploring the Scholara demo workspace"). REPLACE the entire block with:

```tsx
{/* Top Demo Banner — only for active demo users */}
{isDemo && !demoExpired && (
  <div className="fixed top-0 left-0 right-0 h-[44px] bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center gap-3 z-[100] px-4">
    <span className="text-[16px]" aria-hidden>⏳</span>
    <p className="text-[13.5px] font-medium text-slate-900 tracking-tight">
      Demo: <span className="font-semibold">{daysLeftText}</span> · Sign in with Google to keep your work
    </p>
    <button
      onClick={() => signInWithGoogle()}
      className="bg-slate-900 text-white text-[12px] font-semibold px-3 py-1 rounded-md hover:bg-slate-800 transition-colors tracking-tight"
    >
      Sign in with Google
    </button>
  </div>
)}
```

### - [ ] Step 4.5: Make the top padding and sidebar offset conditional

The current layout hardcodes a 44px reserved space at the top (`pt-[44px]` on the outer `<div>` at line 181, and on the sidebar `<aside>` at line 204) for the banner. With the banner now conditional, those paddings must become conditional too — otherwise real Google users see an empty 44px gap.

Replace line 181:

```tsx
<div className="min-h-screen bg-[#f8fafc] flex flex-col pt-[44px] font-sans antialiased">
```

with:

```tsx
<div className={`min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased ${isDemo && !demoExpired ? 'pt-[44px]' : ''}`}>
```

Replace line 204:

```tsx
<aside className="hidden lg:flex flex-col w-[248px] bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30 pt-[44px]">
```

with:

```tsx
<aside className={`hidden lg:flex flex-col w-[248px] bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30 ${isDemo && !demoExpired ? 'pt-[44px]' : ''}`}>
```

Replace line 210 (mobile drawer wrapper, currently `pt-[44px]`):

```tsx
<div className="lg:hidden fixed inset-0 z-40 flex pt-[44px]">
```

with:

```tsx
<div className={`lg:hidden fixed inset-0 z-40 flex ${isDemo && !demoExpired ? 'pt-[44px]' : ''}`}>
```

Replace the header `sticky top-[44px]` (line 222):

```tsx
<header className="sticky top-[44px] z-20 bg-white/85 backdrop-blur-xl border-b border-slate-100 h-16 flex items-center px-4 md:px-6 gap-3">
```

with:

```tsx
<header className={`sticky z-20 bg-white/85 backdrop-blur-xl border-b border-slate-100 h-16 flex items-center px-4 md:px-6 gap-3 ${isDemo && !demoExpired ? 'top-[44px]' : 'top-0'}`}>
```

### - [ ] Step 4.6: Type-check

```bash
npx tsc --noEmit
```

Expected: 0 errors.

### - [ ] Step 4.7: Run the full test suite

```bash
npm test
```

Expected: all tests PASS (existing + 15 new from Tasks 1–2).

### - [ ] Step 4.8: Commit

```bash
git add src/components/DashboardLayout.tsx
git commit -m "feat(demo): add countdown banner and mid-session expiry redirect"
```

---

## Task 5: Manual smoke test + final verification

**Files:** none (verification only).

This task verifies the four user-visible flows. Each step is a manual click-through with explicit pass/fail criteria.

### - [ ] Step 5.1: Start the dev server

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173` or `:8080`). Open DevTools → Application → Local Storage on that origin so you can inspect / clear keys between tests.

### - [ ] Step 5.2: Verify "fresh visitor" flow

Preconditions: in DevTools → Application → Local Storage, delete any `scholara.demo.*` keys.

1. Navigate to `/login`.
2. **Expected:** Email/password form visible, "Free Demo Access" button visible, no expired banner.
3. Click **"Free Demo Access"**.
4. **Expected:** Lands on `/dashboard`. Top amber banner shows "Demo: 5 days left · Sign in with Google to keep your work".
5. **Expected (DevTools → Local Storage):** `scholara.demo.startedAt` and `scholara.demo.expiresAt` are now set, with `expiresAt - startedAt = 5 days`.
6. Refresh the page (F5).
7. **Expected:** Still on `/dashboard`, still showing the demo banner. Demo persisted across refresh. ✓

### - [ ] Step 5.3: Verify "real Google user has no banner" flow

1. Sign out from the demo (click the user menu → Logout, or clear React state).
2. Sign in with Google (real account, if test account available — otherwise skip this sub-step and verify visually that the banner-rendering condition is `isDemo && !demoExpired`).
3. **Expected:** No amber banner across the top. Dashboard content sits flush against the top header. No 44px gap.

### - [ ] Step 5.4: Verify "expired" flow via clock manipulation

1. In DevTools → Application → Local Storage:
   - Set `scholara.demo.startedAt` to `2026-04-20T12:00:00.000Z` (more than 5 days ago).
   - Set `scholara.demo.expiresAt` to `2026-04-25T12:00:00.000Z` (past).
2. Navigate to `/dashboard` (or refresh).
3. **Expected:** Bounced to `/login` (because `ProtectedRoute` sees no user — rehydration skipped expired demo).
4. **Expected on `/login`:** Amber banner reads "Your free demo has expired. Sign in with Google to continue." Email/password form is hidden. "Free Demo Access" button is hidden. Only the **Google** button is visible. Signup footer is hidden.

### - [ ] Step 5.5: Verify "mid-session expiry" flow

1. In DevTools, set localStorage to make the demo active but ending soon:
   - `scholara.demo.startedAt` = now minus 4 days 23 hours 59 minutes
   - `scholara.demo.expiresAt` = now plus 1 minute
2. Refresh `/dashboard`. Confirm banner shows "Less than a day left". Demo user is logged in.
3. Wait ~70 seconds (or set `expiresAt` to a moment in the past while sitting on the page).
4. Click any sidebar nav link (e.g., "Students").
5. **Expected:** Bounced to `/login` with the expired banner visible. Just-elapsed expiry was enforced on next route change.

### - [ ] Step 5.6: Final commit

If any of Steps 5.1–5.5 failed, fix the issue, retest, and commit fixes. If all passed, no code commit is needed for this task. Mark the plan complete.

```bash
git status
```

Expected: working tree clean.

---

## Self-Review Notes (already done at plan-write time)

- **Spec coverage:** Every section of the spec maps to a task —
  - Data model + helpers → Task 1
  - AuthContext changes → Task 2
  - Login page UI → Task 3
  - Dashboard banner + mid-session expiry → Task 4
  - Edge cases / smoke test → Task 5
- **Placeholders:** Searched for "TBD/TODO/etc." — none present. All code blocks are complete.
- **Type consistency:** `isDemo`, `demoExpiresAt`, `demoExpired`, `DemoExpiredError`, `getDemoStatus`, `startDemo`, `clearDemoStorage`, `STARTED_AT_KEY`, `EXPIRES_AT_KEY`, `DEMO_DURATION_MS`, `buildDemoUser` — all names used consistently across Tasks 1–4.
- **Behavior consistency with spec Q1–Q4:** Q1 (only Google when expired) → Task 3 hides email form, signup link, demo button. Q2 (localStorage) → Task 1. Q3 (clock never resets) → `startDemo` returns existing values when active without overwriting (Task 1 step 1.3 + test in step 1.1). Q4 (banner + finish-current-page expiry) → Task 4 step 4.4 (banner) + step 4.2 (route-change effect, no timer).
