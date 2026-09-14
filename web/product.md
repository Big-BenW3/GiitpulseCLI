# Lenear — Landing Page Product Specification

> **Catch it before they do.**

## 1. Document Purpose

This document defines the structure, visual direction, interaction patterns, copy direction, and implementation requirements for the **Lenear marketing website**.

Lenear is an AI-powered code review tool with a CLI, dashboard, documentation, and landing page.

The landing page must communicate one simple idea:

> **Lenear helps developers catch problems in their code before somebody else does.**

The site should feel like a **serious developer product**, not a generic AI SaaS landing page.

---

# 2. Design Direction

## Overall aesthetic

The site should be:

- Sleek
- Professional
- Technical
- Minimal
- Confident
- Editorial
- Developer-focused
- Spacious
- Fast-feeling
- High quality

The visual language should take inspiration from the provided references:

- The **Optise reference** informs the hero composition: simple navigation, strong left-aligned headline/content, a substantial product/demo visual on the right, and a restrained trust/credibility area underneath.
- The **Parabola reference** informs the navigation behavior and product presentation: a compact, polished navbar with a strong visual hierarchy and product-oriented dropdown/mega-menu treatment.

These are **directional references only**. Do not reproduce their branding, layout pixel-for-pixel, illustrations, or visual assets.

---

# 3. What Lenear Should NOT Look Like

This is an explicit design constraint.

### No AI slop.

Do not use:

- Purple AI gradients
- Blue/purple gradient text
- Glowing blobs
- Floating glass cards everywhere
- Excessive glassmorphism
- Generic AI sparkles
- Robot illustrations
- Neural-network graphics
- Abstract glowing spheres
- Random floating 3D objects
- Excessive rounded pills
- Fake terminal animations everywhere
- Constant blinking indicators
- "AI-powered" badges scattered throughout the page
- Decorative code floating around for no reason
- Excessive shadows
- Stock illustrations
- Stock photography
- Generic SaaS template sections

### No blinking status indicator

There must be **no blinking green dot, "online" indicator, live pulse, or similar decorative status element at the top of the page**.

The design should communicate quality through typography, spacing, composition, and actual product UI.

---

# 4. Typography

Do **not** use Inter.

The typography should feel distinctive and editorial while remaining highly readable.

Preferred direction:

- Geist
- Söhne-style grotesk
- Neue Montreal-style grotesk
- General Sans
- Manrope
- Another high-quality modern grotesk

The final choice should be based on visual quality rather than trend-following.

### Typography hierarchy

Use strong contrast between:

- Large hero headline
- Section headlines
- Supporting copy
- Navigation
- UI labels
- Code/terminal text

Code should use a dedicated monospace typeface such as:

- JetBrains Mono
- Geist Mono
- IBM Plex Mono

Do not use a monospace font for normal marketing copy.

---

# 5. Colour System

The primary Lenear brand colours are:

## Lenear White

```text
#FFFFFF
```

## Lenear Navy

```text
#0B1F3A
```

Supporting dark surfaces:

```text
Background: #050B14
Surface:    #0A1424
Border:     #172A42
Muted:      #8B9AB0
```

The palette should remain restrained.

## Important rule

**No gradients.**

Use solid colours, subtle opacity changes, borders, and tonal layering instead.

The site should primarily use:

```text
White
+
Deep Navy
+
Blue-black
+
Muted blue-gray
```

The absence of excessive colour is intentional.

---

# 6. Logo

The logo is the lowercase wordmark:

```text
lenear
```

There is **no custom L icon** in the primary logo.

The wordmark itself is the brand.

The tagline is:

> Catch it before they do.

Use the tagline selectively.

For the navbar:

```text
lenear
```

For the hero:

```text
Catch it before they do.
```

For footer/brand lockups, the tagline may be used where appropriate.

---

# 7. Site Navigation

The navbar should take visual direction from the provided Parabola reference.

It should be compact and extremely clean.

### Desktop structure

```text
lenear

Product     How it works     Resources     About

                         Log in     Get started
```

The exact navigation can be:

```text
Product
How it works
Resources
About
```

Right side:

```text
Log in
Get started
```

### Navbar behaviour

The navbar should:

- Be visually light
- Have generous horizontal spacing
- Avoid oversized height
- Use subtle borders where appropriate
- Have a clear primary CTA
- Remain readable against the hero
- Transition cleanly when scrolling

Do not use a giant floating glass navbar.

Do not add decorative indicators.

### Product dropdown

If implemented, the Product navigation can open a compact, well-designed panel containing:

```text
CLI
Run reviews directly from your terminal.

Dashboard
Track reviews, findings, and history.

Documentation
Learn how to install and use Lenear.
```

The dropdown should feel like a real product navigation system, not a marketing gimmick.

---

# 8. Page Structure

The homepage consists of:

1. Hero
2. Value proposition
3. About Lenear
4. How it works
5. Traditional debugging/review comparison
6. FAQ
7. Final CTA
8. Footer

The sections should flow naturally rather than appearing as disconnected cards.

---

# 9. HERO

## Purpose

The hero must communicate Lenear immediately.

The user should understand:

- What Lenear is
- Who it is for
- What problem it solves
- What action to take

within a few seconds.

## Layout

Use a composition inspired by the Optise reference.

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│ lenear      Product   How it works   Resources   About │
│                                      Log in Get started │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Catch it before they do.        ┌───────────────────┐ │
│                                  │                   │ │
│  AI code review built for        │  Product / CLI   │ │
│  developers who ship.            │  visual          │ │
│                                  │                   │ │
│  [ Get started ] [ View docs ]   │                   │ │
│                                  └───────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

The left side carries the message.

The right side carries a **real Lenear product visual**.

Do not use a generic illustration.

---

## Hero headline direction

Primary headline:

> **Catch it before they do.**

Supporting copy should explain the product directly.

Example direction:

> **AI code review built for developers who want to catch bugs, security issues, and risky changes before they ship.**

Keep the copy concise.

Do not overload the hero with marketing language.

---

## Hero CTAs

Primary:

> **Get started**

Secondary:

> **View documentation**

Potential CLI-oriented supporting text:

```bash
lenear review .
```

This should be presented as a real command, not as a decorative fake terminal.

---

# 10. HERO PRODUCT VISUAL

The right side of the hero should show the actual Lenear experience.

Possible visual:

```text
┌───────────────────────────────────────┐
│ lenear review                         │
├───────────────────────────────────────┤
│                                       │
│  Review complete                      │
│                                       │
│  3 issues found                       │
│                                       │
│  HIGH                                 │
│  SQL injection risk                   │
│  src/api/users.ts:84                  │
│                                       │
│  MEDIUM                               │
│  Unhandled promise rejection          │
│  src/auth/service.ts:129              │
│                                       │
│  LOW                                  │
│  Unnecessary database query           │
│                                       │
└───────────────────────────────────────┘
```

The visual should look like an actual product screen.

It can combine:

- CLI output
- Code review findings
- Code snippets
- Dashboard UI

The visual must be believable and useful.

---

# 11. VALUE PROPOSITION

## Purpose

Immediately after the hero, establish the three or four strongest reasons developers should use Lenear.

Do not create a wall of six/eight generic feature cards.

Use a strong visual hierarchy.

### Suggested structure

```text
Why Lenear

Catch problems earlier.
Review code before the rest of the team has to.

┌────────────────┐
│ Catch issues   │
│ Find problems  │
│ before review. │
└────────────────┘

┌────────────────┐
│ Understand     │
│ Know why the   │
│ issue matters. │
└────────────────┘

┌────────────────┐
│ Ship with      │
│ confidence     │
│ Review before  │
│ it reaches prod│
└────────────────┘
```

Potential value propositions:

### Catch issues earlier

Find bugs, security concerns, risky patterns, and other problems before they become review comments or production incidents.

### Understand the problem

Lenear should not merely flag a line.

It should explain:

- What is wrong
- Why it matters
- Where it happens
- What should change

### Move faster

Spend less time manually hunting through changes and more time actually building.

### Consistent review

Give every change another layer of review without relying entirely on somebody remembering to catch the same class of issue.

---

# 12. ABOUT LENEAR

## Purpose

This section should simply explain what Lenear is.

### IMPORTANT

Do **not** use a two-column layout.

Do not create:

```text
About      [random illustration]
```

Instead use **one strong content block/card**.

Suggested composition:

```text
ABOUT LENEAR

Code review should not begin after someone finds the problem.

Lenear reviews your code before that happens.

It runs alongside your development workflow, analyzes your changes,
finds issues worth paying attention to, and explains what needs to
be addressed.

Whether you are reviewing a small change or an entire repository,
Lenear gives you another pair of eyes before the code moves forward.
```

The section can have one subtle supporting product visual beside or underneath the card if needed, but the **core content itself remains one coherent block**.

The goal is clarity, not visual complexity.

---

# 13. HOW IT WORKS

This is one of the major visual sections.

## Interaction concept: layered card deck

The section should use a **deck-of-cards scroll interaction**.

As the user scrolls, cards progressively layer on top of one another.

The interaction should feel physical and deliberate.

Not gimmicky.

---

## Initial state

Cards are arranged vertically or slightly offset.

Example:

```text
┌──────────────────────────────┐
│ 01   Point Lenear at code    │
│                              │
│     lenear review .          │
└──────────────────────────────┘

       ┌──────────────────────────────┐
       │ 02   Lenear analyzes it      │
       └──────────────────────────────┘

              ┌──────────────────────────────┐
              │ 03   Review findings         │
              └──────────────────────────────┘
```

---

## Scroll state

As the user scrolls:

```text
        ┌──────────────────────────────┐
        │ 01  Point it at your code    │
        └──────────────────────────────┘
                 ↓
        ┌──────────────────────────────┐
        │ 02  Lenear analyzes changes  │
        └──────────────────────────────┘
                 ↓
        ┌──────────────────────────────┐
        │ 03  Review findings          │
        └──────────────────────────────┘
```

Cards gradually stack.

The previous cards remain partially visible beneath the current card.

---

## Final state

```text
┌─────────────────────────────────────┐
│                                     │
│  03                                 │
│  Review the findings                │
│                                     │
│  Severity, explanation, location    │
│  and suggested action.              │
│                                     │
└─────────────────────────────────────┘
   ─────────────────────────────────
     previous cards underneath
```

---

# 14. HOW IT WORKS CONTENT

Use four steps.

## 01 — Connect your code

Install Lenear and point it at the project.

```bash
lenear init
```

or:

```bash
lenear review .
```

## 02 — Lenear reviews it

Lenear analyzes the relevant code and changes.

The visual should show the review process through actual interface content.

## 03 — See what matters

Issues should be grouped by meaningful severity and location.

Example:

```text
HIGH
SQL injection risk

src/api/users.ts:84
```

## 04 — Fix before it ships

The developer gets enough context to understand and address the problem before somebody else catches it.

---

# 15. CARD DECK IMPLEMENTATION

The deck animation should be scroll-driven.

Recommended behaviour:

- Section has enough vertical height to create scroll space.
- Cards are sticky within the section.
- Each card has a defined stacking order.
- Current card moves into the primary position.
- Previous cards remain slightly visible underneath.
- Scale/translation should be subtle.
- No excessive rotation.
- No springy cartoon animation.
- No random floating.

### Motion principles

Use:

- `transform`
- `translateY`
- `scale`
- subtle opacity
- sticky positioning

Avoid:

- aggressive rotation
- bouncing
- flashing
- constant looping animation

The interaction should feel like physically moving through a stack of documents.

---

# 16. TRADITIONAL DEBUGGING / REVIEW COMPARISON

This section should visually compare Lenear against the traditional workflow.

The comparison should be **smooth and connected**, not two unrelated cards.

## Core idea

Show the old workflow flowing into the Lenear workflow.

Example:

```text
TRADITIONAL

Write code
    ↓
Push
    ↓
Wait for review
    ↓
Reviewer finds issue
    ↓
Context switching
    ↓
Fix
    ↓
Repeat
```

Then transition smoothly into:

```text
WITH LENEAR

Write code
    ↓
lenear review .
    ↓
Issues surfaced
    ↓
Understand
    ↓
Fix
    ↓
Push with confidence
```

---

# 17. COMPARISON VISUAL

Use two large connected cards.

### Card 1

```text
Traditional review

Slow feedback
Reviewer-dependent
Context switching
Issues found late
Repeated review cycles
```

### Card 2

```text
With Lenear

Immediate feedback
Always available
Developer-controlled
Issues found earlier
Cleaner review cycles
```

But these should **flow into one another**.

Do not use a generic:

```text
Old          New
❌            ✓
```

comparison table.

Instead create a visual transition.

---

# 18. COMPARISON ANIMATION

As the user scrolls:

### Stage 1

Traditional workflow appears.

```text
Write → Push → Wait → Review
```

### Stage 2

The flow becomes visually congested.

A problem is discovered late.

### Stage 3

The visual transitions toward Lenear.

```text
Write → Review → Understand → Fix → Push
```

### Stage 4

The Lenear workflow settles into a clean final card.

The animation should communicate the difference without requiring excessive text.

---

# 19. FAQ

The FAQ should be extremely clean.

Use an accordion.

No giant cards.

Example:

### What is Lenear?

Lenear is an AI-powered code review tool that analyzes your code and changes to identify problems before they reach the rest of your workflow.

### Does Lenear replace code review?

No. Lenear provides an additional layer of review. It helps developers catch issues earlier while leaving human review for context, architecture, product decisions, and other judgment-heavy work.

### How do I use Lenear?

Install the CLI, initialize your project, and run a review.

```bash
lenear review .
```

### What languages does Lenear support?

List the currently supported languages and frameworks here.

This must always reflect actual product capabilities.

### Can I run Lenear locally?

Explain the actual supported execution model here.

Do not promise functionality that the product does not provide.

### Does Lenear modify my code?

Clearly explain whether Lenear only reports findings or can also propose/apply fixes.

### How does Lenear handle my code?

Explain the actual privacy/data-processing model here.

This answer must be precise and factual.

---

# 20. FINAL CTA

The final CTA should be strong but simple.

Suggested headline:

> **Catch it before they do.**

Supporting copy:

> Give your code another pair of eyes before it reaches the next person in the chain.

Primary CTA:

> **Get started**

Secondary:

> **Read the docs**

Terminal treatment:

```bash
lenear review .
```

The CTA should not feel like a repeated sales pitch.

It should feel like the natural conclusion of the page.

---

# 21. FOOTER

Footer should be minimal.

Suggested structure:

```text
lenear
Catch it before they do.

Product
How it works
CLI
Dashboard

Resources
Documentation
GitHub
Changelog

Company
About
Contact

© Lenear
```

Do not overload the footer.

---

# 22. RESPONSIVE DESIGN

The design must work properly across:

- Large desktop
- Laptop
- Tablet
- Mobile

## Desktop

Hero:

```text
2-column composition
```

Navigation:

```text
full navigation
```

How it works:

```text
large card deck
```

Comparison:

```text
connected visual flow
```

## Mobile

The hero becomes:

```text
headline
↓
description
↓
CTA
↓
product visual
```

Navigation becomes a clean mobile menu.

The card deck remains, but cards become full-width.

Comparison becomes:

```text
Traditional
↓
transition
↓
Lenear
```

Do not simply shrink the desktop layout.

---

# 23. Accessibility

The site must remain usable without animation.

Respect:

```css
prefers-reduced-motion
```

For users who prefer reduced motion:

- Disable deck movement
- Disable scroll-driven transitions
- Present cards normally
- Keep all content accessible

Animations must never contain essential information that is unavailable statically.

---

# 24. Performance

The landing page should be fast.

Priorities:

1. Typography loads efficiently.
2. Images are optimized.
3. Product visuals are lightweight.
4. Animations use GPU-friendly transforms.
5. Avoid unnecessary JavaScript.
6. Avoid large video backgrounds.
7. Avoid excessive client-side rendering.
8. Do not load libraries solely for decorative effects.

The deck interaction should be implemented efficiently rather than through an unnecessarily heavy animation framework.

---

# 25. Component Structure

Recommended implementation structure:

```text
app/
├── page
│
components/
├── navbar/
├── hero/
├── value-proposition/
├── about/
├── how-it-works/
│   ├── review-deck/
│   └── review-card/
├── comparison/
├── faq/
├── final-cta/
└── footer/
```

Each section should remain independently maintainable.

---

# 26. Content Rules

Lenear copy should be:

- Short
- Direct
- Technical
- Confident
- Human

Avoid phrases such as:

> Revolutionize your workflow with next-generation AI.

> Supercharge your development journey.

> Unlock unprecedented productivity.

> Harness the power of intelligent automation.

Instead:

> Find the problem before it ships.

> Review your changes before someone else does.

> See what is wrong. Understand why. Fix it.

> Run a review from your terminal.

---

# 27. Visual Hierarchy

The entire homepage should follow this hierarchy:

```text
                LENEAR
                   ↓
        CATCH IT BEFORE THEY DO
                   ↓
           WHAT LENEAR DOES
                   ↓
        WHY IT MATTERS
                   ↓
          HOW IT WORKS
                   ↓
       OLD WAY → LENEAR
                   ↓
             QUESTIONS
                   ↓
          START USING LENEAR
```

Every section must answer a question.

Do not add sections merely because a SaaS landing page "usually has them."

---

# 28. Design Principles

## Principle 1 — Product over decoration

Show the actual product wherever possible.

## Principle 2 — Restraint

If an animation does not communicate something, remove it.

## Principle 3 — Typography matters

The typography and spacing should carry the design.

## Principle 4 — No AI clichés

Lenear should look like a developer tool, not an AI advertisement.

## Principle 5 — Real interface over mockup

Product visuals should resemble the actual CLI/dashboard.

## Principle 6 — Motion has purpose

Every major animation should communicate a transition, workflow, or relationship.

## Principle 7 — Make the page feel expensive

Quality should come from:

- spacing
- typography
- alignment
- hierarchy
- interaction
- restraint

not from gradients and visual noise.

---

# 29. Definition of Done

The landing page is considered complete when:

- [ ] Lenear wordmark is used consistently.
- [ ] White + deep navy identity is consistent.
- [ ] No gradients exist.
- [ ] Inter is not used.
- [ ] No blinking top indicator exists.
- [ ] Navbar matches the intended compact professional direction.
- [ ] Hero follows the strong left-content/right-product-visual composition.
- [ ] Hero clearly communicates the Lenear value proposition.
- [ ] Hero contains real-looking product UI.
- [ ] Value proposition is concise.
- [ ] About section uses a single coherent content card/block.
- [ ] How-it-works uses a scroll-driven layered card deck.
- [ ] Card deck works on mobile.
- [ ] Traditional review vs Lenear comparison flows together visually.
- [ ] Comparison communicates the workflow difference clearly.
- [ ] FAQ uses a clean accordion.
- [ ] Final CTA reinforces "Catch it before they do."
- [ ] Footer remains minimal.
- [ ] Reduced-motion behaviour is implemented.
- [ ] Responsive layouts are deliberately designed.
- [ ] No unnecessary AI/3D/gradient decoration exists.
- [ ] Product visuals accurately represent the real Lenear product.
- [ ] The page feels like one coherent developer product rather than a collection of SaaS sections.

---

# 30. Final Creative Direction

Lenear should feel like this:

```text
                    lenear

              Catch it before they do.

        A serious tool for serious developers.

       ┌──────────────────────────────┐
       │ $ lenear review .             │
       │                               │
       │  3 issues found               │
       │                               │
       │  HIGH   SQL injection risk    │
       │  MED    Promise rejection     │
       │  LOW    Unnecessary query     │
       └──────────────────────────────┘

       clean typography
       deep navy
       white
       precise motion
       real product UI
       no visual noise
```

The site should not scream for attention.

It should **look confident enough not to need to**.

> **Lenear — Catch it before they do.**
