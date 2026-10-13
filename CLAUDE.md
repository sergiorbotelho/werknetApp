# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Werk OS App: a Next.js 14 (App Router) frontend for managing customers (`clientes`) and service orders (`ordens de serviço`, "OS"). UI text, domain field names (`nome`, `telefone`, `defeito`, `valServico`…) and code comments are in Brazilian Portuguese. Keep new UI strings in pt-BR. All data comes from an external REST API whose base URL is `NEXT_PUBLIC_API`. The only route handlers in this repo are next-auth's and the profile photo proxy `/api/avatar/[id]`.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build (also the main type-check, since there is no separate tsc script)
npm run start
npm run lint    # next lint; no ESLint config is committed, so the first run prompts to create one
```

There is no test framework set up.

Required env vars (see `.env.example`): `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_API`.

## Architecture

**Auth (next-auth v4, credentials + JWT).** `src/lib/authOptions.ts` posts `{email, password}` to the backend's `/session` and stores the backend's bearer token in the JWT. It then exposes the token as `session.user.token` (the type is augmented in `src/types/next-auth.d.ts`). There is no `middleware.ts`. Route protection happens in `src/app/(auth-routes)/layout.tsx`, which calls `getServerSession` and redirects to `/login`. `src/context/AuthContext.tsx` also redirects on the client when the session becomes unauthenticated. `authorize` calls `/session` with plain axios (not `api`, whose interceptors are browser-only) and throws the API's `message`, which the login page shows from `result.error`. The JWT and the session carry `role` (`"ADMIN" | "BASICO"`, typed in `src/types/user.ts`) and `mustChangePassword`. `useSession().update({ name?, mustChangePassword? })` changes only those two fields (the `jwt` callback ignores anything else, so the role never comes from the client). The role in the session is only refreshed on login; the API is the source of truth and answers 403 "Acesso negado".

**Single active tab + logout on close:** `src/app/components/tab-guard.tsx` is mounted in the `(auth-routes)` layout, and its constants live in `src/lib/tab-session.ts`. On each tab load, it pings other tabs over `BroadcastChannel` and waits 300 ms for replies.
- **No other tab answers:** the tab stays logged in only if two things are true. Its `sessionStorage` flag must exist (the login page sets it with `markTabSession()`). And the `localStorage` heartbeat must be under 30 s old. Otherwise the tab calls `signOut`. This is how "closing the browser or tab logs out" is implemented. next-auth always sets `expires` on its cookie, so a browser-session cookie isn't an option. The session `maxAge` is 12 h, and since `updateAge` is the default 24 h, the session is never extended.
- **Another tab answers:** the session stays valid. The newest tab always becomes the active one and broadcasts `takeover`. Every other tab shows a WhatsApp-style "aberto em outra aba" overlay, and its favicon becomes a red exclamation mark. "Usar aqui" reloads that tab, which then takes over the same way.

**Roles and password change:**
- `(auth-routes)/layout.tsx` redirects to `/alterar-senha` when `session.user.mustChangePassword`. `/alterar-senha` lives outside `(auth-routes)` (no sidebar) and mounts `TabGuard` itself, so the heartbeat keeps running while the user creates the password. It checks `GET /me` on the server, not the session, because the admin can reset a password while the session is open.
- `/perfil` redirects to `/alterar-senha` when `GET /me` says the change is pending. `/alterar-senha` renders `profile/clear-password-flag.tsx` when the session flag is stale (the API says it is not pending), to avoid a redirect loop.
- When the API answers 403, both axios clients call `GET /me`; if `mustChangePassword` is true, the browser client does `window.location.assign("/alterar-senha")` and the server client calls `redirect("/alterar-senha")`.
- `/usuarios` is admin-only (server redirect to `/` otherwise, and the sidebar item only shows for admins). Creating a user or resetting a password shows `users/temporary-password-dialog.tsx`, which only closes through its button. `/perfil` changes the user's own name and password with `profile/change-password-form.tsx`, shared with `/alterar-senha`.
- The "Excluir" buttons in the customer and OS modals only render for `role === "ADMIN"`.

**Two axios clients, depending on where code runs:**
- `src/services/api/api.ts` (`api`) is for client components. A request interceptor pulls the token from `getSession()` and caches it in a module variable. A 401 response clears the token and calls `signOut({ callbackUrl: "/login" })`.
- `src/services/api/serverApi.ts` (`getServerApi()`) is for server components. It builds a fresh axios instance with the token from `getServerSession(authOptions)`.

**Data-fetching patterns differ by page:**
- `/customers` is a server component. It fetches with `getServerApi()` and passes the data to client components. After a mutation, the client modals call `router.refresh()` to re-fetch.
- `/` (the service orders list, route group `(serviceorder)`) and `/customers/[id]` are client-side. They fetch in `useEffect` with `api`, keep the results in local state, and pass a `loadOrders` callback into the modal so it can reload after a mutation.

**Backend endpoints in use:** `/session`, `/me` (GET, PUT), `/me/password`, `/me/avatar` (PUT raw JPEG, DELETE), `/users/:id/avatar` (only through the proxy), `/users` (list, create), `/users/:id`, `/users/:id/reset-password`, `/customers` (list, `data.customers`), `/customer` and `/customer/:id` (CRUD), `/os` (list, `data.os`), `/os/:id`, `/os/:id/pdf`, `/os/client/:customerId`.

**Feature components** live under `src/app/components/{customers,serviceOrder,users,profile}/`. Each feature has a list container, a card, a skeleton, and a create/edit modal. The modals use react-hook-form with zod schemas. Feedback is shown with `react-toastify`. Shared pieces are `header.tsx` (page title plus a "new" button) and `confirmation-modal.tsx` (the delete confirmation).

**Profile photo:**
- `src/app/components/user-avatar.tsx` (`UserAvatar`) shows the user's photo, or the initials when `avatarUpdatedAt` is null or the image fails to load. It is used in `/perfil` and in the user list (with `alt=""`, because the name is next to it).
- The image `src` is `/api/avatar/<id>?v=<avatarUpdatedAt>`. The route handler `src/app/api/avatar/[id]/route.ts` validates the UUID, reads the token with `getServerSession` and proxies `GET /users/:id/avatar`, because an `<img>` cannot send the `Authorization` header. It answers with `Cache-Control: private, max-age=31536000, immutable` (a new photo means a new `?v=`) and `X-Content-Type-Options: nosniff`.
- `next/image` must keep `unoptimized` there. Without it, the request goes through `/_next/image`, which fetches from the server without the user's cookie (401) and caches by URL.
- In `/perfil`, the camera button opens a file input (JPEG/PNG/WebP up to 10 MB). `profile/avatar-crop-dialog.tsx` crops with `react-easy-crop` and `src/helpers/cropImage.ts` draws a 512×512 JPEG (white background for transparent PNGs) that is sent to `PUT /me/avatar`. The `Cropper` mounts only after the dialog's zoom-in animation ends, because it measures its container with `getBoundingClientRect` and would get a 5% smaller crop area mid-animation.

**Modal convention:** each modal renders with `open={true}`. The parent mounts it conditionally (`isModalOpen || selected !== null`) and passes `isEditing` plus the selected entity. One modal handles create, edit, and delete.

**Form ↔ API data conversions:**
- Currency fields are kept as pt-BR strings while the user types (`formatCurrency`). They are converted with `currencyToNumber` before sending. Both helpers are in `src/helpers/formatterCurrentValue.ts`.
- Customer `telefone`, `cpf`, `cnpj`, and `cep` are masked with `react-input-mask` in the form and stripped to digits before sending. A customer needs either a CPF or a CNPJ (zod `refine`).
- Typing an 8-digit CEP auto-fills the address fields from the external ViaCEP API (`viacep.com.br`).
- In the service order form, the field `nome` actually holds the customer id and is sent as `cliente_id`. `tipoServico` is one of `FORADEGARANTIA`, `GARANTIA`, `ORCAMENTO`, or `CONTRATO`.

**PDF generation and viewing:**
- **Viewing modal:** the "Visualizar PDF" buttons open `serviceOrder/order-pdf-modal.tsx`. The modal fetches the PDF from the API (`GET /os/:id/pdf` with `responseType: "blob"`). The API generates it on every request from the current OS data. The modal renders pages to canvas with `react-pdf` in `pdf-viewer.tsx`, loaded through `next/dynamic` with `ssr: false`. iframes are deliberately not used for viewing, because iOS Safari shows only page 1 and Android Chrome shows nothing.
- **Floating buttons:** on desktop, Download, and Imprimir, which loads the PDF into a hidden iframe and calls `print()` on it (falling back to a new tab if that throws). On mobile (`pointer: coarse`), Compartilhar via `navigator.share` with the file (falls back to Download when sharing isn't supported), and Imprimir, which opens the PDF blob URL in a new tab with the native viewer.
- **Opening tabs:** any `window.open` must happen synchronously in the click handler, before any `await`. Otherwise iOS Safari silently blocks it. The PDF blob is already loaded when the buttons appear, so the handlers open it directly.
- **pdf.js worker:** it is served from `public/pdf.worker.min.mjs`, which is gitignored and copied by the `postinstall` script. If it is bundled with `new URL(..., import.meta.url)`, Next 14's minifier fails the build. `react-pdf` is pinned to v10 because v11 requires React 19.
- **pdf.js loader:** `next.config.mjs` runs `pdfjs-dist/build/pdf.mjs` through `scripts/pdfjs-exports-loader.cjs`. The loader renames the bundle's own `__webpack_exports__` variable. Without it, the variable shadows webpack's module parameter in dev (strict `eval`) and throws `TypeError: Object.defineProperty called on non-object`. Remove the loader when upgrading to Next 15.

**UI:** shadcn/ui ("default" style, neutral base, CSS variables in `src/app/globals.css`, theme tokens in `tailwind.config.ts`), plus `next-themes` for dark mode. The `@/*` alias maps to `src/*`. Existing shadcn primitives are in `src/app/components/ui/`, but `components.json` aliases `ui` to `@/components/ui` (that is, `src/components/ui`). Running `npx shadcn add` will therefore put new components in a different folder from the existing ones, so move them or fix the imports. `src/components/` currently holds only `sidebar-nav.tsx`, which is the app's navigation ("Usuários" only for admins, "Meu perfil" for everyone) and logout.

**Styling gotcha (Tailwind v3.4 with v4-style CSS):** `globals.css` defines theme colors as raw `oklch(...)` CSS variables. `tailwind.config.ts` maps them as `var(--x)`, without `<alpha-value>`. Because of that, Tailwind v3 silently generates **no CSS** for opacity modifiers on theme colors (`bg-accent/30`, `text-foreground/80`, `border-border/50`), and several existing usages of these classes do nothing. Plain `bg-primary` works, and so do opacity modifiers on built-in colors (`bg-white/20`). The `@theme inline` and `@custom-variant` blocks in `globals.css` are Tailwind v4 syntax and are ignored by v3. Custom utilities `bg-hero`, `bg-card-gradient`, `shadow-elegant`, `shadow-glow`, and `text-gradient` are defined in `globals.css`.

**Unused or stale code (do not build on it without checking):**
- `sheetGlobal.tsx` is the old menu. It is commented out and links to a nonexistent `/serviceorder` route.
- `timePicker.tsx` is unused. The form uses `<Input type="time">`.
- `src/lib/logout-server.ts` is unused and redirects to a nonexistent `/sign-in`. Logout is `signOut()` in the sidebar.
- `AuthContext` is provided at the root but never consumed. Components read the session through next-auth directly.

**Other quirks:**
- The client `api` caches the token in a module variable and only clears it on a 401. Switching users without a full page reload can therefore keep using the previous token.
- `ThemeProvider` is mounted twice, at the root and again in the `(auth-routes)` layout.
- `/login/layout.tsx` redirects users who are already authenticated to `/`.

TypeScript runs with `strict: false`.
