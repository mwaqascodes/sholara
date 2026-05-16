# 5-Day Free Demo Access Limit — Design

**Date:** 2026-04-26
**Status:** Approved (pending implementation plan)

## Goal

Today, clicking "Free Demo Access" on the login page creates an in-memory mock user that disappears on page refresh — effectively a one-tab session. We want to convert this into a real 5-day demo that persists across refreshes, then expires permanently and forces the user to sign in with Google to continue.

## Current State (as of 2026-04-26)

- **Login page** ([src/pages/LoginPage.tsx](../../../src/pages/LoginPage.tsx)) — has a "Free Demo Access" button that calls `signInAsGuest()`.
- **Auth context** ([src/lib/auth-context.tsx](../../../src/lib/auth-context.tsx) — `signInAsGuest`) — creates a mock `User` object in React state with `id: 'demo-user-id'`, `email: 'demo@scholara.com'`. No persistence. No Supabase row.
- **Protected routes** ([src/components/ProtectedRoute.tsx](../../../src/components/ProtectedRoute.tsx)) — accepts either a real Supabase session **or** the in-memory mock user as authenticated.
- Refresh wipes the mock user → user is bounced to `/login`.

## Decisions Locked During Brainstorming

| # | Decision |
|---|---|
| Q1 | When demo expires, send user to login with a banner; **only Google sign-in is visible** (email/password form and demo button are hidden). |
| Q2 | Track the 5-day clock in `localStorage` only. No Supabase changes. Anti-abuse is not a goal — bypass via clearing browser data is acceptable. |
| Q3 | The clock starts on the **first ever** click of "Free Demo Access" on this browser and never resets. Subsequent clicks during the active window do not extend or restart it. |
| Q4 | During the demo, show a countdown banner on the dashboard. On expiry mid-session, do NOT log the user out immediately — let them finish the current page; the next route navigation or refresh logs them out. |

## Data Model

Two `localStorage` keys, browser-side only. Both are written together at the same moment.

| Key | Value | Written when | Read when |
|---|---|---|---|
| `scholara.demo.startedAt` | ISO 8601 timestamp | First ever call to `signInAsGuest()` (no existing key) | App load (rehydration), every render that needs `isDemo` / countdown / expired-status |
| `scholara.demo.expiresAt` | ISO 8601 timestamp = `startedAt + 5 days` | Same write as `startedAt` | Same as above |

`expiresAt` is stored explicitly (rather than recomputed from `startedAt`) so the "5 days" constant lives in one place at write time and is trivial to change later without recomputing for old browsers.

### Derived demo state

A pure helper (`getDemoStatus(now: Date)`) reads the two keys and returns one of:

- `not_started` — neither key exists → user has never used the demo on this browser.
- `active` — both keys exist and `now < expiresAt` → user is in their 5-day window.
- `expired` — both keys exist and `now >= expiresAt` → demo has run out.

All UI gates and auth-context logic derive from this helper.

## Auth Context Changes

[src/lib/auth-context.tsx](../../../src/lib/auth-context.tsx) gains the following on its context value:

```ts
isDemo: boolean              // true when current user IS the mock demo user
demoExpiresAt: Date | null   // null unless demo is active or expired
demoExpired: boolean         // true if startedAt exists AND now >= expiresAt
```

### `signInAsGuest()` — new behavior

1. Compute `getDemoStatus(now)`.
2. If status is `expired` → throw a typed error `DemoExpiredError` (defensive backstop; the login button is hidden in this state, but the function must refuse anyway).
3. If status is `not_started` → write both `startedAt` and `expiresAt` to `localStorage`, then create the mock user in React state (today's behavior).
4. If status is `active` → do NOT write anything to `localStorage` (preserves Q3: clock never resets). Just create the mock user in React state — i.e., "resume demo".

### `AuthProvider` mount — new rehydration step

After the existing `getSession()` Supabase check finds **no** real session, also check `getDemoStatus(now)`:

- If `active` → recreate the mock user in React state (same shape as `signInAsGuest` produces). This is what makes the demo persist across refreshes.
- If `expired` or `not_started` → do nothing. User remains logged out and `ProtectedRoute` will redirect them to `/login`.

### `signOut()`

Existing behavior unchanged — clears React state. **Does NOT clear `localStorage` demo keys.** This means a user who signs out of the demo on day 2 and returns on day 4 sees ~1 day left, not a fresh 5.

## UI Changes

### Login page — [src/pages/LoginPage.tsx](../../../src/pages/LoginPage.tsx)

Read `demoExpired` from the auth context.

- **When `demoExpired === true`:**
  - Show a top-of-card banner (red/amber): *"Your free demo has expired. Sign in with Google to continue."*
  - **Hide** the email/password form (don't render).
  - **Hide** the "Free Demo Access" button (don't render).
  - Render only the **Google** button.
- **Otherwise:** the page looks exactly as it does today.

### Dashboard layout — [src/components/DashboardLayout.tsx](../../../src/components/DashboardLayout.tsx)

When `isDemo === true`, render a slim banner pinned to the top of the dashboard area:

> ⏳ Demo: **{N} days left** · Sign in with Google to keep your work · `[Sign in with Google]`

Days-left text rules:
- `daysLeft = ceil((expiresAt - now) / 1 day)` so the first 24 hours of the window reads as "5 days left," not "4."
- When `daysLeft <= 1`, render **"Less than a day left"** instead of "0 days left" or "1 day left" — avoids the confusing "0".
- Banner is recomputed on every render of `DashboardLayout`. No interval timer required (the user will trigger re-renders by interacting; they'll see updates within seconds of any nav).

The "Sign in with Google" button calls `signInWithGoogle()` directly. (Supabase's OAuth redirect handles the rest of the flow.)

### Mid-session expiry check — [src/components/DashboardLayout.tsx](../../../src/components/DashboardLayout.tsx)

Add a `useEffect` that depends on `useLocation().pathname`:

```ts
useEffect(() => {
  if (isDemo && demoExpired) {
    signOut().then(() => navigate('/login', { replace: true }))
  }
}, [pathname, isDemo, demoExpired])
```

This fires once per route change inside the dashboard. It implements Q4: the user finishes the current page, then the next nav kicks them out. The login page will then show the expired banner (because `demoExpired` is still true and the login page reads it).

## Edge Cases

| Case | Behavior |
|---|---|
| Refresh during active demo | `AuthProvider` rehydrates mock user from localStorage; banner stays; countdown continues. |
| Sign out demo on day 2, return day 4 | Clock keeps running. ~1 day left on return. (Per Q3.) |
| Click "Free Demo Access" on day 6 (expired) | Login page hides the button anyway. `signInAsGuest()` throws `DemoExpiredError` as a defensive backstop. |
| User rolls back system clock to extend demo | Accepted. We trust `Date.now()`. localStorage is bypass-prone by design (Q2). |
| User clears browser storage | Gets a fresh 5 days. Acceptable per Q2. |
| Clock ticks over while user sits on dashboard with no nav | They keep using it until next nav or refresh. (Per Q4.) |
| Real Google-signed-in user | `isDemo === false`. No banner, no expiry check, no localStorage interaction. Demo logic only runs for the mock user. |

## Testing

The project uses Vitest. Add unit tests around the new pure logic:

1. `getDemoStatus(now, startedAt, expiresAt)` returns the right state at boundaries — 4d 23h 59m before expiry → `active`; exactly at expiry → `expired`; 1m past expiry → `expired`.
2. `signInAsGuest()` writes `startedAt` + `expiresAt` to localStorage on first call, and does NOT overwrite on a second call within the active window.
3. `signInAsGuest()` throws `DemoExpiredError` when called in expired state.
4. `AuthProvider` mount rehydrates the mock user when `getDemoStatus` is `active`, and does not when `expired` or `not_started`.

No Playwright end-to-end test for this. The unit tests on the time helper catch the real failure modes; full e2e is too slow for the value.

## Out of Scope

The following were considered and explicitly excluded:

- **Server-side / Supabase enforcement of the demo clock** — rejected in Q2.
- **Anonymous Supabase users for the demo** — rejected in Q2.
- **A separate `/demo-expired` page** — rejected in Q1 (we use the login page itself with a banner).
- **Saving students/teachers to Supabase** — separate feature, separate brainstorm.
- **Whole-site broken-button audit** — separate effort, deferred.
