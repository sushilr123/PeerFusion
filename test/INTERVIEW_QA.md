# PeerFusion Interview Q&A (100)

A curated set of interview questions and concise answers tailored to the PeerFusion MERN project.

## Overview & Value (1–10)

1. Q: What is PeerFusion?
   A: A MERN-based developer networking platform with discovery, connections, chat, and premium plans.
2. Q: Who is the target audience?
   A: Developers and tech professionals seeking meaningful professional connections.
3. Q: Core features implemented?
   A: Auth, profiles, discovery feed, connection requests, real-time chat, payments/premium.
4. Q: Why MERN stack?
   A: Full JavaScript stack, rapid iteration, wide ecosystem, and scalable patterns.
5. Q: What problem does it solve?
   A: Matching developers by skills/interests to collaborate and grow networks.
6. Q: What differentiates it from generic networks?
   A: Skill-centric matching, developer profiles, and real-time collaboration tools.
7. Q: Non-functional goals?
   A: Security, responsiveness, maintainability, scalability, observability.
8. Q: How is responsiveness ensured?
   A: CSS variables, utility classes, mobile-first media queries in App.css.
9. Q: What’s the premium value?
   A: Visibility boost, advanced filters, analytics, and higher limits.
10. Q: How is documentation handled?
    A: Rich README, apiList.md, and scripts for data setup.

## Repository & Architecture (11–20)

11. Q: Repo layout overview?
    A: Backend in `src/`, frontend in `fronted/`, utility scripts in `scripts/`.
12. Q: Where are models and routes?
    A: `src/models` and `src/routes` respectively.
13. Q: Where is the Express app entry?
    A: `src/app.js`.
14. Q: Where are environment variables used?
    A: Backend via `.env`, frontend via `import.meta.env.VITE_*`.
15. Q: Where is auth middleware?
    A: `src/middlewares/auth.js`.
16. Q: Where are utilities (email, payments, sockets)?
    A: `src/utils/` (sendEmail, razorpay, socket, validation, cronjob).
17. Q: Frontend entry points?
    A: `fronted/src/main.jsx` and `fronted/src/App.jsx`.
18. Q: Frontend auth context/hook?
    A: `fronted/src/contexts/AuthContext.jsx` and `fronted/src/hooks/useAuth.js`.
19. Q: Ports used in dev?
    A: Backend 7777, Vite dev server ~5173/5174.
20. Q: How are scripts orchestrated?
    A: `package.json` scripts: dev, seed, clean, verify, etc.

## Backend API & Express (21–30)

21. Q: How are routers mounted?
    A: In `app.js` under feature prefixes (auth, profile, request, chat, payment).
22. Q: CORS setup?
    A: `cors` middleware with credentials and allowed origin(s).
23. Q: Cookie parsing?
    A: `cookie-parser` to read httpOnly JWT cookie.
24. Q: Request validation?
    A: `src/utils/validation.js` + `validator` lib per route.
25. Q: Error handling approach?
    A: try/catch in handlers; consistent `{success,message,errors}` responses.
26. Q: Pagination approach?
    A: Query params `page/limit`, MongoDB `skip/limit`, indexes.
27. Q: Rate-limiting plan?
    A: Add `express-rate-limit` for login/payment sensitive routes.
28. Q: Constants location?
    A: `src/utils/constants.js` for roles/statuses/limits.
29. Q: API documentation sources?
    A: `apiList.md` and README endpoint summaries.
30. Q: Scheduled jobs?
    A: `node-cron` in `src/utils/cronjob.js` (e.g., plan expiry checks).

## Authentication & Security (31–40)

31. Q: Auth mechanism?
    A: JWT stored in httpOnly cookie; verified in middleware.
32. Q: Why httpOnly cookies?
    A: Prevents JS access, reducing XSS token theft risk.
33. Q: Password storage?
    A: `bcrypt` hashed with salt; never in plain text.
34. Q: Protecting routes?
    A: `auth` middleware attaches `req.user` after JWT verification.
35. Q: Logout flow?
    A: Server clears cookie; client redirects to landing.
36. Q: Password reset design?
    A: Email token with expiry (SES) and secure update endpoint.
37. Q: Brute-force mitigation?
    A: Rate limit + backoff + lockout window for repeated failures.
38. Q: Input sanitization?
    A: `validator` and manual trimming/whitelisting.
39. Q: CORS security?
    A: Restrict origins, allow credentials, limit headers/methods.
40. Q: JWT expiry handling?
    A: Verify on each request; re-auth on expiry.

## MongoDB & Mongoose (41–50)

41. Q: Core collections?
    A: users, connectionRequests, chats, payments.
42. Q: User schema fields?
    A: Email, name, passwordHash, bio, skills, location, premium flags.
43. Q: Connection model purpose?
    A: Track sender/receiver/status with timestamps.
44. Q: Chat model shape?
    A: Participants + embedded messages (sender, text, readAt).
45. Q: Why embedded messages?
    A: Simpler per-conversation reads; adequate for moderate volume.
46. Q: Indexes used?
    A: Unique email; participants compound; request pair uniqueness.
47. Q: Duplicate connection prevention?
    A: Compound unique index on user pairs and pre-checks.
48. Q: Mutual connections query idea?
    A: Aggregate accepted requests and intersect user sets.
49. Q: Skills search?
    A: `$in`/`$all` queries; consider text index for bios.
50. Q: Transactions use?
    A: Mongo sessions for multi-doc atomic operations when needed.

## Connections & Feed (51–60)

51. Q: Connection statuses?
    A: pending, accepted, rejected/cancelled.
52. Q: Sending a request?
    A: Create request if none exists; notify receiver.
53. Q: Accepting a request?
    A: Update status; optionally create chat stub.
54. Q: Cancelling/rejecting?
    A: Update status; keep audit trail.
55. Q: Feed generation principle?
    A: Exclude any existing relationship; rank by skill overlap/recency.
56. Q: Duplicate suppression in feed?
    A: Filter by existing requests and connections both directions.
57. Q: Relevance scoring inputs?
    A: Skills, proximity, activity, profile completeness.
58. Q: Feed pagination?
    A: `page/limit` with deterministic sort.
59. Q: Connection analytics?
    A: Aggregate counts, growth over time, acceptance ratio.
60. Q: Blocking support plan?
    A: Maintain blocklist; enforce in feed/chat queries.

## Real-time Chat & Socket.io (61–70)

61. Q: Socket auth?
    A: Validate token on handshake; map user to room.
62. Q: Message delivery path?
    A: Persist to DB, then emit to recipient’s user room.
63. Q: Unread count logic?
    A: `readAt` null until viewed; counts aggregated per chat.
64. Q: Offline recipient handling?
    A: Persist; client fetches on reconnect/open.
65. Q: Typing indicators?
    A: Debounced `typing` events in conversation room.
66. Q: Socket security?
    A: Namespace/room checks and server-side authorization.
67. Q: Message updates/deletes?
    A: Update by messageId; soft delete with audit fields.
68. Q: Ordering of messages?
    A: Server timestamp; sorted by createdAt.
69. Q: Scaling sockets?
    A: Redis adapter for multi-instance pub/sub.
70. Q: Delivery acknowledgments?
    A: Emit sent/delivered/read events for UX feedback.

## Payments & Premium (71–80)

71. Q: Order creation?
    A: Backend calls Razorpay API; returns `order_id` to client.
72. Q: Payment verification?
    A: Check signature (HMAC) with `order_id` and `payment_id`.
73. Q: Subscription storage?
    A: Payment doc with plan/status/startAt/endAt; user premium flags.
74. Q: Webhook handling?
    A: Verify signature; idempotent updates of payment state.
75. Q: Prevent double-crediting?
    A: Idempotency keys/unique constraints per payment ref.
76. Q: Premium-gated features?
    A: Advanced filters, boosts, analytics, unlimited messaging.
77. Q: Plan expiry flow?
    A: Cron downgrades on `endAt`, notifies user.
78. Q: Refunds/cancellations?
    A: Update status, adjust access, maintain audit log.
79. Q: Client secret handling?
    A: Never expose secrets; only server touches Razorpay secret.
80. Q: UI premium indicators?
    A: Crown badge in Navbar/Profile; plan status display.

## Frontend (React, Vite) (81–90)

81. Q: Why Vite for frontend?
    A: Fast HMR, ESBuild, minimal config, optimized build.
82. Q: Routing strategy?
    A: React Router v6; `ProtectedRoute.jsx` for guards.
83. Q: Auth state management?
    A: Context in `AuthContext.jsx` + `useAuth` hook.
84. Q: Axios setup?
    A: `services/api.js` with baseURL, credentials, interceptors.
85. Q: Handling 401s?
    A: Interceptor logs out/redirects; clears state.
86. Q: Socket client init?
    A: `services/socket.js` with auth and event handlers.
87. Q: Navbar responsiveness?
    A: `Navbar.jsx` toggles mobile menu; CSS in `Navbar.css`.
88. Q: Performance tactics?
    A: Route-level code-splitting, memoization, image optimization.
89. Q: Env vars in UI?
    A: Use `import.meta.env.VITE_*`; no secrets in frontend.
90. Q: Form UX patterns?
    A: Controlled inputs, validation hints, disabled submit during pending.

## UI/UX & Styling (91–100)

91. Q: Design system location?
    A: `fronted/src/App.css` defines colors, spacing, radii, shadows, transitions.
92. Q: Button styles?
    A: `.btn`, `.btn-primary`, `.btn-outline`, and size variants.
93. Q: Form styles?
    A: `.form-input` focus ring, error states, consistent spacing.
94. Q: Card and container styles?
    A: `.card` shadows/radii; `.container` max-width and responsive padding.
95. Q: Loading feedback?
    A: Global `.spinner` and layout-aware loading containers.
96. Q: Accessibility considerations?
    A: Focus styles, semantic markup, contrast-aware palette.
97. Q: Mobile-first adjustments?
    A: Breakpoints at 768px/480px with stacked layouts and reduced paddings.
98. Q: Profile page styling?
    A: `pages/Profile.css` with gradient header, avatar editing, detail grids.
99. Q: Active nav highlighting?
    A: Compare `useLocation().pathname` to item path; apply `active` class.
100.  Q: Consistent theming?
      A: Centralized CSS variables in `:root`; reused utilities across components.

---

Tip: For deeper dives, be ready to discuss trade-offs (e.g., embedded vs separate message collections, cookie vs localStorage for tokens, and scaling sockets with Redis).
