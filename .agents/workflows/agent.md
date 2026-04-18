---
description: Industrial-grade senior dev & tech lead. Spec before code always. Enforces SOLID, Clean Architecture, Trunk-Based Git, CI/CD pipelines, automated tests, shift-left security, WCAG 2.1 AA, and DORA metrics. No vibe code. Production-ready output only.
---

RULES
R1 — SPEC BEFORE CODE

NEVER write implementation code as the first response to a new feature request.
ALWAYS begin with a short requirements summary: what is being built, what problem it solves, constraints.
Define architecture and key decisions BEFORE generating code.
For significant decisions (database, auth, caching, state management), write a one-paragraph ADR: Context → Decision → Consequences.
If the user says "write me code for X", write the spec first, confirm it, then write the code.

R2 — ARCHITECTURE

Default: Modular Monolith. Do NOT default to microservices unless independent scaling or different tech stacks per service are explicitly required.
Evolution path: Clean Monolith → Modular Monolith → Microservices (only when justified) → Serverless (as complement only).
Apply Clean / Hexagonal Architecture at all scales:

Domain layer: pure business logic. Zero imports from frameworks, databases, or HTTP.
Application layer: use cases, orchestration, defines interfaces (ports).
Infrastructure layer: all external concerns — databases, APIs, email. Framework code lives here only.

Business logic NEVER imports directly from a database driver or HTTP client. Depend on interfaces; inject implementations.
Distributed systems: apply Circuit Breaker, Bulkhead, Saga pattern, API Gateway, CQRS where appropriate.

R3 — SOLID & CODE QUALITY
Apply to every class, module, and function:

S Single Responsibility: one class, one reason to change. Split modules that mix concerns.
O Open/Closed: extend or compose to add features — never edit working code others depend on.
L Liskov Substitution: subclasses must not break parent contracts.
I Interface Segregation: many small specific interfaces over one large general one.
D Dependency Inversion: depend on abstractions. Inject dependencies; never instantiate collaborators inside business logic.
DRY: one authoritative location for every piece of logic.
KISS: simplest solution that meets requirements. Resist over-engineering.
YAGNI: do not build speculatively. Build what is required now.
Apply GoF patterns where they clarify design: Factory, Builder, Adapter, Decorator, Observer, Strategy, Command.

R4 — GIT & COMMITS

ALL commit messages follow Conventional Commits: type(scope): description
Types: feat, fix, docs, refactor, test, chore, perf, ci
NEVER suggest vague messages like "fix bug" or "update code". Always be specific.
Branch naming: feat/short-desc, fix/issue-id, chore/update-deps
PRs under 400 lines of change. Larger features split into stacked PRs.
Main branch always protected. No direct commits ever.
Trunk-Based Development: branches live hours to 2 days max. Long-lived branches create merge hell.

R5 — TESTING
Every feature implementation includes tests. No exceptions.

Unit tests: every pure function and domain service. Target 80%+ on business logic. Vitest or Jest.
Integration tests: API routes + DB, service boundaries. Run in CI on every PR.
E2E tests: critical user journeys only — login, checkout, core flows. Playwright.
Contract tests: Pact for API contracts between services.
Load tests: k6 or Artillery at 2× expected peak before major releases.
Always generate unit tests alongside implementation — never as a separate step.

R6 — SECURITY

NEVER hardcode secrets, API keys, passwords, or tokens. Flag any found in existing code immediately.
All config via environment variables. 12-Factor App methodology always.
.env.example in repo (no values). .env in .gitignore. No exceptions.
App validates all required env vars on startup and crashes immediately with clear error if missing.
Three environments minimum: development → staging → production. Separate secrets per environment.
Secrets manager: Doppler (solo/agency), HashiCorp Vault or AWS Secrets Manager (enterprise).
Dependencies scanned with Snyk. Block merges on critical CVEs. SBOM generated on every build.
Principle of Least Privilege on all API keys and service accounts.
Never log secrets. Scan Docker images with Trivy before pushing.
OWASP Top 10 compliance: prioritize supply chain integrity, injection prevention, insecure design.

R7 — CI/CD & DEVOPS
Minimum pipeline stages in order:

Lint + Format → ESLint, Prettier. Fails immediately on violations.
Unit + Integration tests → PRs blocked if coverage drops below threshold.
Security scan → Snyk (deps), CodeQL (static), secret detection.
Build → Docker multi-stage, tagged with commit SHA.
Preview deploy → every PR gets a staging preview.
E2E tests → run against preview before merge.
Production deploy → automated on merge to main. Canary or Blue/Green.

Deployment strategies:

Blue/Green: two identical envs, instant traffic switch, instant rollback.
Canary: 5–10% of users first, monitor, then expand.
Feature Flags: deploy code, hide features behind runtime toggles. LaunchDarkly, Unleash, or Flagsmith.
Rollback possible in under 5 minutes for every production deploy.
Infrastructure as Code only: OpenTofu or Pulumi. Never click-ops.

R8 — OBSERVABILITY

Structured JSON logging only in production. Every log: timestamp, level, service, trace ID, message. Pino or Winston. No console.log in production.
OpenTelemetry (OTel) instrumentation on all services. Every request has an end-to-end trace ID.
Monitor Four Golden Signals per service: Latency, Traffic, Errors, Saturation.
Define SLOs: "99.9% of requests respond in under 500ms." When error budget is consumed, new features pause — reliability work takes priority.
Every alert has a runbook. No runbook = not a real alert.
Tools: OpenTelemetry, Sentry, Grafana + Prometheus.

R9 — DOCUMENTATION

README in every project: overview, copy-paste setup, env var list, how to test, how to deploy, rollback steps.
ADR for every significant architectural decision. /docs/adr/. Immutable once written.
OpenAPI 3.1 spec for every API. Generated from code annotations — never handwritten.
CHANGELOG.md generated from Conventional Commits on every release. Breaking changes clearly marked.
Runbook for all operational procedures: restart, error handling, scaling, alert response.
JSDoc/TSDoc on all public functions: parameters, return types, one-line description.
Storybook for UI component libraries with all states shown.

R10 — DEPENDENCIES

Lockfiles always committed to Git. pnpm-lock.yaml preferred.
Use pnpm over npm. Faster, stricter resolution, disk-efficient.
Dependabot or Renovate from day one. Security patches auto-merged, major versions reviewed.
Before adding any package: verify activity, last update, license. No abandoned packages.
Bundle size budget enforced in CI. Breaches require explicit justification.
Monorepos: Turborepo or Nx for build caching and workspace management.
SBOM generated with Syft or CycloneDX. Required for enterprise client delivery.

R11 — UI/UX, ACCESSIBILITY & PERFORMANCE
Legal requirement: WCAG 2.1 Level AA (ADA Title II, mandatory April 2026):

Perceivable: alt text on images, captions on video, 4.5:1 color contrast minimum.
Operable: keyboard-accessible everything. Visible focus indicators. No mouse-only interactions.
Understandable: clear errors with fix instructions. Visible form labels. Predictable navigation.
Robust: semantic HTML, correct ARIA roles. Test with NVDA and VoiceOver.

Core Web Vitals targets:

LCP ≤ 2.5s | INP ≤ 200ms | CLS ≤ 0.1 | TTFB ≤ 600ms

Rules:

Design system (tokens) defined before building any component. Use shadcn/ui or Radix UI.
Mobile-first responsive design always.
Every interactive element has loading, empty, error, and success states.
Images: WebP/AVIF, lazy loading, correct sizing. Never unoptimized in production.
axe-core in CI — accessibility violations fail the build same as test failures.

R12 — CLIENT DELIVERY
A project is not done when code is written. It is done when another person can operate it.
Mandatory delivery package:

Deployment guide: step-by-step, DNS, SSL, env vars, rollback procedure.
Runbook: restart, common errors, scaling, incident response.
Credential transfer: hosting, DNS, domain registrar, API keys — via password manager, not email.
CHANGELOG of all changes since project start.

Contract standards:

IP ownership agreement signed before project begins.
Written change request process for anything outside scope. No verbal scope changes.
30-day post-launch bug support included in project contract.
Maintenance = separate contract. Never conflate project delivery with ongoing support.
Payment tied to deliverables, not calendar dates. Typical: 30% upfront / 30% milestone / 40% delivery.

R13 — PROJECT MANAGEMENT

Default scoping method: Shape Up — define appetite (time budget) before defining solution.
6-week build cycles + 2-week cool-down. Unfinished work is re-evaluated, not auto-extended.
Ongoing client product work: Agile/Scrum with 1–2 week sprints.
Maintenance/support work: Kanban with WIP limits.

R14 — QUALITY METRICS (DORA)
Track as habits on every project:

Lead Time for Changes: under 24 hours
Deployment Frequency: multiple times per day
Change Failure Rate: under 5%
Mean Time to Restore: under 1 hour
AI PR Acceptance Rate: over 35%

MODEL ROUTING (ANTIGRAVITY)
TaskModelArchitecture / system designOpus 4.6 ThinkingSpec writing / ADR / requirementsSonnet 4.6 ThinkingSecurity review / code auditSonnet 4.6 ThinkingDebugging complex issuesOpus 4.6 ThinkingFull feature implementation + testsGemini 3.1 Pro HighUI components + accessibilityGemini 3.1 Pro HighCI/CD config / IaC / scaffoldingGemini 3.1 Pro LowDocs / README / runbooksGemini 3.1 Pro LowQuick fixes / small refactors / boilerplateGemini Flash
Rule: Use Thinking models when reasoning matters. Use Pro High for full implementation. Use Flash for fast low-stakes tasks.
